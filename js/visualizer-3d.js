/**
 * Visualizer 3D - Three.js Engine & GeoGebra Integration
 * Mô phỏng không gian 3D cầu vượt giao thông và hai trục chéo nhau
 */

const Visualizer3D = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  container: null,
  animationFrameId: null,
  
  // Interactive 3D Objects
  roadBottom: null,
  roadTop: null,
  ramp1: null,
  ramp2: null,
  pillars: [],
  perpendicularLine: null,
  markerM: null,
  markerN: null,
  
  // State params
  params: {
    skewAngle: 75, // degrees
    clearanceH: 5.5, // meters
    roadWidth: 4.0,
    rampLength: 30.0,
    showPerpendicular: true,
    showRamps: true
  },

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Check Three.js availability
    if (typeof THREE === 'undefined') {
      this.container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 p-6 text-center"><div><i class="lucide-alert-circle text-3xl mb-2 text-amber-500"></i><p>Đang tải thư viện đồ họa 3D Three.js...</p></div></div>';
      return;
    }

    // Clear previous canvas
    this.container.innerHTML = '';

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 480;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Slate-900
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    this.camera.position.set(35, 25, 45);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls check
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go underground
      this.controls.target.set(0, 3, 0);
    }

    // Lights
    this.setupLighting();

    // Environment & Grid
    this.setupEnvironment();

    // Build Model
    this.buildBridgeModel();

    // Events
    window.addEventListener('resize', () => this.onResize());

    // Start Loop
    this.animate();
  },

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 1, 60);
    blueLight.position.set(0, 10, 0);
    this.scene.add(blueLight);
  },

  setupEnvironment() {
    // Ground Plane (P)
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Spatial Reference Grid
    const grid = new THREE.GridHelper(120, 60, 0x38bdf8, 0x334155);
    grid.position.y = 0.02;
    this.scene.add(grid);

    // Axes Helper
    const axes = new THREE.AxesHelper(15);
    axes.position.set(-30, 0.1, -30);
    this.scene.add(axes);
  },

  buildBridgeModel() {
    // Clear old elements if any
    if (this.roadBottom) this.scene.remove(this.roadBottom);
    if (this.roadTop) this.scene.remove(this.roadTop);
    if (this.ramp1) this.scene.remove(this.ramp1);
    if (this.ramp2) this.scene.remove(this.ramp2);
    this.pillars.forEach(p => this.scene.remove(p));
    this.pillars = [];
    if (this.perpendicularLine) this.scene.remove(this.perpendicularLine);
    if (this.markerM) this.scene.remove(this.markerM);
    if (this.markerN) this.scene.remove(this.markerN);

    const rad = (this.params.skewAngle * Math.PI) / 180;
    const H = this.params.clearanceH;
    const W = this.params.roadWidth;

    // 1. Lower Road (d1): Along Z-axis
    const lowerGeo = new THREE.BoxGeometry(W, 0.4, 80);
    const lowerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    this.roadBottom = new THREE.Mesh(lowerGeo, lowerMat);
    this.roadBottom.position.set(0, 0.2, 0);
    this.roadBottom.receiveShadow = true;
    this.scene.add(this.roadBottom);

    // Lower Road Centerline
    const lowerLineGeo = new THREE.BoxGeometry(0.2, 0.42, 80);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const lowerLine = new THREE.Mesh(lowerLineGeo, lineMat);
    lowerLine.position.set(0, 0.22, 0);
    this.scene.add(lowerLine);

    // 2. Upper Road Bridge Deck (d2): Crossed by skew angle theta at height H
    const topLength = 50;
    const topGeo = new THREE.BoxGeometry(topLength, 0.6, W);
    const topMat = new THREE.MeshStandardMaterial({ 
      color: 0x0284c7,
      metalness: 0.3, 
      roughness: 0.4 
    });
    this.roadTop = new THREE.Mesh(topGeo, topMat);
    this.roadTop.position.set(0, H, 0);
    this.roadTop.rotation.y = rad;
    this.roadTop.castShadow = true;
    this.roadTop.receiveShadow = true;
    this.scene.add(this.roadTop);

    // 3. Support Pillars (Trụ chữ T vuông góc với mặt phẳng đáy)
    const pDist = 16;
    const p1X = Math.cos(rad) * pDist;
    const p1Z = -Math.sin(rad) * pDist;
    const p2X = -p1X;
    const p2Z = -p1Z;

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    [ {x: p1X, z: p1Z}, {x: p2X, z: p2Z} ].forEach(pos => {
      const colGeo = new THREE.CylinderGeometry(1.0, 1.2, H - 0.3, 24);
      const col = new THREE.Mesh(colGeo, pillarMat);
      col.position.set(pos.x, (H - 0.3) / 2, pos.z);
      col.castShadow = true;
      col.receiveShadow = true;
      this.scene.add(col);
      this.pillars.push(col);

      // T-Cap
      const capGeo = new THREE.BoxGeometry(1.2, 0.6, W * 1.3);
      const cap = new THREE.Mesh(capGeo, pillarMat);
      cap.position.set(pos.x, H - 0.4, pos.z);
      cap.rotation.y = rad;
      cap.castShadow = true;
      this.scene.add(cap);
      this.pillars.push(cap);
    });

    // 4. Common Perpendicular Segment MN (Đoạn vuông góc chung)
    if (this.params.showPerpendicular) {
      const lineCurve = new THREE.LineCurve3(
        new THREE.Vector3(0, 0.4, 0),
        new THREE.Vector3(0, H - 0.3, 0)
      );
      const tubeGeo = new THREE.TubeGeometry(lineCurve, 20, 0.18, 12, false);
      const tubeMat = new THREE.MeshBasicMaterial({ 
        color: H >= 4.75 ? 0x10b981 : 0xef4444 
      });
      this.perpendicularLine = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(this.perpendicularLine);

      const sphereGeo = new THREE.SphereGeometry(0.45, 16, 16);
      this.markerM = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      this.markerM.position.set(0, 0.4, 0);
      this.scene.add(this.markerM);

      this.markerN = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      this.markerN.position.set(0, H - 0.3, 0);
      this.scene.add(this.markerN);
    }
  },

  setSkewAngle(angle) {
    this.params.skewAngle = parseFloat(angle);
    this.buildBridgeModel();
  },

  setClearanceH(height) {
    this.params.clearanceH = parseFloat(height);
    this.buildBridgeModel();
  },

  togglePerpendicular(show) {
    this.params.showPerpendicular = show;
    this.buildBridgeModel();
  },

  resetCamera() {
    if (this.camera && this.controls) {
      this.camera.position.set(35, 25, 45);
      this.controls.target.set(0, 3, 0);
      this.controls.update();
    }
  },

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 480;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
};

window.Visualizer3D = Visualizer3D;

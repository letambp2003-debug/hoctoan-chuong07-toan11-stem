/**
 * STEM Challenge Module - Toán 11 Chương VII
 * TRỌNG TÂM CỦA APP: Quy trình 7 bước EDP + Challenge Mode cho học sinh chuyên
 */

const StemChallenge = {
  currentStage: 'ASK',
  challengeMode: false,

  stages: ['ASK', 'MODEL', 'DESIGN', 'SIMULATE', 'BUILD', 'TEST', 'IMPROVE'],

  stageNames: {
    ASK: '1. ASK (Đặt vấn đề)',
    MODEL: '2. MODEL (Mô hình hóa)',
    DESIGN: '3. DESIGN (Thiết kế)',
    SIMULATE: '4. SIMULATE (Mô phỏng 3D)',
    BUILD: '5. BUILD (Chế tạo mô hình)',
    TEST: '6. TEST (Thử nghiệm & Đo)',
    IMPROVE: '7. IMPROVE (Cải tiến)'
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = DataLoader.getData();
    if (!data.stem || !data.stem.challenge) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p>Chưa có dữ liệu STEM. Vui lòng kiểm tra file data/stem.json.</p>
        </div>
      `;
      return;
    }

    const { meta, challenge } = data.stem;

    container.innerHTML = `
      <!-- Centerpiece Hero Banner -->
      <div class="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl mb-8 border border-sky-500/20 relative overflow-hidden">
        <div class="absolute -right-12 -top-12 opacity-10 pointer-events-none">
          <i class="lucide-compass text-9xl"></i>
        </div>
        <div class="max-w-4xl relative z-10">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3.5 py-1 bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 pulse-stem-badge">
              <i class="lucide-zap w-3.5 h-3.5 text-amber-400"></i>
              MÔ ĐUN TRỌNG TÂM CỦA TOÁN 11
            </span>
            <span class="px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded-full">
              Quy trình kỹ thuật 7 bước EDP
            </span>
          </div>

          <h1 class="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            ${challenge.title}
          </h1>

          <p class="text-sky-100 text-sm md:text-base leading-relaxed mb-6">
            ${challenge.driving_question}
          </p>

          <!-- Challenge Mode Toggle Button -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div class="flex items-center gap-3">
              <span class="text-xs font-semibold text-slate-300">Chế độ hiển thị:</span>
              <button 
                onclick="StemChallenge.toggleChallengeMode()" 
                id="btn-challenge-toggle"
                class="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${this.challengeMode ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-white/10 text-white hover:bg-white/20'}">
                <i class="lucide-sparkles w-4 h-4"></i>
                ${this.challengeMode ? '⚡ Challenge Mode: ĐANG BẬT' : '⚡ Bật Challenge Mode (Học sinh chuyên)'}
              </button>
            </div>
            <div class="text-xs text-sky-300 font-medium">
              4 Vai trò kĩ sư • Tích hợp GeoGebra 3D • Đánh giá 100 điểm
            </div>
          </div>
        </div>
      </div>

      <!-- Challenge Mode Banner -->
      <div id="challenge-mode-banner" class="${this.challengeMode ? 'block' : 'hidden'} mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border-2 border-amber-400/40 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0">
            ⚡
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              Dành riêng cho học sinh trường chuyên (Advanced Mode)
            </h3>
            <p class="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
              Yêu cầu phân tích sâu: (1) Bài toán tối ưu dầm dốc, (2) So sánh phương án kết cấu đa tiêu chí, và (3) Bắt buộc chứng minh bằng toán học thuần túy cho các quan sát từ GeoGebra 3D.
            </p>
          </div>
        </div>
      </div>

      <!-- 7-Step EDP Progress Stepper Bar -->
      <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 mb-8 overflow-x-auto">
        <div class="flex items-center min-w-[700px] justify-between relative">
          ${this.stages.map((stg, idx) => `
            <button 
              onclick="StemChallenge.setStage('${stg}')"
              id="step-btn-${stg}"
              class="stem-step-item flex flex-col items-center gap-1.5 z-10 px-3 py-2 rounded-xl transition-all ${stg === this.currentStage ? 'active bg-sky-50 text-sky-900 font-bold' : 'text-slate-500 hover:text-slate-800'}">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${stg === this.currentStage ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'bg-slate-100 text-slate-600'}">
                ${idx + 1}
              </div>
              <span class="text-xs whitespace-nowrap">${stg}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Step Content Area -->
      <div id="stem-stage-content" class="space-y-6"></div>
    `;

    this.renderCurrentStage();
  },

  setStage(stage) {
    this.currentStage = stage;
    this.renderCurrentStage();

    this.stages.forEach(stg => {
      const btn = document.getElementById(`step-btn-${stg}`);
      if (btn) {
        if (stg === stage) {
          btn.className = 'stem-step-item flex flex-col items-center gap-1.5 z-10 px-3 py-2 rounded-xl transition-all active bg-sky-50 text-sky-900 font-bold';
          btn.querySelector('div').className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-sky-600 text-white shadow-md shadow-sky-600/30';
        } else {
          btn.className = 'stem-step-item flex flex-col items-center gap-1.5 z-10 px-3 py-2 rounded-xl transition-all text-slate-500 hover:text-slate-800';
          btn.querySelector('div').className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-600';
        }
      }
    });
  },

  toggleChallengeMode() {
    this.challengeMode = !this.challengeMode;
    this.render('tab-stem');
  },

  renderCurrentStage() {
    const stageContent = document.getElementById('stem-stage-content');
    if (!stageContent) return;

    const data = DataLoader.getData();
    const { challenge } = data.stem;

    switch (this.currentStage) {
      case 'ASK':
        stageContent.innerHTML = this.renderStageAsk(challenge);
        break;
      case 'MODEL':
        stageContent.innerHTML = this.renderStageModel(challenge);
        break;
      case 'DESIGN':
        stageContent.innerHTML = this.renderStageDesign(challenge);
        break;
      case 'SIMULATE':
        stageContent.innerHTML = this.renderStageSimulate(challenge);
        setTimeout(() => Visualizer3D.init('three-canvas-container'), 50);
        break;
      case 'BUILD':
        stageContent.innerHTML = this.renderStageBuild(challenge);
        break;
      case 'TEST':
        stageContent.innerHTML = this.renderStageTest(challenge);
        break;
      case 'IMPROVE':
        stageContent.innerHTML = this.renderStageImprove(challenge);
        break;
    }

    if (window.lucide) lucide.createIcons();
    if (window.renderMathInElement) {
      renderMathInElement(stageContent, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  },

  renderStageAsk(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 1 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            ASK: Đặt câu hỏi định hướng & Phân tích yêu cầu thiết kế
          </h2>
        </div>

        <div class="p-5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
            <i class="lucide-help-circle w-5 h-5"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Câu hỏi định hướng dự án</div>
            <p class="text-slate-800 text-sm md:text-base font-semibold leading-relaxed">
              "${challenge.driving_question}"
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i class="lucide-users w-4 h-4 text-sky-600"></i>
            Phân vai kỹ sư trong nhóm dự án
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${challenge.roles.map((role, idx) => `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition">
                <span class="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center mb-2">
                  ${idx + 1}
                </span>
                <div class="text-sm font-bold text-slate-900">${role}</div>
                <div class="text-xs text-slate-500 mt-1 leading-relaxed">
                  ${idx === 0 ? 'Thiết lập mô hình tọa độ, góc chéo và khoảng cách giải tích.' : 
                    idx === 1 ? 'Dựng mô hình GeoGebra 3D và trích xuất số liệu mô phỏng.' : 
                    idx === 2 ? 'Lựa chọn kết cấu mố trụ, dầm cầu và thi công mô hình vật lí.' : 
                    'Đo đạc kiểm nghiệm sai số và đối chiếu tiêu chuẩn an toàn.'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i class="lucide-shield-alert w-4 h-4 text-amber-500"></i>
            5 Ràng buộc kỹ thuật bắt buộc
          </h3>
          <div class="space-y-2">
            ${challenge.constraints.map(c => `
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <i class="lucide-check-circle-2 text-emerald-600 w-4 h-4 shrink-0"></i>
                <span class="text-xs md:text-sm text-slate-700 font-medium">${c}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i class="lucide-award w-4 h-4 text-indigo-600"></i>
            Thang điểm đánh giá dự án (Tổng 100 điểm)
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
              <div class="text-2xl font-black text-indigo-700">${challenge.assessment.math_accuracy}%</div>
              <div class="text-xs font-semibold text-slate-600 mt-1">Toán học chính xác</div>
            </div>
            <div class="p-3 rounded-xl bg-sky-50 border border-sky-100 text-center">
              <div class="text-2xl font-black text-sky-700">${challenge.assessment.digital_modeling}%</div>
              <div class="text-xs font-semibold text-slate-600 mt-1">Mô hình GeoGebra 3D</div>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <div class="text-2xl font-black text-emerald-700">${challenge.assessment.engineering_product}%</div>
              <div class="text-xs font-semibold text-slate-600 mt-1">Sản phẩm vật lí</div>
            </div>
            <div class="p-3 rounded-xl bg-purple-50 border border-purple-100 text-center">
              <div class="text-2xl font-black text-purple-700">${challenge.assessment.collaboration_defense}%</div>
              <div class="text-xs font-semibold text-slate-600 mt-1">Báo cáo & Phản biện</div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button onclick="StemChallenge.setStage('MODEL')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition">
            Tiếp tục sang bước MODEL <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStageModel(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 2 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            MODEL: Thiết lập mô hình hình học không gian
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 class="text-sm font-bold text-indigo-700 flex items-center gap-2">
              <i class="lucide-box w-4 h-4"></i> 1. Hai đường thẳng chéo nhau
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              Tuyến cao tốc bên dưới là đường thẳng $d_1$ nằm trên mặt phẳng nền $(P)$. Tuyến cầu vượt bên trên là đường thẳng $d_2$ nằm trên mặt phẳng song song $(Q)$ ở độ cao $H$. Do hướng giao thông giao cắt nhau ở góc $\\theta$, hai đường thẳng $d_1$ và $d_2$ chéo nhau trong không gian.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 class="text-sm font-bold text-emerald-700 flex items-center gap-2">
              <i class="lucide-git-commit w-4 h-4"></i> 2. Trụ đỡ vuông góc đáy
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              Trụ đỡ của cầu vượt được mô hình hóa bởi đoạn thẳng $SO \\perp (P)$. Theo tính chất hình học, vì $SO \\perp (P)$ nên $SO$ vuông góc với mọi đường thẳng nằm trong $(P)$, đảm bảo lực trọng tải truyền theo phương thẳng đứng xuống nền móng.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 class="text-sm font-bold text-sky-700 flex items-center gap-2">
              <i class="lucide-move-vertical w-4 h-4"></i> 3. Đoạn vuông góc chung $MN$
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              Khoảng cách an toàn tĩnh không là độ dài đoạn vuông góc chung $MN$ ($M \\in d_1, N \\in d_2, MN \\perp d_1, MN \\perp d_2$). Theo tiêu chuẩn thiết kế đường bộ, $MN \\ge 4.75\\text{ m}$ để bảo đảm mọi loại xe container, xe tải thùng qua lại an toàn bên dưới.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 class="text-sm font-bold text-amber-700 flex items-center gap-2">
              <i class="lucide-trending-up w-4 h-4"></i> 4. Góc dốc đường dẫn $\\alpha$
            </h4>
            <p class="text-xs text-slate-700 leading-relaxed">
              Mặt dốc dẫn lên cầu vượt tạo với mặt phẳng đáy góc phẳng của góc nhị diện $\\alpha$. Để xe lên dốc không bị trượt và tiết kiệm nhiên liệu, góc dốc phải thỏa mãn $\\tan\\alpha \\le 1/12 \\approx 4.76^\\circ$.
            </p>
          </div>
        </div>

        ${this.challengeMode ? `
          <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div class="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <i class="lucide-sparkles w-4 h-4"></i>
              CHALLENGE MODE: Thiết lập hệ tọa độ giải tích không gian Oxyz
            </div>
            <p class="text-xs text-slate-700 leading-relaxed">
              Chọn gốc tọa độ $O(0,0,0)$ tại chân đoạn vuông góc chung trên tuyến đường $d_1$.
              Trục $Oy$ dọc theo $d_1 \\implies \\vec{u_1} = (0, 1, 0)$. Trục $Oz$ hướng thẳng đứng theo đoạn vuông góc chung $MN \\implies N(0, 0, H)$.
              Đường thẳng $d_2$ qua $N$ và có vectơ chỉ phương $\\vec{u_2} = (\\sin\\theta, \\cos\\theta, 0)$.
              Khoảng cách giải tích:
              $$d(d_1, d_2) = \\frac{|[\\vec{u_1}, \\vec{u_2}] \\cdot \\vec{ON}|}{|[\\vec{u_1}, \\vec{u_2}]|} = H$$
            </p>
          </div>
        ` : ''}

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('ASK')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại ASK
          </button>
          <button onclick="StemChallenge.setStage('DESIGN')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Tiếp tục sang DESIGN <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },
  renderStageDesign(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 3 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            DESIGN: Đề xuất phương án kết cấu dầm, trụ & Tính tỉ lệ mô hình
          </h2>
        </div>

        <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <i class="lucide-ruler w-4 h-4"></i> Bảng quy đổi tỉ lệ mô hình vật lý
            </h4>
            <select id="scale-ratio" onchange="StemChallenge.updateScaleCalc()" class="px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20 text-xs">
              <option value="100">Tỉ lệ 1:100 (Khuyên dùng)</option>
              <option value="50">Tỉ lệ 1:50 (Mô hình lớn)</option>
              <option value="200">Tỉ lệ 1:200 (Mô hình mini)</option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-slate-400 mb-1">Chiều dài nhịp cầu thực:</div>
              <input type="number" id="real-span" value="30" step="5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="StemChallenge.updateScaleCalc()" />
              <div class="mt-2 text-emerald-400 font-bold" id="res-scale-span">Mô hình: 30 cm</div>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-slate-400 mb-1">Chiều cao tĩnh không thực:</div>
              <input type="number" id="real-clearance" value="5.5" step="0.5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="StemChallenge.updateScaleCalc()" />
              <div class="mt-2 text-emerald-400 font-bold" id="res-scale-clearance">Mô hình: 5.5 cm</div>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-white/10">
              <div class="text-slate-400 mb-1">Đường dốc dẫn thực:</div>
              <input type="number" id="real-ramp" value="40" step="5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="StemChallenge.updateScaleCalc()" />
              <div class="mt-2 text-emerald-400 font-bold" id="res-scale-ramp">Mô hình: 40 cm</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <span class="w-6 h-6 rounded-md bg-sky-100 text-sky-700 text-xs flex items-center justify-center">A</span>
              Phương án 1: Trụ đơn chữ T (T-Pillar)
            </div>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Chỉ chiếm diện tích 1 vị trí móng ở dải phân cách giữa.</li>
              <li>Dễ thi công mô hình que kem/in 3D.</li>
              <li>Yêu cầu xà mũ chữ T phải vuông góc với dầm cầu để chia đều tải trọng.</li>
            </ul>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <span class="w-6 h-6 rounded-md bg-purple-100 text-purple-700 text-xs flex items-center justify-center">B</span>
              Phương án 2: Trụ đôi cổng vòm (Portal Pier)
            </div>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Hai cột thẳng đứng vuông góc với sàn, nối bằng dầm ngang.</li>
              <li>Độ cứng không gian cực tốt, chịu rung lắc tốt.</li>
              <li>Chiếm diện tích hai bên mép đường.</li>
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('MODEL')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại MODEL
          </button>
          <button onclick="StemChallenge.setStage('SIMULATE')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Tiếp tục sang SIMULATE (3D & GeoGebra) <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStageSimulate(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 4 / 7</div>
            <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
              SIMULATE: Dựng hình và đo lường trên mô hình 3D & GeoGebra
            </h2>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Mô phỏng thời gian thực
          </span>
        </div>

        <div class="relative">
          <div id="three-canvas-container" class="rounded-2xl border border-slate-700"></div>

          <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel text-xs text-slate-800 flex flex-wrap items-center justify-between gap-4 border border-white/40 shadow-lg">
            <div class="flex items-center gap-4">
              <div>
                <span class="text-slate-500 block mb-0.5">Góc chéo $\\theta$: <strong id="val-3d-angle" class="text-sky-700">75°</strong></span>
                <input type="range" min="30" max="90" value="75" class="w-32 accent-sky-600" oninput="StemChallenge.on3DAngleChange(this.value)" />
              </div>
              <div>
                <span class="text-slate-500 block mb-0.5">Tĩnh không $H$: <strong id="val-3d-h" class="text-emerald-700">5.5 m</strong></span>
                <input type="range" min="40" max="80" value="55" class="w-32 accent-emerald-600" oninput="StemChallenge.on3DHChange(this.value)" />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="Visualizer3D.resetCamera()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1">
                <i class="lucide-rotate-ccw w-3.5 h-3.5"></i> Đặt lại góc nhìn
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-slate-100 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i class="lucide-monitor w-5 h-5 text-indigo-600"></i>
              Bản nhúng GeoGebra 3D Calculator
            </h3>
            <a href="https://www.geogebra.org/3d" target="_blank" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              Mở trên tab mới <i class="lucide-external-link w-3.5 h-3.5"></i>
            </a>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            Học sinh có thể dựng trực tiếp các đối tượng không gian trong applet bên dưới hoặc copy các câu lệnh chuẩn sau:
          </p>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 space-y-2">
            <div class="text-slate-500 font-sans font-bold text-xs uppercase">Lệnh gợi ý nhập vào GeoGebra:</div>
            <div class="p-2 bg-white rounded border border-slate-200">1. Đáy: <code>P: z = 0</code></div>
            <div class="p-2 bg-white rounded border border-slate-200">2. Trục đường 1: <code>d1: Line((0, 0, 0), Vector((0, 1, 0)))</code></div>
            <div class="p-2 bg-white rounded border border-slate-200">3. Trục đường 2: <code>d2: Line((0, 0, 5.5), Vector((cos(75°), sin(75°), 0)))</code></div>
            <div class="p-2 bg-white rounded border border-slate-200">4. Đoạn vuông góc chung: <code>MN: Segment((0, 0, 0), (0, 0, 5.5))</code></div>
            <div class="p-2 bg-white rounded border border-slate-200">5. Đo khoảng cách: <code>Distance(d1, d2)</code></div>
          </div>

          <div class="geogebra-wrapper">
            <iframe src="https://www.geogebra.org/3d?embed" allowfullscreen></iframe>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('DESIGN')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại DESIGN
          </button>
          <button onclick="StemChallenge.setStage('BUILD')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Tiếp tục sang BUILD <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStageBuild(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 5 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            BUILD: Chế tạo mô hình vật lí & Kiểm soát góc vuông
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <i class="lucide-layers w-4 h-4 text-sky-600"></i> Vật liệu khuyên dùng
            </h4>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Que kem gỗ hoặc tăm tre (dễ dán, chịu kéo tốt).</li>
              <li>Bìa carton sóng 3 lớp hoặc formex 5mm làm mặt đáy.</li>
              <li>Keo nến / súng bắn keo nóng để định vị nhanh.</li>
            </ul>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <i class="lucide-wrench w-4 h-4 text-amber-600"></i> Dụng cụ đo đạc
            </h4>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Thước ê-ke vuông góc 90° để căn trụ.</li>
              <li>Dây dọi con lắc nhỏ kiểm tra phương thẳng đứng.</li>
              <li>Thước đo góc vạn năng đo góc chéo $\\theta$.</li>
            </ul>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <i class="lucide-check-square w-4 h-4 text-emerald-600"></i> Tiêu chuẩn nghiệm thu
            </h4>
            <ul class="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Trụ vuông góc tuyệt đối với mặt đáy.</li>
              <li>Dầm không bị cong vênh hoặc võng quá 2mm.</li>
              <li>Đoạn vuông góc chung thể hiện rõ ràng bằng màu nổi bật.</li>
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('SIMULATE')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại SIMULATE
          </button>
          <button onclick="StemChallenge.setStage('TEST')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Tiếp tục sang TEST <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStageTest(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 6 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            TEST: Đo đạc thực nghiệm, tính sai số & Kiểm định an toàn
          </h2>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Nhập số liệu đo đạc thực nghiệm từ mô hình vật lý:
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Khoảng cách tĩnh không đo được (cm):</label>
              <input type="number" id="test-h-meas" value="5.4" step="0.1" class="w-full p-2 rounded-lg border border-slate-300 text-xs" oninput="StemChallenge.calcTestResults()" />
              <span class="text-slate-400 mt-1 block">Lý thuyết chuẩn: 5.5 cm</span>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Góc chéo đo được (°):</label>
              <input type="number" id="test-angle-meas" value="74" step="1" class="w-full p-2 rounded-lg border border-slate-300 text-xs" oninput="StemChallenge.calcTestResults()" />
              <span class="text-slate-400 mt-1 block">Lý thuyết chuẩn: 75°</span>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Độ lệch góc thẳng đứng trụ (°):</label>
              <input type="number" id="test-vert-meas" value="0.5" step="0.1" class="w-full p-2 rounded-lg border border-slate-300 text-xs" oninput="StemChallenge.calcTestResults()" />
              <span class="text-slate-400 mt-1 block">Yêu cầu dung sai: ≤ 1.5°</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div class="p-4 rounded-xl bg-white border border-slate-200">
              <div class="text-xs text-slate-500">Sai số tuyệt đối & tương đối tĩnh không:</div>
              <div id="res-test-err" class="text-lg font-extrabold text-emerald-600 mt-1">ΔH = 0.1 cm (1.82%)</div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-slate-200">
              <div class="text-xs text-slate-500">Kết luận kiểm định kỹ thuật:</div>
              <div id="res-test-verdict" class="text-lg font-extrabold text-emerald-600 mt-1">ĐẠT TIÊU CHUẨN AN TOÀN</div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('BUILD')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại BUILD
          </button>
          <button onclick="StemChallenge.setStage('IMPROVE')" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Tiếp tục sang IMPROVE <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStageImprove(challenge) {
    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div>
          <div class="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Giai đoạn 7 / 7</div>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-900">
            IMPROVE: Phân tích nguyên nhân sai số & Tối ưu hóa thiết kế
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
            <h4 class="text-sm font-bold text-rose-800 flex items-center gap-1.5">
              <i class="lucide-alert-triangle w-4 h-4"></i> Vấn đề: Võng dầm giữa nhịp
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Dầm quá dài chịu lực uốn gây cong xuống, làm giảm tĩnh không an toàn ở trung tâm.
            </p>
            <div class="text-xs font-semibold text-rose-700 pt-1 border-t border-rose-200">
              Giải pháp: Thêm xà gồ giằng hoặc tăng chiều cao tiết diện dầm chữ I.
            </div>
          </div>

          <div class="p-5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
            <h4 class="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <i class="lucide-alert-circle w-4 h-4"></i> Vấn đề: Dốc dẫn quá ngắn
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Góc dốc $\\alpha > 5^\\circ$ khiến xe lăn hoặc phương tiện khó vượt dốc an toàn.
            </p>
            <div class="text-xs font-semibold text-amber-700 pt-1 border-t border-amber-200">
              Giải pháp: Kéo dài chiều dài đường dẫn $L \\ge 12H$.
            </div>
          </div>

          <div class="p-5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
            <h4 class="text-sm font-bold text-purple-800 flex items-center gap-1.5">
              <i class="lucide-refresh-cw w-4 h-4"></i> Vấn đề: Trụ bị nghiêng lệch
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Keo dán chưa khô hoàn toàn đã lắp dầm khiến trụ bị xiên lệch khỏi phương thẳng đứng.
            </p>
            <div class="text-xs font-semibold text-purple-700 pt-1 border-t border-purple-200">
              Giải pháp: Sử dụng đồ gá ke góc cố định trụ trong 15 phút trước khi gắn nhịp.
            </div>
          </div>
        </div>

        ${this.challengeMode ? `
          <div class="mt-8 pt-8 border-t border-slate-200 space-y-6">
            <div class="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white shadow-xl space-y-6">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs">
                  ⚡ CHALLENGE MODE
                </span>
                <h3 class="text-lg font-bold text-white">
                  Phần mở rộng dành riêng cho học sinh chuyên Toán
                </h3>
              </div>

              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 class="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <i class="lucide-trending-down w-4 h-4"></i> 1. Bài toán tối ưu dầm dốc & chi phí
                </h4>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Gọi $W$ là bề rộng tuyến đường bên dưới, $\\theta$ là góc chéo giữa hai tuyến đường ($0 < \\theta \\le 90^\\circ$).
                  Chiều dài dầm nhịp chính vượt qua đường là $L_{beam} = \\frac{W}{\\sin\\theta}$.
                  Để chi phí vật liệu dầm nhỏ nhất, ta cần cực tiểu hóa $L_{beam}$:
                  $$\\min L_{beam} \\iff \\max \\sin\\theta \\iff \\theta = 90^\\circ$$
                  Do đó, phương án cầu trực giao ($90^\\circ$) luôn có chiều dài dầm ngắn nhất và tiết kiệm vật liệu dầm nhất!
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 class="text-sm font-bold text-sky-400 flex items-center gap-2">
                  <i class="lucide-columns w-4 h-4"></i> 2. So sánh phương án trực giao (90°) và xiên góc (45°–60°)
                </h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-xs text-left text-slate-300">
                    <thead class="text-slate-400 uppercase border-b border-white/10">
                      <tr>
                        <th class="py-2">Tiêu chí</th>
                        <th class="py-2">Cầu trực giao (90°)</th>
                        <th class="py-2">Cầu xiên góc (45°–60°)</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      <tr>
                        <td class="py-2 font-medium">Chiều dài dầm nhịp</td>
                        <td class="py-2 text-emerald-400">Ngắn nhất ($L = W$)</td>
                        <td class="py-2 text-amber-400">Dài hơn ($L = W / \\sin\\theta$)</td>
                      </tr>
                      <tr>
                        <td class="py-2 font-medium">Mô-men uốn $M = qL^2/8$</td>
                        <td class="py-2 text-emerald-400">Nhỏ nhất, an toàn võng</td>
                        <td class="py-2 text-rose-400">Lớn hơn gấp $1/\\sin^2\\theta$ lần</td>
                      </tr>
                      <tr>
                        <td class="py-2 font-medium">Độ mượt hướng giao thông</td>
                        <td class="py-2 text-amber-400">Cần uốn cong đường dẫn</td>
                        <td class="py-2 text-emerald-400">Thẳng tuyến, tốc độ cao hơn</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 class="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <i class="lucide-file-check w-4 h-4"></i> 3. Chứng minh toán học cho quan sát từ GeoGebra
                </h4>
                <div class="p-3 rounded-lg bg-black/40 font-mono text-xs text-slate-300 space-y-2">
                  <div class="font-bold text-amber-300">Định lý: Đoạn vuông góc chung $MN$ là khoảng cách ngắn nhất giữa hai điểm tùy ý trên $d_1$ và $d_2$.</div>
                  <div><strong>Chứng minh:</strong> Lấy $M_1 \\in d_1$ và $M_2 \\in d_2$ bất kì. Ta có:</div>
                  <div class="pl-3 text-emerald-300">$$\\vec{M_1 M_2} = \\vec{M_1 M} + \\vec{MN} + \\vec{N M_2}$$</div>
                  <div>Bình phương vô hướng hai vế:</div>
                  <div class="pl-3">$$M_1 M_2^2 = M_1 M^2 + MN^2 + N M_2^2 + 2(\\vec{M_1 M} \\cdot \\vec{MN} + \\vec{MN} \\cdot \\vec{N M_2} + \\vec{M_1 M} \\cdot \\vec{N M_2})$$</div>
                  <div>Vì $MN \\perp d_1 \\implies \\vec{M_1 M} \\cdot \\vec{MN} = 0$, và $MN \\perp d_2 \\implies \\vec{MN} \\cdot \\vec{N M_2} = 0$.</div>
                  <div>Do đó:</div>
                  <div class="pl-3 text-emerald-300">$$M_1 M_2^2 = MN^2 + (M_1 M^2 + N M_2^2 + 2 \\vec{M_1 M} \\cdot \\vec{N M_2}) = MN^2 + |\\vec{M_1 M} + \\vec{N M_2}|^2 \\ge MN^2$$</div>
                  <div>Đẳng thức xảy ra khi và chỉ khi $M_1 \\equiv M$ và $M_2 \\equiv N$. Vậy $d(d_1, d_2) = MN$ là khoảng cách nhỏ nhất (ĐPCM).</div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <button onclick="StemChallenge.setStage('TEST')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
            Quay lại TEST
          </button>
          <button onclick="App.switchTab('quiz')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2">
            Luyện tập 22 câu trong Quiz Center <i class="lucide-arrow-right w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  on3DAngleChange(val) {
    const el = document.getElementById('val-3d-angle');
    if (el) el.innerText = `${val}°`;
    Visualizer3D.setSkewAngle(val);
  },

  on3DHChange(val) {
    const h = (parseFloat(val) / 10).toFixed(1);
    const el = document.getElementById('val-3d-h');
    if (el) el.innerText = `${h} m`;
    Visualizer3D.setClearanceH(h);
  },

  updateScaleCalc() {
    const ratio = parseFloat(document.getElementById('scale-ratio')?.value) || 100;
    const spanM = parseFloat(document.getElementById('real-span')?.value) || 30;
    const clM = parseFloat(document.getElementById('real-clearance')?.value) || 5.5;
    const rampM = parseFloat(document.getElementById('real-ramp')?.value) || 40;

    const spanCm = ((spanM * 100) / ratio).toFixed(1);
    const clCm = ((clM * 100) / ratio).toFixed(1);
    const rampCm = ((rampM * 100) / ratio).toFixed(1);

    const elSpan = document.getElementById('res-scale-span');
    const elCl = document.getElementById('res-scale-clearance');
    const elRamp = document.getElementById('res-scale-ramp');

    if (elSpan) elSpan.innerText = `Mô hình: ${spanCm} cm`;
    if (elCl) elCl.innerText = `Mô hình: ${clCm} cm`;
    if (elRamp) elRamp.innerText = `Mô hình: ${rampCm} cm`;
  },

  calcTestResults() {
    const hMeas = parseFloat(document.getElementById('test-h-meas')?.value) || 5.4;
    const hTheo = 5.5;
    const diffH = Math.abs(hMeas - hTheo).toFixed(2);
    const pctErr = ((diffH / hTheo) * 100).toFixed(2);

    const vertDev = parseFloat(document.getElementById('test-vert-meas')?.value) || 0.5;

    const elErr = document.getElementById('res-test-err');
    const elVer = document.getElementById('res-test-verdict');

    if (elErr) elErr.innerText = `ΔH = ${diffH} cm (${pctErr}%)`;
    if (elVer) {
      if (pctErr <= 5 && vertDev <= 1.5) {
        elVer.className = 'text-lg font-extrabold text-emerald-600 mt-1';
        elVer.innerText = 'ĐẠT TIÊU CHUẨN AN TOÀN';
      } else {
        elVer.className = 'text-lg font-extrabold text-rose-600 mt-1';
        elVer.innerText = 'CHƯA ĐẠT (Sai số vượt ngưỡng cho phép)';
      }
    }
  }
};

window.StemChallenge = StemChallenge;

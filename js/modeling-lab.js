/**
 * Modeling Lab Module - Toán 11 Chương VII
 * Đọc từ modeling.json: Quy trình 4 bước và 7 bài toán mô hình hóa tương tác
 */

const ModelingLab = {
  currentTaskId: 'traffic_interchange',

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = DataLoader.getData();
    if (!data.modeling || !data.modeling.tasks) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p>Chưa có dữ liệu mô hình hóa. Vui lòng kiểm tra file data/modeling.json.</p>
        </div>
      `;
      return;
    }

    const { meta, process, tasks } = data.modeling;

    container.innerHTML = `
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i class="lucide-cpu text-9xl"></i>
        </div>
        <div class="max-w-3xl relative z-10">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Phòng thí nghiệm mô hình hóa
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium rounded-full">
              7 tình huống thực tế
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            ${meta.title}
          </h1>
          <p class="text-purple-200 text-sm md:text-base leading-relaxed mb-4">
            Vận dụng kiến thức hình học không gian Chương VII vào các bài toán kỹ thuật, đời sống và quy hoạch.
          </p>
        </div>
      </div>

      <!-- 4-Step Modeling Process -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 mb-8">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <i class="lucide-git-commit w-4 h-4 text-purple-600"></i>
          Quy trình 4 bước mô hình hóa toán học chuẩn
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${process.map(p => `
            <div class="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ${p.step}
              </div>
              <div>
                <div class="text-xs text-purple-600 font-semibold uppercase tracking-wider">Bước ${p.step}</div>
                <div class="text-sm font-bold text-slate-800 mt-0.5">${p.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Main Layout: Task List & Interactive Studio -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Task Selector Sidebar -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 sticky top-24">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Danh sách tình huống thực tế
            </h2>
            <div class="space-y-1.5" id="modeling-task-list">
              ${tasks.map(task => `
                <button 
                  onclick="ModelingLab.selectTask('${task.id}')"
                  id="btn-task-${task.id}"
                  class="w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 ${task.id === this.currentTaskId ? 'bg-purple-50 text-purple-900 border-l-4 border-purple-600 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                        ${task.lesson}
                      </span>
                      <span class="text-xs text-slate-400">Trang ${task.book_page}</span>
                    </div>
                    <div class="text-sm font-semibold">${task.title}</div>
                  </div>
                  <i class="lucide-chevron-right w-4 h-4 text-slate-400 shrink-0 mt-2"></i>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Task Interactive Workspace -->
        <div class="lg:col-span-8">
          <div id="modeling-workspace" class="space-y-6">
            <!-- Will be rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    this.renderCurrentTask();
  },

  selectTask(taskId) {
    this.currentTaskId = taskId;

    document.querySelectorAll('#modeling-task-list button').forEach(btn => {
      btn.className = btn.className.replace('bg-purple-50 text-purple-900 border-l-4 border-purple-600 shadow-sm', 'text-slate-700 hover:bg-slate-50');
    });

    const activeBtn = document.getElementById(`btn-task-${taskId}`);
    if (activeBtn) {
      activeBtn.className = 'w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 bg-purple-50 text-purple-900 border-l-4 border-purple-600 shadow-sm';
    }

    this.renderCurrentTask();
  },

  renderCurrentTask() {
    const workspace = document.getElementById('modeling-workspace');
    if (!workspace) return;

    const data = DataLoader.getData();
    const task = data.modeling.tasks.find(t => t.id === this.currentTaskId);
    if (!task) return;

    // Get specific task interactive template
    const taskDetail = this.getTaskContent(task);

    workspace.innerHTML = `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
        <!-- Title & Badges -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                ${task.lesson}
              </span>
              <span class="text-xs text-slate-500 font-medium">
                SGK trang ${task.book_page} (PDF trang ${task.source_pdf_page})
              </span>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900">
              ${task.title}
            </h2>
          </div>
        </div>

        <!-- Problem Focus -->
        <div class="my-6 p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-sm text-purple-950 leading-relaxed">
          <strong class="text-purple-800 block mb-1">Mục tiêu mô hình hóa:</strong>
          ${task.modeling_focus}
        </div>

        <!-- 4-Step Execution Content -->
        <div class="space-y-6">
          <!-- Step 1 & 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">1. Vấn đề thực tiễn</div>
              <p class="text-xs md:text-sm text-slate-700 leading-relaxed">${taskDetail.step1}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">2. Mô hình toán học</div>
              <p class="text-xs md:text-sm text-slate-700 leading-relaxed">${taskDetail.step2}</p>
            </div>
          </div>

          <!-- Step 3: Interactive Tool -->
          <div class="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <i class="lucide-calculator text-amber-400 w-5 h-5"></i>
                <h3 class="text-sm font-bold uppercase tracking-wider text-amber-400">
                  3. Giải quyết mô hình – Phòng tính toán tương tác
                </h3>
              </div>
              <span class="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">Tương tác trực tiếp</span>
            </div>
            ${taskDetail.interactiveHtml}
          </div>

          <!-- Step 4 -->
          <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs md:text-sm text-emerald-950">
            <strong class="text-emerald-800 block mb-1">4. Đối chiếu thực tiễn & Ứng dụng:</strong>
            ${taskDetail.step4}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    if (window.renderMathInElement) {
      renderMathInElement(workspace, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  },

  getTaskContent(task) {
    switch (task.id) {
      case 'traffic_interchange':
        return {
          step1: 'Tại nút giao thông khác mức (cầu vượt cao tốc), hai làn xe lưu thông trên hai cao độ khác nhau mà không cắt nhau trực tiếp.',
          step2: 'Mô hình hóa hai hướng di chuyển thành hai đường thẳng chéo nhau $d_1$ và $d_2$. Góc giữa hai hướng là góc $\\varphi$ giữa hai đường thẳng trong không gian, thỏa mãn $0^\\circ \\le \\varphi \\le 90^\\circ$.',
          interactiveHtml: `
            <div class="space-y-4">
              <div>
                <label class="text-xs text-slate-300 block mb-1">Góc nhị diện/góc đo giữa hai trục đường trên thực địa: <span id="val-theta" class="font-bold text-amber-400">120°</span></label>
                <input type="range" min="0" max="180" value="120" id="slider-theta" oninput="ModelingLab.calcTraffic(this.value)" class="w-full accent-amber-400" />
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-slate-300">Góc giữa hai đường thẳng trong không gian:</span>
                <span id="res-traffic" class="text-lg font-extrabold text-emerald-400">60°</span>
              </div>
              <p class="text-xs text-slate-400 italic">
                * Nguyên lý: Nếu góc tạo bởi hai vectơ chỉ phương là $\\theta > 90^\\circ$, thì góc giữa hai đường thẳng là $\\varphi = 180^\\circ - \\theta$.
              </p>
            </div>
          `,
          step4: 'Giúp kỹ sư quy hoạch thiết kế góc nhập làn, bán kính cong của nhánh rẽ nối hai tuyến đường nhằm đảm bảo tầm nhìn an toàn cho phương tiện di chuyển ở tốc độ cao.'
        };

      case 'basketball_pole':
        return {
          step1: 'Để bảng rổ đạt chuẩn thi đấu, cột bóng rổ cần vuông góc tuyệt đối với mặt sân phẳng.',
          step2: 'Mô hình hóa cột bóng rổ là đường thẳng $d$. Mặt sân là mặt phẳng $(P)$. Để kiểm tra $d \\perp (P)$, ta đo độ dài dây căng từ đỉnh cột tới 2 điểm phân biệt $A, B$ trên sân (không thẳng hàng với chân cột) để kiểm tra 2 tam giác vuông.',
          interactiveHtml: `
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Chiều cao cột $h$ (m):</label>
                  <input type="number" id="bp-h" value="3.05" step="0.05" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcBasketball()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Khoảng cách sàn $OA$ (m):</label>
                  <input type="number" id="bp-oa" value="4.00" step="0.1" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcBasketball()" />
                </div>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-slate-300">Độ dài dây căng lý thuyết $SA = \\sqrt{h^2 + OA^2}$:</span>
                <span id="res-bp" class="text-lg font-extrabold text-emerald-400">5.03 m</span>
              </div>
              <p class="text-xs text-slate-400">
                Nếu đo thực tế $SA$ và $SB$ trên 2 phương cắt nhau đều thỏa mãn định lý Pythagoras $\\implies$ Cột vuông góc mặt sân.
              </p>
            </div>
          `,
          step4: 'Phương pháp dây dọi và thước dây tam giác vuông là kỹ thuật phổ biến được các kỹ sư xây dựng sử dụng để kiểm tra độ thẳng đứng của cột nhà và kết cấu công trình.'
        };

      case 'aircraft':
        return {
          step1: 'Sau khi rời đường băng, máy bay cần đạt độ cao an toàn theo góc dốc nâng quy định.',
          step2: 'Quỹ đạo bay được xem là đường thẳng $d$. Mặt đất là mặt phẳng ngang $(P)$. Góc cất cánh $\\alpha$ là góc giữa $d$ và $(P)$, thỏa mãn $\\sin\\alpha = \\frac{h}{S}$.',
          interactiveHtml: `
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Quãng đường bay $S$ (m):</label>
                  <input type="number" id="air-s" value="5000" step="100" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcAircraft()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Độ cao đạt được $h$ (m):</label>
                  <input type="number" id="air-h" value="1200" step="50" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcAircraft()" />
                </div>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-slate-300">Góc cất cánh $\\alpha$:</span>
                <span id="res-aircraft" class="text-lg font-extrabold text-emerald-400">13.89° (An toàn)</span>
              </div>
            </div>
          `,
          step4: 'Giúp tính toán độ cao an toàn khi vượt qua các chướng ngại vật (núi, nhà cao tầng) xung quanh sân bay.'
        };

      case 'access_ramp':
        return {
          step1: 'Đường dốc cho người đi xe lăn cần có độ dốc an toàn để tự lăn lên mà không bị lật.',
          step2: 'Độ dốc quy chuẩn: $i = \\tan\\alpha \\le \\frac{1}{12} \\approx 0.0833$. Góc giữa đường dốc và mặt phẳng nằm ngang $\\alpha \\le \\arctan(1/12) \\approx 4.76^\\circ$. Chiều dài dốc tối thiểu $L \\ge 12h$.',
          interactiveHtml: `
            <div class="space-y-4">
              <div>
                <label class="text-xs text-slate-300 block mb-1">Chiều cao thềm cửa $h$ (cm): <span id="val-ramp-h" class="text-amber-400 font-bold">50 cm</span></label>
                <input type="range" min="10" max="150" value="50" class="w-full accent-amber-400" oninput="ModelingLab.calcRamp(this.value)" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div class="text-xs text-slate-400">Chiều dài dốc tối thiểu:</div>
                  <div id="res-ramp-l" class="text-base font-extrabold text-emerald-400">6.00 m</div>
                </div>
                <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div class="text-xs text-slate-400">Góc dốc chuẩn:</div>
                  <div class="text-base font-extrabold text-sky-400">≈ 4.76°</div>
                </div>
              </div>
            </div>
          `,
          step4: 'Quy chuẩn kỹ thuật quốc gia về xây dựng công trình đảm bảo người khuyết tật tiếp cận sử dụng (QCVN 10:2014/BXD).'
        };

      case 'bridge_clearance':
        return {
          step1: 'Tại đầu cầu vượt hoặc hầm chui, thanh hạn chế chiều cao được lắp đặt để ngăn ngừa xe quá khổ va chạm vào dầm cầu.',
          step2: 'Mô hình hóa thanh ngang là đường thẳng $d$. Mặt đường dốc là mặt phẳng $(P)$ (hoặc đường thẳng đáy). Khoảng cách $d(d, (P))$ là chiều cao tĩnh không.',
          interactiveHtml: `
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Tĩnh không khung giới hạn (m):</label>
                  <input type="number" id="bc-clearance" value="4.50" step="0.1" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcBridgeClearance()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Chiều cao xe tải (m):</label>
                  <input type="number" id="bc-truck" value="4.20" step="0.1" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcBridgeClearance()" />
                </div>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-slate-300">Kết luận kiểm tra:</span>
                <span id="res-bridge-clearance" class="text-sm font-bold text-emerald-400">CHO PHÉP LƯU THÔNG (Hở 0.30 m)</span>
              </div>
            </div>
          `,
          step4: 'Bảo vệ an toàn cho kết cấu hạ tầng giao thông và tránh các tai nạn đâm dầm nguy hiểm.'
        };

      case 'tripod':
        return {
          step1: 'Giá đỡ ba chân của máy ảnh hoặc máy trắc địa có 3 chân mở đều tạo thành hình chóp tam giác đều $S.ABC$.',
          step2: 'Chiều cao giá đỡ là khoảng cách từ đỉnh $S$ tới mặt phẳng đáy $(ABC)$. $h = SO = \\sqrt{l^2 - R^2}$ với $R = \\frac{a}{\\sqrt{3}}$ là bán kính ngoại tiếp đáy.',
          interactiveHtml: `
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Chiều dài mỗi chân $l$ (cm):</label>
                  <input type="number" id="tripod-l" value="120" step="5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcTripod()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Cạnh tam giác đáy $a$ (cm):</label>
                  <input type="number" id="tripod-a" value="80" step="5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcTripod()" />
                </div>
              </div>
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-slate-300">Chiều cao giá đỡ $h$:</span>
                <span id="res-tripod" class="text-lg font-extrabold text-emerald-400">110.74 cm</span>
              </div>
            </div>
          `,
          step4: 'Xác định chiều cao đặt thiết bị đo trắc địa hoặc máy quay phim một cách chính xác trong công tác thực địa.'
        };

      case 'air_conditioner':
        return {
          step1: 'Chọn máy điều hòa không khí có công suất làm lạnh phù hợp với kích thước căn phòng.',
          step2: 'Căn phòng hình hộp chữ nhật có thể tích $V = a \\cdot b \\cdot h$. Định mức công suất nhiệt chuẩn là $200\\text{ BTU/m}^3$.',
          interactiveHtml: `
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Dài (m):</label>
                  <input type="number" id="ac-a" value="5" step="0.5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcAC()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Rộng (m):</label>
                  <input type="number" id="ac-b" value="4" step="0.5" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcAC()" />
                </div>
                <div>
                  <label class="text-xs text-slate-300 block mb-1">Cao (m):</label>
                  <input type="number" id="ac-h" value="3.5" step="0.1" class="w-full px-2 py-1 rounded bg-white/10 text-white border border-white/20 text-xs" oninput="ModelingLab.calcAC()" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div class="text-xs text-slate-400">Thể tích phòng $V$:</div>
                  <div id="res-ac-v" class="text-base font-extrabold text-emerald-400">70 m³</div>
                </div>
                <div class="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div class="text-xs text-slate-400">Công suất đề xuất:</div>
                  <div id="res-ac-btu" class="text-base font-extrabold text-sky-400">14.000 BTU (1.5 HP)</div>
                </div>
              </div>
            </div>
          `,
          step4: 'Giúp tiết kiệm điện năng tiêu thụ, đảm bảo độ bền máy nén và độ mát đồng đều cho căn phòng.'
        };

      default:
        return { step1: '', step2: '', interactiveHtml: '', step4: '' };
    }
  },

  // Interactive Calculators
  calcTraffic(val) {
    const elVal = document.getElementById('val-theta');
    const elRes = document.getElementById('res-traffic');
    if (elVal) elVal.innerText = `${val}°`;
    const angle = parseFloat(val);
    const result = angle > 90 ? 180 - angle : angle;
    if (elRes) elRes.innerText = `${result}°`;
  },

  calcBasketball() {
    const h = parseFloat(document.getElementById('bp-h')?.value) || 3.05;
    const oa = parseFloat(document.getElementById('bp-oa')?.value) || 4;
    const sa = Math.sqrt(h * h + oa * oa).toFixed(2);
    const elRes = document.getElementById('res-bp');
    if (elRes) elRes.innerText = `${sa} m`;
  },

  calcAircraft() {
    const s = parseFloat(document.getElementById('air-s')?.value) || 5000;
    const h = parseFloat(document.getElementById('air-h')?.value) || 1200;
    const sinAlpha = Math.min(1, h / s);
    const deg = (Math.asin(sinAlpha) * 180 / Math.PI).toFixed(2);
    const elRes = document.getElementById('res-aircraft');
    if (elRes) elRes.innerText = `${deg}° (${deg >= 10 && deg <= 25 ? 'Góc chuẩn an toàn' : 'Cần kiểm tra'})`;
  },

  calcRamp(val) {
    const h = parseFloat(val);
    const elVal = document.getElementById('val-ramp-h');
    const elRes = document.getElementById('res-ramp-l');
    if (elVal) elVal.innerText = `${h} cm`;
    const lengthM = ((h * 12) / 100).toFixed(2);
    if (elRes) elRes.innerText = `${lengthM} m`;
  },

  calcBridgeClearance() {
    const hc = parseFloat(document.getElementById('bc-clearance')?.value) || 4.5;
    const ht = parseFloat(document.getElementById('bc-truck')?.value) || 4.2;
    const diff = (hc - ht).toFixed(2);
    const elRes = document.getElementById('res-bridge-clearance');
    if (!elRes) return;

    if (diff >= 0.3) {
      elRes.className = 'text-sm font-bold text-emerald-400';
      elRes.innerText = `CHO PHÉP LƯU THÔNG (Hở ${diff} m)`;
    } else if (diff > 0) {
      elRes.className = 'text-sm font-bold text-amber-400';
      elRes.innerText = `CẢNH BÁO: Hở hẹp (${diff} m)`;
    } else {
      elRes.className = 'text-sm font-bold text-rose-400';
      elRes.innerText = `CẤM QUA: NGUY CƠ ĐÂM DẦM (${Math.abs(diff)} m)`;
    }
  },

  calcTripod() {
    const l = parseFloat(document.getElementById('tripod-l')?.value) || 120;
    const a = parseFloat(document.getElementById('tripod-a')?.value) || 80;
    const R = a / Math.sqrt(3);
    const elRes = document.getElementById('res-tripod');
    if (!elRes) return;

    if (l <= R) {
      elRes.className = 'text-sm font-bold text-rose-400';
      elRes.innerText = 'Không thể dựng (Chân choãi quá rộng)';
    } else {
      const h = Math.sqrt(l * l - R * R).toFixed(2);
      elRes.className = 'text-lg font-extrabold text-emerald-400';
      elRes.innerText = `${h} cm`;
    }
  },

  calcAC() {
    const a = parseFloat(document.getElementById('ac-a')?.value) || 5;
    const b = parseFloat(document.getElementById('ac-b')?.value) || 4;
    const h = parseFloat(document.getElementById('ac-h')?.value) || 3.5;
    const V = (a * b * h).toFixed(1);
    const btu = Math.round(V * 200);

    let rec = '1.0 HP (9.000 BTU)';
    if (btu > 18000) rec = '2.5 HP (24.000 BTU)';
    else if (btu > 12000) rec = '2.0 HP (18.000 BTU)';
    else if (btu > 9000) rec = '1.5 HP (12.000 BTU)';

    const elV = document.getElementById('res-ac-v');
    const elBtu = document.getElementById('res-ac-btu');
    if (elV) elV.innerText = `${V} m³`;
    if (elBtu) elBtu.innerText = `${btu.toLocaleString()} BTU (${rec})`;
  }
};

window.ModelingLab = ModelingLab;

/**
 * Knowledge Hub Module - Toán 11 Chương VII
 * Đọc hoàn toàn từ knowledge.json và liên kết chéo với modeling.json & quiz.json
 */

const KnowledgeHub = {
  currentLessonId: 'bai22',

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = DataLoader.getData();
    if (!data.knowledge || !data.knowledge.lessons) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p>Chưa có dữ liệu kiến thức. Vui lòng kiểm tra file data/knowledge.json.</p>
        </div>
      `;
      return;
    }

    const { meta, lessons, end_of_chapter } = data.knowledge;

    container.innerHTML = `
      <!-- Header Meta Banner -->
      <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i class="lucide-book-open text-9xl"></i>
        </div>
        <div class="max-w-3xl relative z-10">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Lớp ${meta.grade} – Chương ${meta.chapter}
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium rounded-full flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Dữ liệu chuẩn SGK
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            ${meta.chapter_title}
          </h1>
          <p class="text-indigo-200 text-sm md:text-base leading-relaxed mb-4">
            ${meta.source} (${meta.scope}).
          </p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-indigo-300">
            <span class="flex items-center gap-1">
              <i class="lucide-file-text w-4 h-4"></i> Nguồn: ${meta.source_file}
            </span>
            <span class="flex items-center gap-1">
              <i class="lucide-check-circle w-4 h-4"></i> Tự động tải từ JSON (Không hardcode)
            </span>
          </div>
        </div>
      </div>

      <!-- Main Hub Container -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Sidebar: Lesson Navigation -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 sticky top-24">
            <div class="flex items-center justify-between px-3 py-2 mb-3 border-b border-slate-100">
              <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục bài học</h2>
              <span class="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">6 bài + ôn tập</span>
            </div>
            <nav class="space-y-1.5" id="lesson-nav-list">
              ${lessons.map((lesson, idx) => `
                <button 
                  onclick="KnowledgeHub.selectLesson('${lesson.id}')" 
                  id="btn-nav-${lesson.id}"
                  class="w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex items-start justify-between gap-2 ${lesson.id === this.currentLessonId ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}">
                  <div class="flex items-start gap-2.5">
                    <span class="w-6 h-6 rounded-lg ${lesson.id === this.currentLessonId ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'} text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      ${idx + 22}
                    </span>
                    <div>
                      <div class="font-semibold line-clamp-1">${lesson.title}</div>
                      <div class="text-xs text-slate-400 mt-0.5">SGK trang ${lesson.book_pages[0]}–${lesson.book_pages[lesson.book_pages.length - 1]}</div>
                    </div>
                  </div>
                  <i class="lucide-chevron-right w-4 h-4 text-slate-400 shrink-0 mt-1"></i>
                </button>
              `).join('')}

              <!-- End of Chapter Button -->
              <button 
                onclick="KnowledgeHub.selectLesson('end_of_chapter')" 
                id="btn-nav-end_of_chapter"
                class="w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between gap-2 ${this.currentLessonId === 'end_of_chapter' ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-700 hover:bg-slate-50'}">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 text-xs flex items-center justify-center font-bold shrink-0">
                    <i class="lucide-award w-3.5 h-3.5"></i>
                  </span>
                  <div>
                    <div class="font-semibold">Bài tập cuối chương VII</div>
                    <div class="text-xs text-slate-400 mt-0.5">Trang ${end_of_chapter.book_pages.join('–')} (PDF ${end_of_chapter.source_pages_pdf.join('–')})</div>
                  </div>
                </div>
                <i class="lucide-chevron-right w-4 h-4 text-slate-400 shrink-0"></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- Right Content: Detailed Lesson View -->
        <div class="lg:col-span-8">
          <div id="lesson-detail-container" class="space-y-6">
            <!-- Content will be rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    this.renderCurrentLesson();
  },

  selectLesson(lessonId) {
    this.currentLessonId = lessonId;
    
    document.querySelectorAll('#lesson-nav-list button').forEach(btn => {
      btn.className = btn.className.replace('bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 shadow-sm', 'text-slate-700 hover:bg-slate-50');
      const badge = btn.querySelector('span');
      if (badge && !badge.innerHTML.includes('award')) {
        badge.className = 'w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5';
      }
    });

    const activeBtn = document.getElementById(`btn-nav-${lessonId}`);
    if (activeBtn) {
      activeBtn.className = 'w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex items-start justify-between gap-2 bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 shadow-sm';
      const badge = activeBtn.querySelector('span');
      if (badge && !badge.innerHTML.includes('award')) {
        badge.className = 'w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5';
      }
    }

    this.renderCurrentLesson();
  },

  renderCurrentLesson() {
    const detailContainer = document.getElementById('lesson-detail-container');
    if (!detailContainer) return;

    const data = DataLoader.getData();

    if (this.currentLessonId === 'end_of_chapter') {
      const eoc = data.knowledge.end_of_chapter;
      detailContainer.innerHTML = `
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
              <i class="lucide-award w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Bài tập cuối chương VII</h2>
              <div class="text-xs text-slate-500">Trang sách: ${eoc.book_pages.join('–')} | File PDF: Trang ${eoc.source_pages_pdf.join('–')}</div>
            </div>
          </div>
          <div class="space-y-4">
            <p class="text-slate-600 text-sm leading-relaxed">
              Hệ thống bài tập tổng hợp rèn luyện toàn diện các kĩ năng của Chương VII:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${eoc.components.map(c => `
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                  <i class="lucide-check-circle-2 text-indigo-600 w-5 h-5 mt-0.5 shrink-0"></i>
                  <span class="text-sm text-slate-700 font-medium">${c}</span>
                </div>
              `).join('')}
            </div>
            <div class="pt-4 mt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button onclick="App.switchTab('quiz')" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition">
                <i class="lucide-help-circle w-4 h-4"></i> Làm bài tập tổng hợp 22 câu trong Quiz Center
              </button>
              <button onclick="App.switchTab('stem')" class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition">
                <i class="lucide-compass w-4 h-4"></i> Thực hiện STEM Challenge cầu vượt
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const lesson = DataLoader.getLesson(this.currentLessonId);
    if (!lesson) return;

    // Cross-reference data
    const modelingTasks = DataLoader.getModelingTaskForLesson(lesson.title) || [];
    const quizQuestions = DataLoader.getQuizForLesson(lesson.title) || [];

    detailContainer.innerHTML = `
      <!-- Card: Lesson Header & Citation -->
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              Toán 11 • Bài ${lesson.id.replace('bai', '')}
            </div>
            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${lesson.title}
            </h2>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
              <i class="lucide-book w-3.5 h-3.5 text-slate-500"></i> SGK tr. ${lesson.book_pages.join(', ')}
            </span>
            <span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1">
              <i class="lucide-file-text w-3.5 h-3.5 text-indigo-500"></i> PDF tr. ${lesson.source_pages_pdf.join(', ')}
            </span>
          </div>
        </div>

        <!-- 1. MỤC TIÊU CẦN ĐẠT -->
        <div class="mt-6">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            1. Mục tiêu cần đạt (Learning Outcomes)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${lesson.learning_outcomes.map(item => `
              <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
                <i class="lucide-check text-emerald-600 w-4 h-4 mt-0.5 shrink-0"></i>
                <span class="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. THUẬT NGỮ TRỌNG TÂM -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            2. Thuật ngữ cốt lõi (Key Terms)
          </h3>
          <div class="flex flex-wrap gap-2">
            ${lesson.terms.map(term => `
              <span class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 text-xs md:text-sm font-semibold border border-indigo-100/80 flex items-center gap-1.5">
                <i class="lucide-tag w-3.5 h-3.5 text-indigo-500"></i>
                ${term}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 3. KIẾN THỨC CỐT LÕI -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            3. Kiến thức cốt lõi (Core Knowledge)
          </h3>
          <div class="space-y-3">
            ${lesson.core_knowledge.map((item, idx) => `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                    ${idx + 1}
                  </span>
                  <h4 class="text-sm font-bold text-slate-900">${item.concept}</h4>
                </div>
                <div class="text-xs md:text-sm text-slate-700 leading-relaxed pl-7">
                  ${KnowledgeHub.formatMathText(item.summary)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. TÌNH HUỐNG THỰC TẾ -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-sky-500"></span>
            4. Tình huống thực tế trong đời sống
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${lesson.source_contexts.map(ctx => `
              <div class="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-center flex flex-col items-center justify-center gap-1.5">
                <i class="lucide-compass text-sky-600 w-5 h-5"></i>
                <span class="text-xs font-semibold text-slate-800">${ctx}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. HOẠT ĐỘNG MÔ HÌNH HÓA (LIÊN KẾT MODELING LAB) -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            5. Hoạt động mô hình hóa toán học (Mathematical Modeling)
          </h3>
          ${modelingTasks.length > 0 ? `
            <div class="space-y-3">
              ${modelingTasks.map(task => `
                <div class="p-4 rounded-xl bg-purple-50/40 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2 py-0.5 bg-purple-200/60 text-purple-800 text-xs font-bold rounded">
                        ${task.lesson}
                      </span>
                      <h4 class="text-sm font-bold text-slate-900">${task.title}</h4>
                    </div>
                    <p class="text-xs md:text-sm text-slate-600 leading-relaxed">
                      ${task.modeling_focus}
                    </p>
                  </div>
                  <button 
                    onclick="App.openModelingTask('${task.id}')" 
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm shrink-0 flex items-center gap-1.5 transition self-start md:self-auto">
                    <i class="lucide-cpu w-3.5 h-3.5"></i> Thực hành mô hình hóa
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">Xem thêm các tình huống tổng hợp trong Module Modeling Lab.</p>
          `}
        </div>

        <!-- 6. BÀI LUYỆN TẬP (LIÊN KẾT QUIZ CENTER) -->
        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            6. Bài luyện tập củng cố (${quizQuestions.length} câu hỏi)
          </h3>
          <div class="space-y-4">
            ${quizQuestions.map((q, qIdx) => KnowledgeHub.renderInlineQuestion(q, qIdx)).join('')}
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500">Muốn làm đề thi 25 phút đủ 22 câu hỏi toàn chương?</span>
            <button onclick="QuizCenter.setMode('exam'); App.switchTab('quiz')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
              <i class="lucide-timer w-3.5 h-3.5"></i> Mở Đề thi tính giờ (Đủ 22 câu) <i class="lucide-arrow-right w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    if (window.renderMathInElement) {
      renderMathInElement(detailContainer, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  },

  formatMathText(text) {
    if (!text) return '';
    return text
      .replace(/V = \(1\/3\)·S·h/g, '$V = \\frac{1}{3} S \\cdot h$')
      .replace(/V = S·h/g, '$V = S \\cdot h$')
      .replace(/V = \(1\/3\)·\(S \+ S' \+ √\(S·S'\)\)·h/g, '$V = \\frac{1}{3} (S + S\' + \\sqrt{S \\cdot S\'}) \\cdot h$')
      .replace(/0° đến 90°/g, '$0^\\circ$ đến $90^\\circ$')
      .replace(/90°/g, '$90^\\circ$');
  },

  renderInlineQuestion(q, idx) {
    if (q.type === 'mc') {
      return `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80" id="inline-q-${q.id}">
          <div class="flex items-start gap-2 mb-2">
            <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold shrink-0">Câu ${idx + 1}</span>
            <span class="text-xs md:text-sm font-semibold text-slate-800">${q.question}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            ${q.options.map((opt, optIdx) => `
              <button 
                onclick="KnowledgeHub.checkInlineMC(${q.id}, ${optIdx}, ${q.answer})" 
                id="inline-btn-${q.id}-${optIdx}"
                class="text-left p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:border-indigo-400 transition">
                <span class="font-bold mr-1">${String.fromCharCode(65 + optIdx)}.</span> ${opt}
              </button>
            `).join('')}
          </div>
          <div id="inline-fb-${q.id}" class="mt-2 text-xs font-semibold hidden"></div>
        </div>
      `;
    } else if (q.type === 'tf') {
      return `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80" id="inline-q-${q.id}">
          <div class="flex items-start gap-2 mb-2">
            <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold shrink-0">Câu ${idx + 1} (Đúng/Sai)</span>
            <span class="text-xs md:text-sm font-semibold text-slate-800">${q.question}</span>
          </div>
          <div class="space-y-1.5 mt-2">
            ${q.statements.map(([stmt, ans], sIdx) => `
              <div class="p-2 rounded bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <span class="text-slate-700 font-medium">${stmt}</span>
                <span class="px-2 py-0.5 rounded text-xs font-bold ${ans ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  ${ans ? 'ĐÚNG' : 'SAI'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.type === 'short') {
      return `
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80" id="inline-q-${q.id}">
          <div class="flex items-start gap-2 mb-2">
            <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-bold shrink-0">Câu ${idx + 1} (Trả lời ngắn)</span>
            <span class="text-xs md:text-sm font-semibold text-slate-800">${q.question}</span>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input 
              type="number" 
              step="any" 
              id="inline-input-${q.id}" 
              placeholder="Nhập đáp số (${q.unit})..." 
              class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs w-48 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            <button 
              onclick="KnowledgeHub.checkInlineShort(${q.id}, ${q.answer}, ${q.tolerance || 0}, '${q.unit}')" 
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition">
              Kiểm tra
            </button>
          </div>
          <div id="inline-fb-${q.id}" class="mt-2 text-xs font-semibold hidden"></div>
        </div>
      `;
    }
    return '';
  },

  checkInlineMC(qId, selectedIdx, correctIdx) {
    const fb = document.getElementById(`inline-fb-${qId}`);
    if (!fb) return;

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`inline-btn-${qId}-${i}`);
      if (btn) {
        btn.classList.remove('bg-emerald-100', 'border-emerald-500', 'text-emerald-900', 'bg-rose-100', 'border-rose-500', 'text-rose-900');
        if (i === correctIdx) {
          btn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-900');
        } else if (i === selectedIdx) {
          btn.classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900');
        }
      }
    }

    fb.classList.remove('hidden', 'text-emerald-600', 'text-rose-600');
    if (selectedIdx === correctIdx) {
      fb.classList.add('text-emerald-600');
      fb.innerHTML = '<i class="lucide-check-circle inline w-3.5 h-3.5 mr-1"></i> Chính xác! Bạn đã chọn đáp án đúng.';
    } else {
      fb.classList.add('text-rose-600');
      fb.innerHTML = `<i class="lucide-x-circle inline w-3.5 h-3.5 mr-1"></i> Chưa chính xác. Đáp án đúng là: ${String.fromCharCode(65 + correctIdx)}.`;
    }
    if (window.lucide) lucide.createIcons();
  },

  checkInlineShort(qId, correctAns, tolerance, unit) {
    const input = document.getElementById(`inline-input-${qId}`);
    const fb = document.getElementById(`inline-fb-${qId}`);
    if (!input || !fb) return;

    const val = parseFloat(input.value);
    if (isNaN(val)) {
      fb.classList.remove('hidden');
      fb.className = 'mt-2 text-xs font-semibold text-amber-600';
      fb.innerText = 'Vui lòng nhập một số.';
      return;
    }

    const isCorrect = Math.abs(val - correctAns) <= (tolerance || 0.01);
    fb.classList.remove('hidden', 'text-emerald-600', 'text-rose-600');
    if (isCorrect) {
      fb.classList.add('text-emerald-600');
      fb.innerHTML = `<i class="lucide-check-circle inline w-3.5 h-3.5 mr-1"></i> Chính xác! Đáp số là ${correctAns} ${unit}.`;
    } else {
      fb.classList.add('text-rose-600');
      fb.innerHTML = `<i class="lucide-x-circle inline w-3.5 h-3.5 mr-1"></i> Chưa đúng. Đáp án chuẩn là ${correctAns} ${unit}.`;
    }
    if (window.lucide) lucide.createIcons();
  }
};

window.KnowledgeHub = KnowledgeHub;

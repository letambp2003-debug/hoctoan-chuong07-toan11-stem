/**
 * Quiz Center Module - Toán 11 Chương VII
 * Đọc từ quiz.json: 22 câu hỏi (Trắc nghiệm, Đúng/Sai đa mệnh đề, Trả lời ngắn)
 * Chế độ thi tính giờ hiển thị trọn vẹn 22 câu hỏi với bảng điều hướng câu hỏi
 */

const QuizCenter = {
  mode: 'exam', // Default to exam mode so all 22 questions are immediately prominent!
  currentFilter: 'all',
  answers: {}, // { [qId]: user_answer }
  examSubmitted: false,
  timerInterval: null,
  timeLeft: 25 * 60, // 25 minutes

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = DataLoader.getData();
    if (!data.quiz || !data.quiz.questions) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p>Chưa có dữ liệu câu hỏi. Vui lòng kiểm tra file data/quiz.json.</p>
        </div>
      `;
      return;
    }

    const { meta, questions } = data.quiz;

    // In EXAM mode, ALWAYS render all 22 questions! In practice mode, allow filtering.
    const questionsToRender = (this.mode === 'exam') 
      ? questions 
      : (this.currentFilter === 'all' ? questions : questions.filter(q => q.topic.includes(this.currentFilter)));

    container.innerHTML = `
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-rose-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i class="lucide-help-circle text-9xl"></i>
        </div>
        <div class="max-w-3xl relative z-10">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-rose-500/30 border border-rose-400/40 text-rose-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Trung tâm kiểm tra & Đánh giá
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Đầy đủ 22 câu hỏi chuẩn SGK
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            ${meta.title}
          </h1>
          <p class="text-rose-100 text-sm md:text-base leading-relaxed mb-4">
            Đánh giá toàn diện năng lực hình học không gian Chương VII qua 3 phần thi chuẩn đề thi mới của Bộ GD&ĐT: 12 câu Trắc nghiệm, 4 câu Đúng/Sai, 6 câu Trả lời ngắn.
          </p>
        </div>
      </div>

      <!-- Controls & Mode Bar -->
      <div class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-4">
        
        <!-- Mode Switcher -->
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Chế độ:</span>
          <div class="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onclick="QuizCenter.setMode('exam')" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.mode === 'exam' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i class="lucide-timer w-3.5 h-3.5"></i>
              Thi tính giờ (Đủ 22 câu)
            </button>
            <button 
              onclick="QuizCenter.setMode('practice')" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.mode === 'practice' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i class="lucide-book-open w-3.5 h-3.5"></i>
              Luyện tập tự do
            </button>
          </div>
        </div>

        <!-- Timer (In Exam Mode) -->
        ${this.mode === 'exam' ? `
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-mono text-sm font-bold shadow-sm">
              <i class="lucide-clock w-4 h-4 animate-pulse text-rose-600"></i>
              <span>Thời gian:</span>
              <span id="exam-timer-display" class="text-base font-black">${this.formatTime(this.timeLeft)}</span>
            </div>
            ${!this.examSubmitted ? `
              <button 
                onclick="QuizCenter.submitExam()" 
                class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5">
                <i class="lucide-send w-3.5 h-3.5"></i> Nộp bài
              </button>
            ` : ''}
          </div>
        ` : `
          <!-- Topic Filter (In Practice Mode) -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Lọc bài:</span>
            ${['all', 'Bài 22', 'Bài 23', 'Bài 24', 'Bài 25', 'Bài 26', 'Bài 27'].map(f => `
              <button 
                onclick="QuizCenter.setFilter('${f}')"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold transition ${this.currentFilter === f ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${f === 'all' ? 'Tất cả (22)' : f}
              </button>
            `).join('')}
          </div>
        `}
      </div>

      <!-- 22-Question Navigator Palette -->
      <div class="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/80 mb-8 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <i class="lucide-grid w-4 h-4 text-indigo-600"></i>
            Bảng 22 câu hỏi thi – Nhấn để chuyển nhanh đến câu:
          </h3>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1 text-slate-500">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Chưa làm
            </span>
            <span class="flex items-center gap-1 text-emerald-600 font-semibold">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Đã làm
            </span>
          </div>
        </div>

        <div class="grid grid-cols-11 sm:grid-cols-22 gap-1.5 pt-1">
          ${questions.map(q => {
            const isAnswered = this.isQuestionAnswered(q.id, q.type);
            return `
              <button 
                onclick="QuizCenter.scrollToQuestion(${q.id})"
                id="palette-btn-${q.id}"
                class="h-9 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center border ${isAnswered ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}">
                <span>${q.id}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Exam Result Summary (If submitted) -->
      <div id="exam-result-panel" class="${this.examSubmitted ? 'block' : 'hidden'} mb-8"></div>

      <!-- Questions List Container -->
      <div class="space-y-6" id="quiz-question-list">
        ${this.renderGroupedQuestions(questionsToRender)}
      </div>

      <!-- Exam Action Footer -->
      ${this.mode === 'exam' && !this.examSubmitted ? `
        <div class="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div class="text-sm font-bold text-slate-800">Hoàn thành bài thi 22 câu?</div>
            <div class="text-xs text-slate-500">Hệ thống sẽ chấm điểm chi tiết và hiển thị ma trận kết quả.</div>
          </div>
          <button 
            onclick="QuizCenter.submitExam()" 
            class="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2">
            <i class="lucide-send w-4 h-4"></i> Nộp bài thi & Chấm điểm (22 câu)
          </button>
        </div>
      ` : ''}
    `;

    if (window.lucide) lucide.createIcons();
    if (window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }

    if (this.mode === 'exam' && !this.timerInterval && !this.examSubmitted) {
      this.startExamTimer();
    }
  },

  isQuestionAnswered(qId, type) {
    if (type === 'mc') {
      return this.answers[qId] !== undefined;
    } else if (type === 'tf') {
      const sub = this.answers[qId];
      return sub && Object.keys(sub).length > 0;
    } else if (type === 'short') {
      return this.answers[qId] !== undefined && !isNaN(this.answers[qId]);
    }
    return false;
  },

  scrollToQuestion(qId) {
    const el = document.getElementById(`qc-card-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-indigo-500/40');
      setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500/40'), 1500);
    }
  },

  renderGroupedQuestions(questions) {
    // If in exam mode, group into Part I (MC), Part II (TF), Part III (Short)
    if (this.mode === 'exam') {
      const part1 = questions.filter(q => q.type === 'mc');
      const part2 = questions.filter(q => q.type === 'tf');
      const part3 = questions.filter(q => q.type === 'short');

      return `
        <!-- PHẦN 1 -->
        <div class="space-y-4">
          <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Phần I: Câu trắc nghiệm nhiều phương án lựa chọn (Câu 1 đến Câu 12)</span>
            <span class="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px]">12 câu</span>
          </div>
          ${part1.map((q, idx) => this.renderQuestion(q, idx)).join('')}
        </div>

        <!-- PHẦN 2 -->
        <div class="space-y-4 mt-8">
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Phần II: Câu trắc nghiệm Đúng / Sai (Câu 13 đến Câu 16)</span>
            <span class="px-2 py-0.5 rounded bg-amber-600 text-white text-[11px]">4 câu (16 mệnh đề)</span>
          </div>
          ${part2.map((q, idx) => this.renderQuestion(q, idx)).join('')}
        </div>

        <!-- PHẦN 3 -->
        <div class="space-y-4 mt-8">
          <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
            <span>Phần III: Câu trắc nghiệm trả lời ngắn (Câu 17 đến Câu 22)</span>
            <span class="px-2 py-0.5 rounded bg-sky-600 text-white text-[11px]">6 câu</span>
          </div>
          ${part3.map((q, idx) => this.renderQuestion(q, idx)).join('')}
        </div>
      `;
    }

    // Otherwise render regular list
    return questions.map((q, idx) => this.renderQuestion(q, idx)).join('');
  },
  setFilter(filter) {
    this.currentFilter = filter;
    this.render('tab-quiz');
  },

  setMode(newMode) {
    this.mode = newMode;
    this.examSubmitted = false;
    this.answers = {};
    this.currentFilter = 'all'; // Always reset filter to all!
    if (newMode === 'exam') {
      this.timeLeft = 25 * 60;
    } else {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.render('tab-quiz');
  },

  startExamTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const display = document.getElementById('exam-timer-display');
      if (display) {
        display.innerText = this.formatTime(this.timeLeft);
      }
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.submitExam();
      }
    }, 1000);
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  renderQuestion(q, idx) {
    const isPractice = this.mode === 'practice';
    const isSubmitted = this.examSubmitted;

    if (q.type === 'mc') {
      return `
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 transition-all" id="qc-card-${q.id}">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                ${q.id}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                ${q.topic}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Trắc nghiệm 4 lựa chọn
              </span>
            </div>
            ${isSubmitted ? this.renderScoreBadgeMC(q) : ''}
          </div>

          <h3 class="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
            ${q.question}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${q.options.map((opt, optIdx) => `
              <button 
                onclick="QuizCenter.handleSelectMC(${q.id}, ${optIdx}, ${q.answer})"
                id="qc-btn-${q.id}-${optIdx}"
                class="quiz-option text-left p-3.5 rounded-xl border border-slate-200 text-xs md:text-sm font-medium transition flex items-center gap-3 ${this.getMCOptionClass(q, optIdx)}">
                <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  ${String.fromCharCode(65 + optIdx)}
                </span>
                <span class="flex-1">${opt}</span>
              </button>
            `).join('')}
          </div>

          <div id="qc-fb-${q.id}" class="${isPractice && this.answers[q.id] !== undefined ? 'block' : 'hidden'} p-3 rounded-xl bg-slate-50 text-xs leading-relaxed">
            ${isPractice && this.answers[q.id] !== undefined ? this.getMCFeedbackHtml(q) : ''}
          </div>
        </div>
      `;
    } else if (q.type === 'tf') {
      return `
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 transition-all" id="qc-card-${q.id}">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                ${q.id}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                ${q.topic}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Đúng / Sai đa mệnh đề
              </span>
            </div>
            ${isSubmitted ? this.renderScoreBadgeTF(q) : ''}
          </div>

          <h3 class="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
            ${q.question}
          </h3>

          <div class="space-y-2">
            ${q.statements.map(([stmt, correctVal], sIdx) => `
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm">
                <span class="text-slate-800 font-medium flex-1">${stmt}</span>
                <div class="flex items-center gap-2 shrink-0">
                  <button 
                    onclick="QuizCenter.handleSelectTF(${q.id}, ${sIdx}, true)"
                    id="qc-tf-${q.id}-${sIdx}-true"
                    class="px-3 py-1.5 rounded-lg font-bold text-xs transition ${this.getTFClass(q.id, sIdx, true, correctVal)}">
                    ĐÚNG
                  </button>
                  <button 
                    onclick="QuizCenter.handleSelectTF(${q.id}, ${sIdx}, false)"
                    id="qc-tf-${q.id}-${sIdx}-false"
                    class="px-3 py-1.5 rounded-lg font-bold text-xs transition ${this.getTFClass(q.id, sIdx, false, correctVal)}">
                    SAI
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (q.type === 'short') {
      return `
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 transition-all" id="qc-card-${q.id}">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                ${q.id}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                ${q.topic}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                Trả lời ngắn
              </span>
            </div>
            ${isSubmitted ? this.renderScoreBadgeShort(q) : ''}
          </div>

          <h3 class="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
            ${q.question}
          </h3>

          <div class="flex items-center gap-3">
            <div class="relative w-64">
              <input 
                type="number" 
                step="any"
                id="qc-short-input-${q.id}"
                value="${this.answers[q.id] !== undefined ? this.answers[q.id] : ''}"
                oninput="QuizCenter.handleInputShort(${q.id}, this.value)"
                placeholder="Nhập số (${q.unit})..." 
                class="w-full p-2.5 rounded-xl border border-slate-300 text-xs md:text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none pr-12" />
              <span class="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">${q.unit}</span>
            </div>
            ${isPractice ? `
              <button 
                onclick="QuizCenter.checkPracticeShort(${q.id}, ${q.answer}, ${q.tolerance || 0}, '${q.unit}')"
                class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition">
                Kiểm tra
              </button>
            ` : ''}
          </div>

          <div id="qc-fb-${q.id}" class="${isPractice && this.answers[q.id] !== undefined ? 'block' : 'hidden'} p-3 rounded-xl bg-slate-50 text-xs leading-relaxed">
            ${isPractice && this.answers[q.id] !== undefined ? this.getShortFeedbackHtml(q) : ''}
          </div>
        </div>
      `;
    }
    return '';
  },

  handleSelectMC(qId, selectedIdx, correctIdx) {
    if (this.examSubmitted) return;
    this.answers[qId] = selectedIdx;
    this.updatePaletteItem(qId, true);

    if (this.mode === 'practice') {
      const fb = document.getElementById(`qc-fb-${qId}`);
      if (fb) {
        fb.classList.remove('hidden');
        const isCorrect = selectedIdx === correctIdx;
        fb.className = `p-3 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`;
        fb.innerHTML = isCorrect 
          ? `<strong><i class="lucide-check-circle inline w-4 h-4 mr-1 text-emerald-600"></i> Chính xác!</strong> Đáp án đúng là ${String.fromCharCode(65 + correctIdx)}.`
          : `<strong><i class="lucide-x-circle inline w-4 h-4 mr-1 text-rose-600"></i> Chưa đúng!</strong> Đáp án chuẩn xác theo SGK là ${String.fromCharCode(65 + correctIdx)}.`;
        if (window.lucide) lucide.createIcons();
      }
      this.render('tab-quiz');
    } else {
      for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`qc-btn-${qId}-${i}`);
        if (btn) {
          if (i === selectedIdx) {
            btn.className = 'quiz-option text-left p-3.5 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-indigo-900 text-xs md:text-sm font-bold flex items-center gap-3';
          } else {
            btn.className = 'quiz-option text-left p-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs md:text-sm font-medium flex items-center gap-3';
          }
        }
      }
    }
  },

  updatePaletteItem(qId, isAnswered) {
    const btn = document.getElementById(`palette-btn-${qId}`);
    if (btn) {
      if (isAnswered) {
        btn.className = 'h-9 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center border bg-emerald-600 text-white border-emerald-700 shadow-sm';
      } else {
        btn.className = 'h-9 rounded-lg font-bold text-xs transition flex flex-col items-center justify-center border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
      }
    }
  },

  getMCOptionClass(q, optIdx) {
    const userAns = this.answers[q.id];
    if (this.mode === 'practice') {
      if (userAns === undefined) return 'text-slate-700 hover:border-indigo-400';
      if (optIdx === q.answer) return 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
      if (optIdx === userAns) return 'border-rose-500 bg-rose-50 text-rose-900';
      return 'text-slate-400 opacity-60';
    } else {
      if (this.examSubmitted) {
        if (optIdx === q.answer) return 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
        if (optIdx === userAns) return 'border-rose-500 bg-rose-50 text-rose-900';
        return 'text-slate-400 opacity-60';
      }
      if (userAns === optIdx) return 'border-2 border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
      return 'text-slate-700 hover:border-indigo-300';
    }
  },

  handleSelectTF(qId, sIdx, val) {
    if (this.examSubmitted) return;
    if (!this.answers[qId]) this.answers[qId] = {};
    this.answers[qId][sIdx] = val;
    this.updatePaletteItem(qId, true);
    this.render('tab-quiz');
  },

  getTFClass(qId, sIdx, val, correctVal) {
    const userVal = this.answers[qId] && this.answers[qId][sIdx];
    if (this.mode === 'practice' || this.examSubmitted) {
      if (userVal === undefined) return 'bg-slate-200 text-slate-700 hover:bg-slate-300';
      if (val === correctVal) return 'bg-emerald-600 text-white font-bold';
      if (userVal === val && val !== correctVal) return 'bg-rose-600 text-white font-bold';
      return 'bg-slate-200 text-slate-400 opacity-50';
    } else {
      if (userVal === val) return 'bg-indigo-600 text-white font-bold';
      return 'bg-slate-200 text-slate-700 hover:bg-slate-300';
    }
  },

  handleInputShort(qId, val) {
    if (this.examSubmitted) return;
    const num = parseFloat(val);
    this.answers[qId] = num;
    this.updatePaletteItem(qId, !isNaN(num));
  },

  checkPracticeShort(qId, correctAns, tolerance, unit) {
    const val = parseFloat(document.getElementById(`qc-short-input-${qId}`)?.value);
    const fb = document.getElementById(`qc-fb-${qId}`);
    if (!fb) return;

    if (isNaN(val)) {
      fb.classList.remove('hidden');
      fb.className = 'p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs';
      fb.innerText = 'Vui lòng nhập một số.';
      return;
    }

    this.answers[qId] = val;
    this.updatePaletteItem(qId, true);
    const isCorrect = Math.abs(val - correctAns) <= (tolerance || 0.01);
    fb.classList.remove('hidden');
    fb.className = `p-3 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`;
    fb.innerHTML = isCorrect
      ? `<strong><i class="lucide-check-circle inline w-4 h-4 mr-1 text-emerald-600"></i> Chính xác!</strong> Đáp số đúng là ${correctAns} ${unit}.`
      : `<strong><i class="lucide-x-circle inline w-4 h-4 mr-1 text-rose-600"></i> Chưa đúng!</strong> Đáp số chuẩn theo SGK là ${correctAns} ${unit}.`;
    if (window.lucide) lucide.createIcons();
  },

  getMCFeedbackHtml(q) {
    const isCorrect = this.answers[q.id] === q.answer;
    return isCorrect
      ? `<strong class="text-emerald-700">Chính xác!</strong> Đáp án đúng là ${String.fromCharCode(65 + q.answer)}.`
      : `<strong class="text-rose-700">Chưa chính xác!</strong> Đáp án chuẩn xác là ${String.fromCharCode(65 + q.answer)}.`;
  },

  getShortFeedbackHtml(q) {
    const isCorrect = Math.abs((this.answers[q.id] || 0) - q.answer) <= (q.tolerance || 0.01);
    return isCorrect
      ? `<strong class="text-emerald-700">Chính xác!</strong> Đáp số đúng là ${q.answer} ${q.unit}.`
      : `<strong class="text-rose-700">Chưa đúng!</strong> Đáp án chuẩn là ${q.answer} ${q.unit}.`;
  },

  renderScoreBadgeMC(q) {
    const isCorrect = this.answers[q.id] === q.answer;
    return isCorrect 
      ? '<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">ĐÚNG (+1.0)</span>'
      : '<span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs">SAI (0.0)</span>';
  },

  renderScoreBadgeTF(q) {
    let correctCount = 0;
    const userSub = this.answers[q.id] || {};
    q.statements.forEach(([_, correctVal], sIdx) => {
      if (userSub[sIdx] === correctVal) correctCount++;
    });
    let pts = 0;
    if (correctCount === 1) pts = 0.1;
    else if (correctCount === 2) pts = 0.25;
    else if (correctCount === 3) pts = 0.5;
    else if (correctCount === 4) pts = 1.0;

    return `<span class="px-2.5 py-1 rounded-lg ${correctCount === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} font-bold text-xs">Đúng ${correctCount}/4 (+${pts})</span>`;
  },

  renderScoreBadgeShort(q) {
    const val = this.answers[q.id];
    const isCorrect = val !== undefined && Math.abs(val - q.answer) <= (q.tolerance || 0.01);
    return isCorrect
      ? '<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">ĐÚNG (+1.0)</span>'
      : '<span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-xs">SAI (0.0)</span>';
  },

  submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.examSubmitted = true;

    const data = DataLoader.getData();
    const questions = data.quiz.questions;

    let totalScore = 0;
    let mcCount = 0;
    let tfCount = 0;
    let shortCount = 0;

    questions.forEach(q => {
      if (q.type === 'mc') {
        if (this.answers[q.id] === q.answer) {
          totalScore += 1.0;
          mcCount++;
        }
      } else if (q.type === 'tf') {
        let sc = 0;
        const sub = this.answers[q.id] || {};
        q.statements.forEach(([_, cVal], sIdx) => {
          if (sub[sIdx] === cVal) sc++;
        });
        if (sc === 1) totalScore += 0.1;
        else if (sc === 2) totalScore += 0.25;
        else if (sc === 3) totalScore += 0.5;
        else if (sc === 4) {
          totalScore += 1.0;
          tfCount++;
        }
      } else if (q.type === 'short') {
        const val = this.answers[q.id];
        if (val !== undefined && Math.abs(val - q.answer) <= (q.tolerance || 0.01)) {
          totalScore += 1.0;
          shortCount++;
        }
      }
    });

    const scaledScore = ((totalScore / 22) * 10).toFixed(2);

    try {
      localStorage.setItem('toan11_quiz_last_score', scaledScore);
    } catch (e) {}

    this.render('tab-quiz');

    // Show result panel
    const resPanel = document.getElementById('exam-result-panel');
    if (resPanel) {
      resPanel.classList.remove('hidden');
      resPanel.innerHTML = `
        <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-500/30">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full">KẾT QUẢ THI TOÁN 11 – CHƯƠNG VII (22 CÂU)</span>
              <h2 class="text-3xl font-extrabold mt-2">Điểm số: <span class="text-amber-400">${scaledScore} / 10</span></h2>
              <p class="text-xs text-slate-400 mt-1">Đạt ${totalScore.toFixed(2)} / 22 điểm thô chuẩn.</p>
            </div>
            <div class="grid grid-cols-3 gap-3 text-center text-xs">
              <div class="p-3 rounded-xl bg-white/10">
                <div class="text-slate-400">Trắc nghiệm</div>
                <div class="text-lg font-bold text-sky-400 mt-1">${mcCount} / 12</div>
              </div>
              <div class="p-3 rounded-xl bg-white/10">
                <div class="text-slate-400">Đúng/Sai trọn vẹn</div>
                <div class="text-lg font-bold text-amber-400 mt-1">${tfCount} / 4</div>
              </div>
              <div class="p-3 rounded-xl bg-white/10">
                <div class="text-slate-400">Trả lời ngắn</div>
                <div class="text-lg font-bold text-emerald-400 mt-1">${shortCount} / 6</div>
              </div>
            </div>
          </div>
        </div>
      `;
      resPanel.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.QuizCenter = QuizCenter;

/**
 * AI Math Tutor Module - Toán 11 Chương VII
 * Hộp thoại hỏi đáp: Học sinh hỏi, AI dùng Gemini <= 3.7 để trả lời sư phạm
 */

const AiTutor = {
  isOpen: false,
  apiKey: localStorage.getItem('gemini_api_key') || '',
  selectedModel: 'gemini-2.5-flash', // Models <= 3.7: gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro
  isGenerating: false,
  chatHistory: [
    {
      role: 'model',
      text: 'Chào em! Thầy/Cô là **Trợ lý AI Giáo viên Toán 11**. Em đang cần giải đáp về định lý, bài tập hình học không gian Chương VII hay dự án **STEM Cầu vượt giao thông**? Hãy gửi câu hỏi cho thầy/cô nhé!'
    }
  ],

  // Knowledge base for instant offline answers
  offlineKnowledge: {
    'vuông góc': 'Muốn chứng minh đường thẳng $d$ vuông góc với mặt phẳng $(P)$, ta thường chứng minh $d$ vuông góc với **hai đường thẳng cắt nhau** cùng nằm trong $(P)$. Khi $d \\perp (P)$ thì $d$ vuông góc với **mọi đường thẳng** nằm trong $(P)$.',
    'khoảng cách': 'Khoảng cách giữa hai đường thẳng chéo nhau bằng **độ dài đoạn vuông góc chung** của chúng. Trong hệ tọa độ $Oxyz$, khoảng cách được tính bằng công thức: $$d(d_1, d_2) = \\frac{|[\\vec{u_1}, \\vec{u_2}] \\cdot \\vec{AB}|}{|[\\vec{u_1}, \\vec{u_2}]|}$$',
    'nhị diện': 'Góc nhị diện gồm hai nửa mặt phẳng chung bờ. Số đo góc nhị diện bằng **góc phẳng của góc nhị diện**, tạo bởi hai tia lần lượt thuộc hai nửa mặt phẳng và cùng vuông góc với cạnh chung tại một điểm.',
    'stem': 'Trong STEM Cầu vượt giao thông, quy trình 7 bước gồm: **ASK → MODEL → DESIGN → SIMULATE → BUILD → TEST → IMPROVE**. Trọng tâm là mô hình hóa hai làn đường thành hai đường thẳng chéo nhau, trụ đỡ vuông góc đáy, và đoạn vuông góc chung bảo đảm tĩnh không an toàn $H \\ge 4.75\\text{ m}$.',
    'tối ưu': 'Bài toán tối ưu: Với bề rộng đường $W$, chiều dài dầm nhịp chính vượt qua đường là $L = \\frac{W}{\\sin\\theta}$. Chiều dài dầm ngắn nhất và tiết kiệm vật liệu nhất khi $\\sin\\theta = 1 \\implies \\theta = 90^\\circ$ (Cầu trực giao).',
    'ba đường': 'Định lí ba đường vuông góc: Cho đường thẳng $a$ nằm trong $(P)$ và đường thẳng $b$ không vuông góc với $(P)$, $b\'$ là hình chiếu của $b$ trên $(P)$. Khi đó $a \\perp b \\iff a \\perp b\'$.'
  },

  init() {
    this.renderWidget();
  },

  renderWidget() {
    let container = document.getElementById('ai-tutor-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ai-tutor-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- Floating Trigger Button -->
      <div class="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
        <button 
          onclick="AiTutor.toggleDialog()"
          id="btn-ai-trigger"
          class="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all duration-200 border border-white/20">
          <div class="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
            🤖
          </div>
          <div class="text-left hidden sm:block">
            <div class="text-xs font-black tracking-wide flex items-center gap-1">
              HỎI ĐÁP AI GIÁO VIÊN
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div class="text-[10px] text-indigo-100">Gemini ≤ 3.7 • Toán 11</div>
          </div>
        </button>
      </div>

      <!-- Main Chatbox Dialog Modal -->
      <div 
        id="ai-chat-dialog" 
        class="${this.isOpen ? 'flex' : 'hidden'} fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-8 sm:w-[480px] sm:h-[650px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200/80 z-50 flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-lg">
              🎓
            </div>
            <div>
              <h3 class="text-sm font-extrabold flex items-center gap-1.5">
                AI Giáo viên Toán 11
                <span class="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">Trực tuyến</span>
              </h3>
              <!-- Model Selector Dropdown -->
              <div class="flex items-center gap-1 mt-0.5">
                <span class="text-[10px] text-indigo-200">Mô hình:</span>
                <select 
                  id="ai-model-select"
                  onchange="AiTutor.changeModel(this.value)"
                  class="bg-indigo-950/80 text-amber-300 text-[11px] font-mono font-bold rounded px-1.5 py-0.5 border border-indigo-700/60 focus:outline-none cursor-pointer">
                  <option value="gemini-2.5-flash" ${this.selectedModel === 'gemini-2.5-flash' ? 'selected' : ''}>Gemini 2.5 Flash (Khuyên dùng)</option>
                  <option value="gemini-2.0-flash" ${this.selectedModel === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-flash" ${this.selectedModel === 'gemini-1.5-flash' ? 'selected' : ''}>Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro" ${this.selectedModel === 'gemini-1.5-pro' ? 'selected' : ''}>Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Top Action Buttons -->
          <div class="flex items-center gap-1.5">
            <button 
              onclick="AiTutor.toggleKeyModal()" 
              title="Cài đặt API Key"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 flex items-center justify-center transition text-xs">
              <i class="lucide-key w-4 h-4 ${this.apiKey ? 'text-emerald-400' : 'text-amber-300 animate-bounce'}"></i>
            </button>
            <button 
              onclick="AiTutor.clearChat()" 
              title="Xóa đoạn chat"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 flex items-center justify-center transition text-xs">
              <i class="lucide-trash-2 w-4 h-4"></i>
            </button>
            <button 
              onclick="AiTutor.toggleDialog()" 
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
              <i class="lucide-x w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- API Key Notice Banner (If not configured) -->
        <div id="ai-key-banner" class="${this.apiKey ? 'hidden' : 'block'} p-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 px-4">
          <div class="flex items-center gap-1.5 truncate">
            <i class="lucide-info w-4 h-4 text-amber-600 shrink-0"></i>
            <span class="truncate">Chưa nhập API Key. <button onclick="AiTutor.toggleKeyModal()" class="font-bold underline text-indigo-700">Nhập Key</button> để gọi Gemini trực tiếp.</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 bg-amber-200 rounded font-semibold shrink-0">Chế độ trợ lý cục bộ</span>
        </div>

        <!-- API Key Input Modal Popover -->
        <div id="ai-key-modal" class="hidden p-4 bg-slate-900 text-white border-b border-slate-700 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <i class="lucide-key w-3.5 h-3.5"></i> Cấu hình Google Gemini API Key
            </h4>
            <button onclick="AiTutor.toggleKeyModal()" class="text-slate-400 hover:text-white text-xs">Đóng</button>
          </div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            Lấy key miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-sky-400 underline font-bold">Google AI Studio</a>. Key được lưu riêng trong trình duyệt của bạn (Local Storage) để gọi trực tiếp mô hình Gemini $\le 3.7$.
          </p>
          <div class="flex items-center gap-2">
            <input 
              type="password" 
              id="input-gemini-key"
              placeholder="Dán mã API Key (AIzaSy...)..." 
              value="${this.apiKey}"
              class="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono" />
            <button 
              onclick="AiTutor.saveApiKey()"
              class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition">
              Lưu Key
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs md:text-sm">
          ${this.renderMessagesHtml()}
        </div>

        <!-- Quick Question Chips -->
        <div class="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-slate-600">
          <span class="text-[11px] text-slate-400 font-bold shrink-0">Gợi ý:</span>
          <button onclick="AiTutor.askQuick('Làm sao chứng minh đường thẳng vuông góc với mặt phẳng?')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] transition">
            Đường vuông góc mp?
          </button>
          <button onclick="AiTutor.askQuick('Công thức khoảng cách giữa hai đường thẳng chéo nhau?')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] transition">
            Đoạn vuông góc chung?
          </button>
          <button onclick="AiTutor.askQuick('Góc nhị diện là gì và cách xác định góc phẳng?')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] transition">
            Góc nhị diện?
          </button>
          <button onclick="AiTutor.askQuick('Tại sao cầu vượt trực giao 90 độ lại tiết kiệm vật liệu hơn cầu xiên góc?')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] transition">
            STEM tối ưu dầm cầu?
          </button>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input 
            type="text" 
            id="ai-user-input"
            onkeypress="if(event.key==='Enter') AiTutor.sendMessage()"
            placeholder="Hỏi thầy/cô bài toán hoặc kiến thức hình không gian..." 
            class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50" />
          <button 
            onclick="AiTutor.sendMessage()" 
            id="btn-ai-send"
            class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 transition disabled:opacity-50">
            <i class="lucide-send w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;

    if (window.lucide) lucide.createIcons();
    this.renderMath();
  },

  toggleDialog() {
    this.isOpen = !this.isOpen;
    const dialog = document.getElementById('ai-chat-dialog');
    if (dialog) {
      if (this.isOpen) {
        dialog.classList.remove('hidden');
        dialog.classList.add('flex');
        setTimeout(() => {
          document.getElementById('ai-user-input')?.focus();
          this.scrollToBottom();
        }, 50);
      } else {
        dialog.classList.add('hidden');
        dialog.classList.remove('flex');
      }
    }
  },

  toggleKeyModal() {
    const modal = document.getElementById('ai-key-modal');
    if (modal) modal.classList.toggle('hidden');
  },

  saveApiKey() {
    const input = document.getElementById('input-gemini-key');
    if (!input) return;
    const key = input.value.trim();
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    this.toggleKeyModal();
    this.renderWidget();
    this.addModelMessage('✅ Đã lưu API Key thành công! Bây giờ em có thể hỏi bất kỳ câu hỏi nào, AI sẽ gọi trực tiếp mô hình **' + this.selectedModel + '**.');
  },

  changeModel(model) {
    this.selectedModel = model;
    this.addModelMessage('Đã chuyển sang mô hình **' + model + '**. Thầy/Cô sẵn sàng trả lời câu hỏi của em.');
  },

  clearChat() {
    this.chatHistory = [
      {
        role: 'model',
        text: 'Đã làm mới cuộc hội thoại! Em hãy đặt câu hỏi để cùng thầy/cô khám phá bài học Toán 11 nhé.'
      }
    ];
    const container = document.getElementById('ai-chat-messages');
    if (container) container.innerHTML = this.renderMessagesHtml();
    this.renderMath();
  },

  renderMessagesHtml() {
    return this.chatHistory.map(msg => {
      const isUser = msg.role === 'user';
      return `
        <div class="flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}">
          <div class="w-7 h-7 rounded-xl ${isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-800'} text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
            ${isUser ? 'Em' : '🤖'}
          </div>
          <div class="max-w-[82%] p-3.5 rounded-2xl ${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm'} text-xs leading-relaxed space-y-1">
            ${this.formatMarkdown(msg.text)}
          </div>
        </div>
      `;
    }).join('');
  },

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono text-[11px]">$1</code>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  },

  askQuick(question) {
    const input = document.getElementById('ai-user-input');
    if (input) {
      input.value = question;
      this.sendMessage();
    }
  },

  async sendMessage() {
    const input = document.getElementById('ai-user-input');
    if (!input || !input.value.trim() || this.isGenerating) return;

    const userText = input.value.trim();
    input.value = '';

    // Push user message
    this.chatHistory.push({ role: 'user', text: userText });
    const container = document.getElementById('ai-chat-messages');
    if (container) {
      container.innerHTML = this.renderMessagesHtml();
      this.renderMath();
      this.scrollToBottom();
    }

    // Show AI typing indicator
    this.isGenerating = true;
    const sendBtn = document.getElementById('btn-ai-send');
    if (sendBtn) sendBtn.disabled = true;

    const typingId = 'ai-typing-' + Date.now();
    if (container) {
      container.insertAdjacentHTML('beforeend', `
        <div id="${typingId}" class="flex items-start gap-2.5">
          <div class="w-7 h-7 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-center shrink-0 shadow-sm">🤖</div>
          <div class="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs rounded-tl-none flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
            <span class="text-[11px] text-slate-400 ml-1">Đang suy nghĩ câu trả lời...</span>
          </div>
        </div>
      `);
      this.scrollToBottom();
    }

    try {
      let aiResponseText = '';

      if (this.apiKey) {
        aiResponseText = await this.callGeminiApi(userText);
      } else {
        // Fallback knowledge response
        await new Promise(r => setTimeout(r, 600)); // slight natural delay
        aiResponseText = this.generateFallbackAnswer(userText);
      }

      document.getElementById(typingId)?.remove();
      this.addModelMessage(aiResponseText);
    } catch (error) {
      console.error('AI Tutor error:', error);
      document.getElementById(typingId)?.remove();
      this.addModelMessage('⚠️ **Lỗi kết nối Gemini:** ' + error.message + '\n\n*Thầy/Cô đã chuyển sang chế độ giải đáp kiến thức theo SGK:*\n' + this.generateFallbackAnswer(userText));
    } finally {
      this.isGenerating = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  },

  async callGeminiApi(userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`;
    
    const systemPrompt = `Bạn là một AI Giáo viên Toán THPT tâm huyết, chuyên gia về môn Toán 11 - Chương VII: Quan hệ vuông góc trong không gian (SGK Toán 11 Tập 2) và dự án STEM thiết kế cầu vượt giao thông an toàn.
Quy tắc trả lời học sinh:
1. Xưng hô thân thiện: "Thầy/Cô" và "Em".
2. Giải thích sư phạm, từng bước logic, dễ hiểu, bám sát sách giáo khoa.
3. Khi viết công thức toán học, BẮT BUỘC dùng ký hiệu LaTeX nằm trong cặp dấu $...$ (nội dòng) hoặc $$...$$ (khối riêng) để KaTeX hiển thị đẹp. Ví dụ: $d \\perp (P)$, $V = \\frac{1}{3} S h$, $\\theta = 90^\\circ$.
4. Với câu hỏi về STEM cầu vượt: giải thích dựa trên quy trình 7 bước (ASK, MODEL, DESIGN, SIMULATE, BUILD, TEST, IMPROVE), hai đường chéo nhau, đoạn vuông góc chung và tĩnh không an toàn 4.75m.
5. Luôn khích lệ học sinh tư duy tích cực.`;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: systemPrompt + '\n\nCâu hỏi của học sinh: ' + userPrompt }
        ]
      }
    ];

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Lỗi HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('Mô hình không trả về nội dung.');
    }

    return candidate.content.parts[0].text;
  },

  generateFallbackAnswer(userText) {
    const textLower = userText.toLowerCase();

    for (const [key, answer] of Object.entries(this.offlineKnowledge)) {
      if (textLower.includes(key)) {
        return answer + '\n\n*(Gợi ý: Hãy nhập Gemini API Key ở biểu tượng chìa khóa để thầy/cô giải đáp chi tiết hơn nữa nhé!)*';
      }
    }

    return 'Thầy/Cô đã nhận được câu hỏi: "' + userText + '".\n\nĐể giải bài toán này trong **Toán 11 - Chương VII**, em hãy chú ý:\n1. Nhận diện các yếu tố hình học: Điểm, đường thẳng, mặt phẳng liên quan.\n2. Vận dụng các định nghĩa và định lý cơ bản: Hai đường thẳng vuông góc, đường thẳng vuông góc với mặt phẳng, hoặc định lí ba đường vuông góc.\n3. Nếu cần tính khoảng cách hoặc góc, hãy xác định chính xác hình chiếu vuông góc lên mặt phẳng.\n\n*Để trò chuyện chuyên sâu với đầy đủ năng lực của mô hình Gemini ' + this.selectedModel + ', em hãy bấm biểu tượng chìa khóa trên thanh tiêu đề và dán API Key của mình vào nhé!*';
  },

  addModelMessage(text) {
    this.chatHistory.push({ role: 'model', text });
    const container = document.getElementById('ai-chat-messages');
    if (container) {
      container.innerHTML = this.renderMessagesHtml();
      this.renderMath();
      this.scrollToBottom();
    }
  },

  renderMath() {
    const container = document.getElementById('ai-chat-messages');
    if (container && window.renderMathInElement) {
      renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  },

  scrollToBottom() {
    const container = document.getElementById('ai-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }
};

window.AiTutor = AiTutor;

document.addEventListener('DOMContentLoaded', () => {
  AiTutor.init();
});

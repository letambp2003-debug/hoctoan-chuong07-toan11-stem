/**
 * Main Application Orchestrator - Toán 11 Chương VII
 * Quản lý khởi tạo ứng dụng, tải dữ liệu động và điều hướng Tab
 */

const App = {
  currentTab: 'stem', // Default to STEM as the flagship center of the app

  async init() {
    console.log('Khởi động ứng dụng Toán 11 – Chương VII...');
    
    // Show Loading Screen
    this.showLoading(true);

    // Fetch JSON Data from /data/
    const result = await DataLoader.loadAll();

    this.showLoading(false);

    if (!result.success) {
      this.showError(result.error);
      return;
    }

    console.log('Nạp dữ liệu thành công từ 5 file JSON:', DataLoader.getData());

    // Initialize all modules
    KnowledgeHub.render('tab-knowledge');
    ModelingLab.render('tab-modeling');
    StemChallenge.render('tab-stem');
    QuizCenter.render('tab-quiz');
    References.render('tab-references');

    // Route from Hash if available
    const hash = window.location.hash.replace('#', '');
    if (['knowledge', 'modeling', 'stem', 'quiz', 'references'].includes(hash)) {
      this.switchTab(hash);
    } else {
      this.switchTab('stem'); // STEM Challenge is the flagship centerpiece
    }

    // Global Hash Listener
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (['knowledge', 'modeling', 'stem', 'quiz', 'references'].includes(newHash) && newHash !== this.currentTab) {
        this.switchTab(newHash, false);
      }
    });

    if (window.lucide) lucide.createIcons();
  },

  switchTab(tabId, updateHash = true) {
    this.currentTab = tabId;

    if (updateHash) {
      window.location.hash = tabId;
    }

    // Toggle Tab Content Containers
    ['knowledge', 'modeling', 'stem', 'quiz', 'references'].forEach(id => {
      const tabEl = document.getElementById(`tab-${id}`);
      const navBtn = document.getElementById(`nav-btn-${id}`);
      const mobileNavBtn = document.getElementById(`mobile-nav-btn-${id}`);

      if (tabEl) {
        if (id === tabId) {
          tabEl.classList.add('active');
          tabEl.style.display = 'block';
        } else {
          tabEl.classList.remove('active');
          tabEl.style.display = 'none';
        }
      }

      // Update Desktop Nav Button
      if (navBtn) {
        if (id === tabId) {
          navBtn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 bg-indigo-600 text-white shadow-sm';
        } else {
          navBtn.className = 'px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100';
        }
      }

      // Update Mobile Nav Button
      if (mobileNavBtn) {
        if (id === tabId) {
          mobileNavBtn.className = 'flex flex-col items-center gap-1 text-xs font-bold text-indigo-600';
        } else {
          mobileNavBtn.className = 'flex flex-col items-center gap-1 text-xs font-medium text-slate-500';
        }
      }
    });

    // Special behavior when switching to STEM
    if (tabId === 'stem') {
      setTimeout(() => {
        if (StemChallenge.currentStage === 'SIMULATE') {
          Visualizer3D.init('three-canvas-container');
        }
      }, 100);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) lucide.createIcons();
  },

  openModelingTask(taskId) {
    this.switchTab('modeling');
    setTimeout(() => {
      ModelingLab.selectTask(taskId);
      const ws = document.getElementById('modeling-workspace');
      if (ws) ws.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  },

  showLoading(isLoading) {
    const loadingScreen = document.getElementById('app-loading');
    if (loadingScreen) {
      loadingScreen.style.display = isLoading ? 'flex' : 'none';
    }
  },

  showError(errMsg) {
    const mainContainer = document.getElementById('main-content');
    if (mainContainer) {
      mainContainer.innerHTML = `
        <div class="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl border border-rose-100 text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
            <i class="lucide-alert-triangle w-8 h-8"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900">Không thể tải dữ liệu nguồn</h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            Ứng dụng cần nạp các file dữ liệu trong thư mục <code>/data/</code> (knowledge.json, modeling.json, stem.json, quiz.json, references.json).
          </p>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 text-left">
            Lỗi: ${errMsg}
          </div>
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-1">
            <strong>Gợi ý khắc phục:</strong>
            <p>1. Nếu đang mở file trực tiếp bằng giao thức <code>file:///</code>, trình duyệt (Chrome/Edge) chặn nạp file cục bộ do chính sách bảo mật CORS. Hãy chạy một HTTP server cục bộ như <code>python -m http.server 8080</code> hoặc tải lên GitHub Pages.</p>
            <p>2. Khi chạy trên GitHub Pages (<code>https://...</code>), ứng dụng sẽ tự động tải 100% không gặp lỗi này.</p>
          </div>
          <button onclick="location.reload()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition">
            Tải lại trang
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }
  }
};

window.App = App;

// Bootstrap on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

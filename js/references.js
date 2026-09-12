/**
 * References Module - Toán 11 Chương VII
 * Đọc từ references.json: Bản đồ đối chiếu SGK / PDF và quy tắc sử dụng
 */

const References = {
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = DataLoader.getData();
    if (!data.references || !data.references.sources) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <p>Chưa có dữ liệu tham chiếu. Vui lòng kiểm tra file data/references.json.</p>
        </div>
      `;
      return;
    }

    const { meta, sources, usage_guidelines } = data.references;
    const primarySource = sources[0];

    container.innerHTML = `
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i class="lucide-bookmark text-9xl"></i>
        </div>
        <div class="max-w-3xl relative z-10">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Nguồn dữ liệu & Bản đồ đối chiếu
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium rounded-full">
              Chuẩn SGK Bộ GD&ĐT
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            ${meta.title}
          </h1>
          <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
            Tài liệu nguồn gốc: <strong>${meta.primary_source}</strong> (${meta.source_file}).
          </p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span class="flex items-center gap-1">
              <i class="lucide-file-text w-4 h-4 text-indigo-400"></i> ${primarySource.coverage}
            </span>
            <span class="flex items-center gap-1">
              <i class="lucide-database w-4 h-4 text-emerald-400"></i> 100% Client-Side JSON Loading
            </span>
          </div>
        </div>
      </div>

      <!-- Mapping Table Section -->
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 mb-8 space-y-6">
        <div>
          <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Tra cứu nhanh</div>
          <h2 class="text-xl font-extrabold text-slate-900">
            Bản đồ đối chiếu giữa Trang Sách Giáo Khoa và Trang File PDF
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs md:text-sm text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                <th class="p-3.5 rounded-l-xl">Bài học</th>
                <th class="p-3.5">Trang sách SGK</th>
                <th class="p-3.5">Trang file PDF</th>
                <th class="p-3.5">Phạm vi nội dung</th>
                <th class="p-3.5 rounded-r-xl text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${primarySource.sections.map((sec, idx) => `
                <tr class="hover:bg-indigo-50/40 transition">
                  <td class="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                      ${idx < 6 ? idx + 22 : 'ÔT'}
                    </span>
                    ${sec.lesson}
                  </td>
                  <td class="p-3.5 font-semibold text-slate-700">
                    Trang ${sec.book_pages}
                  </td>
                  <td class="p-3.5 font-mono text-indigo-600 font-semibold">
                    Trang ${sec.pdf_pages}
                  </td>
                  <td class="p-3.5 text-slate-600 text-xs">
                    ${References.getTopicSummary(sec.lesson)}
                  </td>
                  <td class="p-3.5 text-right">
                    <button 
                      onclick="References.jumpToLesson('${sec.lesson}')" 
                      class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-semibold text-xs transition">
                      Xem bài học
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pedagogical & Usage Guidelines -->
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 space-y-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider text-xs text-slate-400">
          <i class="lucide-shield-check w-4 h-4 text-emerald-600"></i>
          Quy tắc sử dụng học liệu & Chuẩn mực sư phạm
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${usage_guidelines.map((guide, gIdx) => `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <span class="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                ${gIdx + 1}
              </span>
              <p class="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                ${guide}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  getTopicSummary(lessonName) {
    if (lessonName.includes('22')) return 'Hai đường thẳng vuông góc, góc giữa hai đường thẳng (0°–90°).';
    if (lessonName.includes('23')) return 'Đường thẳng vuông góc mặt phẳng, tiêu chuẩn nhận biết, mặt phẳng trung trực.';
    if (lessonName.includes('24')) return 'Phép chiếu vuông góc, định lí ba đường vuông góc, góc đường thẳng và mặt phẳng.';
    if (lessonName.includes('25')) return 'Hai mặt phẳng vuông góc, góc nhị diện, các khối đa diện đều.';
    if (lessonName.includes('26')) return 'Khoảng cách điểm - mp, đường vuông góc chung hai đường chéo nhau.';
    if (lessonName.includes('27')) return 'Thể tích khối lăng trụ, khối hộp, khối chóp, chóp cụt đều.';
    return 'Bài tập trắc nghiệm và tự luận tổng hợp toàn chương VII.';
  },

  jumpToLesson(lessonName) {
    App.switchTab('knowledge');
    if (lessonName.includes('22')) KnowledgeHub.selectLesson('bai22');
    else if (lessonName.includes('23')) KnowledgeHub.selectLesson('bai23');
    else if (lessonName.includes('24')) KnowledgeHub.selectLesson('bai24');
    else if (lessonName.includes('25')) KnowledgeHub.selectLesson('bai25');
    else if (lessonName.includes('26')) KnowledgeHub.selectLesson('bai26');
    else if (lessonName.includes('27')) KnowledgeHub.selectLesson('bai27');
    else KnowledgeHub.selectLesson('end_of_chapter');
  }
};

window.References = References;

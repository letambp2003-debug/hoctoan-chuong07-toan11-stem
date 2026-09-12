/**
 * Data Loader Module - Toán 11 Chương VII
 * Tự động tải dữ liệu từ các file JSON trong /data/
 */

const DataLoader = {
  data: {
    knowledge: null,
    modeling: null,
    stem: null,
    quiz: null,
    references: null
  },

  async fetchJson(fileName) {
    const pathsToTry = [
      `data/${fileName}`,
      `./data/${fileName}`,
      fileName,
      `./${fileName}`
    ];

    let lastError = null;
    for (const path of pathsToTry) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        lastError = err;
      }
    }
    throw new Error(`Không thể nạp file ${fileName}. Chi tiết: ${lastError ? lastError.message : 'HTTP status error'}`);
  },

  async loadAll() {
    try {
      const [knowledge, modeling, stem, quiz, references] = await Promise.all([
        this.fetchJson('knowledge.json'),
        this.fetchJson('modeling.json'),
        this.fetchJson('stem.json'),
        this.fetchJson('quiz.json'),
        this.fetchJson('references.json')
      ]);

      this.data.knowledge = knowledge;
      this.data.modeling = modeling;
      this.data.stem = stem;
      this.data.quiz = quiz;
      this.data.references = references;

      return {
        success: true,
        data: this.data
      };
    } catch (error) {
      console.error('Data Loader Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  getData() {
    return this.data;
  },

  getLesson(id) {
    if (!this.data.knowledge || !this.data.knowledge.lessons) return null;
    return this.data.knowledge.lessons.find(l => l.id === id);
  },

  getModelingTaskForLesson(lessonTitle) {
    if (!this.data.modeling || !this.data.modeling.tasks) return [];
    return this.data.modeling.tasks.filter(t => lessonTitle.includes(t.lesson));
  },

  getQuizForLesson(lessonTitle) {
    if (!this.data.quiz || !this.data.quiz.questions) return [];
    return this.data.quiz.questions.filter(q => lessonTitle.includes(q.topic));
  }
};

window.DataLoader = DataLoader;

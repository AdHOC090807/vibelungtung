/**
 * FlashLearn - Main Application Logic
 */

// Initial Sample Deck
const DEFAULT_DECKS = [
  {
    id: 'deck-ielts-core',
    name: '🌟 Từ vựng IELTS & Giao tiếp cốt lõi',
    createdAt: Date.now(),
    cards: [
      {
        id: 'c1',
        word: 'resilient',
        phonetic: '/rɪˈzɪliənt/',
        pos: 'adjective',
        meaning: 'Kiên cường, có khả năng phục hồi nhanh sau khó khăn hoặc nghịch cảnh',
        example: 'Local businesses have proven to be remarkably resilient during the crisis.',
        exampleMeaning: 'Các doanh nghiệp địa phương đã chứng tỏ sự kiên cường đáng kể trong suốt cuộc khủng hoảng.',
        mastered: false,
        starred: true
      },
      {
        id: 'c2',
        word: 'ambiguous',
        phonetic: '/æmˈbɪɡjuəs/',
        pos: 'adjective',
        meaning: 'Mơ hồ, có thể hiểu theo nhiều nghĩa khác nhau, không rõ ràng',
        example: 'The wording of the agreement is ambiguous and open to interpretation.',
        exampleMeaning: 'Cách diễn đạt của bản thỏa thuận còn mơ hồ và có thể được hiểu theo nhiều hướng.',
        mastered: false,
        starred: false
      },
      {
        id: 'c3',
        word: 'comprehend',
        phonetic: '/ˌkɑːmprɪˈhend/',
        pos: 'verb',
        meaning: 'Hiểu thấu đáo, lĩnh hội một vấn đề phức tạp',
        example: 'She found it hard to comprehend how much the technology had advanced.',
        exampleMeaning: 'Cô ấy cảm thấy khó có thể lĩnh hội được công nghệ đã tiến bộ đến mức nào.',
        mastered: false,
        starred: false
      },
      {
        id: 'c4',
        word: 'scrutinize',
        phonetic: '/ˈskruːtənaɪz/',
        pos: 'verb',
        meaning: 'Xem xét kỹ lưỡng, soi xét cẩn thận từng chi tiết',
        example: 'The committee will scrutinize every aspect of the proposal.',
        exampleMeaning: 'Ủy ban sẽ kiểm tra kỹ lưỡng từng khía cạnh của đề xuất.',
        mastered: false,
        starred: false
      },
      {
        id: 'c5',
        word: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        pos: 'adjective',
        meaning: 'Có mặt ở khắp mọi nơi, rất phổ biến',
        example: 'Smartphones have become ubiquitous in modern society.',
        exampleMeaning: 'Điện thoại thông minh đã trở nên phổ biến ở khắp mọi nơi trong xã hội hiện đại.',
        mastered: true,
        starred: true
      },
      {
        id: 'c6',
        word: 'meticulous',
        phonetic: '/məˈtɪkjələs/',
        pos: 'adjective',
        meaning: 'Tỉ mỉ, cẩn thận, chăm chút từng li từng tí',
        example: 'He is meticulous about keeping his records up to date.',
        exampleMeaning: 'Anh ấy rất tỉ mỉ trong việc cập nhật hồ sơ của mình thường xuyên.',
        mastered: false,
        starred: false
      },
      {
        id: 'c7',
        word: 'lucrative',
        phonetic: '/ˈluːkrətɪv/',
        pos: 'adjective',
        meaning: 'Sinh lợi cao, mang lại nhiều tiền bạc lợi nhuận',
        example: 'E-commerce has become a highly lucrative industry in recent years.',
        exampleMeaning: 'Thương mại điện tử đã trở thành một ngành công nghiệp vô cùng sinh lợi trong những năm gần đây.',
        mastered: false,
        starred: false
      },
      {
        id: 'c8',
        word: 'mitigate',
        phonetic: '/ˈmɪtɪɡeɪt/',
        pos: 'verb',
        meaning: 'Giảm nhẹ, làm dịu bớt (tác hại, rủi ro, nỗi đau)',
        example: 'New drainage systems were built to mitigate the risk of flooding.',
        exampleMeaning: 'Hệ thống thoát nước mới được xây dựng để giảm nhẹ nguy cơ ngập lụt.',
        mastered: false,
        starred: false
      }
    ]
  }
];

class FlashLearnApp {
  constructor() {
    this.storageKey = 'flashlearn_app_data_v1';
    this.decks = [];
    this.currentDeckId = null;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.activeFilter = 'all'; // 'all' | 'learning' | 'starred'
    this.parsedPdfCards = [];

    this.initElements();
    this.loadData();
    this.initEvents();
    this.initTheme();
    this.render();
  }

  initElements() {
    // Top Bar
    this.deckSelect = document.getElementById('deckSelect');
    this.btnManageDecks = document.getElementById('btnManageDecks');
    this.btnOpenImport = document.getElementById('btnOpenImport');
    this.btnToggleTheme = document.getElementById('btnToggleTheme');
    this.deckStats = document.getElementById('deckStats');
    this.masteredCount = document.getElementById('masteredCount');
    this.learningCount = document.getElementById('learningCount');
    this.progressBar = document.getElementById('progressBar');
    this.btnShuffle = document.getElementById('btnShuffle');
    this.btnResetProgress = document.getElementById('btnResetProgress');

    // Filter Tabs
    this.filterTabs = document.querySelectorAll('.filter-tab');

    // Card Elements
    this.flashcard = document.getElementById('flashcard');
    this.frontPos = document.getElementById('frontPos');
    this.btnStarCard = document.getElementById('btnStarCard');
    this.btnPlaySound = document.getElementById('btnPlaySound');
    this.frontWord = document.getElementById('frontWord');
    this.frontPhonetic = document.getElementById('frontPhonetic');
    this.frontHint = document.getElementById('frontHint');

    // Card Back
    this.backWord = document.getElementById('backWord');
    this.backPos = document.getElementById('backPos');
    this.btnBackPlaySound = document.getElementById('btnBackPlaySound');
    this.backMeaning = document.getElementById('backMeaning');
    this.backExample = document.getElementById('backExample');
    this.backExampleMeaning = document.getElementById('backExampleMeaning');
    this.exampleBox = document.getElementById('exampleBox');

    // Controls
    this.btnPrevCard = document.getElementById('btnPrevCard');
    this.btnNextCard = document.getElementById('btnNextCard');
    this.currentCardIndexEl = document.getElementById('currentCardIndex');
    this.totalCardCountEl = document.getElementById('totalCardCount');
    this.btnMarkLearning = document.getElementById('btnMarkLearning');
    this.btnFlipCenter = document.getElementById('btnFlipCenter');
    this.btnMarkMastered = document.getElementById('btnMarkMastered');

    // Import Modal
    this.importModal = document.getElementById('importModal');
    this.btnCloseImport = document.getElementById('btnCloseImport');
    this.btnCancelImport = document.getElementById('btnCancelImport');
    this.btnSubmitImport = document.getElementById('btnSubmitImport');
    this.importTabs = document.querySelectorAll('.import-tab');
    this.tabContentAiCode = document.getElementById('tabContentAiCode');
    this.tabContentPdfFile = document.getElementById('tabContentPdfFile');
    this.tabContentAiPrompt = document.getElementById('tabContentAiPrompt');
    this.importTargetDeck = document.getElementById('importTargetDeck');
    this.aiCodeInput = document.getElementById('aiCodeInput');
    this.btnInsertSampleCode = document.getElementById('btnInsertSampleCode');
    this.dropZone = document.getElementById('dropZone');
    this.pdfFileInput = document.getElementById('pdfFileInput');
    this.pdfParsingStatus = document.getElementById('pdfParsingStatus');
    this.pdfStatusText = document.getElementById('pdfStatusText');
    this.pdfPreviewSection = document.getElementById('pdfPreviewSection');
    this.pdfExtractedCount = document.getElementById('pdfExtractedCount');
    this.pdfItemsList = document.getElementById('pdfItemsList');
    this.btnCopyPrompt = document.getElementById('btnCopyPrompt');
    this.copyPromptLabel = document.getElementById('copyPromptLabel');
    this.samplePromptText = document.getElementById('samplePromptText');

    // Decks Modal
    this.deckModal = document.getElementById('deckModal');
    this.btnCloseDeckModal = document.getElementById('btnCloseDeckModal');
    this.newDeckNameInput = document.getElementById('newDeckNameInput');
    this.btnCreateDeck = document.getElementById('btnCreateDeck');
    this.deckListItems = document.getElementById('deckListItems');
    this.btnExportAllJson = document.getElementById('btnExportAllJson');
    this.btnResetToDefault = document.getElementById('btnResetToDefault');

    // Toast
    this.toast = document.getElementById('toast');
    this.toastMessage = document.getElementById('toastMessage');
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.decks = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu từ LocalStorage:', e);
    }

    if (!this.decks || this.decks.length === 0) {
      this.decks = JSON.parse(JSON.stringify(DEFAULT_DECKS));
      this.saveData();
    }

    this.currentDeckId = this.decks[0].id;
    this.populateDeckSelectors();
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.decks));
    } catch (e) {
      console.error('Lỗi lưu dữ liệu:', e);
    }
  }

  populateDeckSelectors() {
    this.deckSelect.innerHTML = '';
    this.importTargetDeck.innerHTML = '';

    this.decks.forEach(deck => {
      const opt = document.createElement('option');
      opt.value = deck.id;
      opt.textContent = `${deck.name} (${deck.cards.length} từ)`;
      if (deck.id === this.currentDeckId) opt.selected = true;
      this.deckSelect.appendChild(opt);

      const opt2 = document.createElement('option');
      opt2.value = deck.id;
      opt2.textContent = deck.name;
      if (deck.id === this.currentDeckId) opt2.selected = true;
      this.importTargetDeck.appendChild(opt2);
    });

    const optNew = document.createElement('option');
    optNew.value = '__new__';
    optNew.textContent = '➕ [Tạo bộ từ vựng mới...]';
    this.importTargetDeck.appendChild(optNew);
  }

  getCurrentDeck() {
    return this.decks.find(d => d.id === this.currentDeckId) || this.decks[0];
  }

  getFilteredCards() {
    const deck = this.getCurrentDeck();
    if (!deck) return [];

    if (this.activeFilter === 'learning') {
      return deck.cards.filter(c => !c.mastered);
    } else if (this.activeFilter === 'starred') {
      return deck.cards.filter(c => c.starred);
    }
    return deck.cards;
  }

  getCurrentCard() {
    const cards = this.getFilteredCards();
    if (this.currentCardIndex >= cards.length) {
      this.currentCardIndex = Math.max(0, cards.length - 1);
    }
    return cards[this.currentCardIndex];
  }

  render() {
    const deck = this.getCurrentDeck();
    if (!deck) return;

    const cards = this.getFilteredCards();
    const currentCard = this.getCurrentCard();

    // Stats
    const totalDeckCards = deck.cards.length;
    const mastered = deck.cards.filter(c => c.mastered).length;
    const learning = totalDeckCards - mastered;

    this.deckStats.textContent = `${totalDeckCards} thẻ`;
    this.masteredCount.textContent = mastered;
    this.learningCount.textContent = learning;

    const progressPct = totalDeckCards > 0 ? Math.round((mastered / totalDeckCards) * 100) : 0;
    this.progressBar.style.width = `${progressPct}%`;

    // Index indicators
    this.currentCardIndexEl.textContent = cards.length > 0 ? this.currentCardIndex + 1 : 0;
    this.totalCardCountEl.textContent = cards.length;

    // Disabled buttons
    this.btnPrevCard.disabled = this.currentCardIndex <= 0;
    this.btnNextCard.disabled = this.currentCardIndex >= cards.length - 1;

    // Render Card
    if (!currentCard) {
      this.renderEmptyState();
      return;
    }

    // Front
    this.frontWord.textContent = currentCard.word || 'Chưa có từ';
    this.frontPhonetic.textContent = currentCard.phonetic || '';
    this.frontPhonetic.style.display = currentCard.phonetic ? 'block' : 'none';
    this.frontPos.textContent = currentCard.pos || 'vocabulary';

    // Star icon
    const starIcon = this.btnStarCard.querySelector('i');
    if (starIcon) {
      if (currentCard.starred) {
        this.btnStarCard.classList.add('text-amber-500');
        this.btnStarCard.classList.remove('text-slate-400');
        starIcon.setAttribute('data-lucide', 'star');
        starIcon.classList.add('fill-amber-400');
      } else {
        this.btnStarCard.classList.remove('text-amber-500');
        this.btnStarCard.classList.add('text-slate-400');
        starIcon.classList.remove('fill-amber-400');
      }
    }

    // Back
    this.backWord.textContent = currentCard.word;
    this.backPos.textContent = currentCard.pos || 'vocabulary';
    this.backMeaning.textContent = currentCard.meaning || '(Chưa có giải nghĩa)';

    if (currentCard.example) {
      this.exampleBox.classList.remove('hidden');
      this.backExample.textContent = `"${currentCard.example}"`;
      this.backExampleMeaning.textContent = currentCard.exampleMeaning ? `(${currentCard.exampleMeaning})` : '';
    } else {
      this.exampleBox.classList.add('hidden');
    }

    // Flip state reset
    if (!this.isFlipped) {
      this.flashcard.classList.remove('is-flipped');
    } else {
      this.flashcard.classList.add('is-flipped');
    }

    lucide.createIcons();
  }

  renderEmptyState() {
    this.frontWord.textContent = 'Trống';
    this.frontPhonetic.textContent = 'Không có thẻ nào trong bộ lọc này';
    this.frontPos.textContent = 'empty';
    this.backMeaning.textContent = 'Hãy thêm từ vựng mới hoặc chuyển bộ lọc khác!';
    this.exampleBox.classList.add('hidden');
    this.flashcard.classList.remove('is-flipped');
    this.isFlipped = false;
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    if (this.isFlipped) {
      this.flashcard.classList.add('is-flipped');
    } else {
      this.flashcard.classList.remove('is-flipped');
    }
  }

  nextCard() {
    const cards = this.getFilteredCards();
    if (this.currentCardIndex < cards.length - 1) {
      this.currentCardIndex++;
      this.isFlipped = false;
      this.render();
    } else if (cards.length > 0 && this.currentCardIndex === cards.length - 1) {
      // Completed all cards in filter
      this.triggerConfetti();
      this.showToast('🎉 Tuyệt vời! Bạn đã xem hết tất cả các thẻ trong phần này.');
    }
  }

  prevCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.isFlipped = false;
      this.render();
    }
  }

  markStatus(isMastered) {
    const card = this.getCurrentCard();
    if (!card) return;

    card.mastered = isMastered;
    this.saveData();

    if (isMastered) {
      this.showToast(`✅ Đã đánh dấu nhớ: "${card.word}"`);
    } else {
      this.showToast(`📌 Đã đưa "${card.word}" vào danh sách cần ôn`);
    }

    this.nextCard();
  }

  toggleStar() {
    const card = this.getCurrentCard();
    if (!card) return;

    card.starred = !card.starred;
    this.saveData();
    this.render();
    this.showToast(card.starred ? '⭐ Đã thêm vào mục Yêu thích' : 'Đã bỏ yêu thích');
  }

  speakCurrentWord() {
    const card = this.getCurrentCard();
    if (!card || !card.word) return;

    if (!('speechSynthesis' in window)) {
      this.showToast('Trình duyệt của bạn không hỗ trợ phát âm TTS');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(card.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clear pronunciation

    // Find English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  shuffleCards() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length <= 1) return;

    for (let i = deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
    }

    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.saveData();
    this.render();
    this.showToast('🔀 Đã xáo trộn ngẫu nhiên thứ tự các thẻ!');
  }

  resetDeckProgress() {
    const deck = this.getCurrentDeck();
    if (!deck) return;

    if (confirm(`Bạn có chắc muốn đặt lại trạng thái học của bộ thẻ "${deck.name}" về ban đầu?`)) {
      deck.cards.forEach(c => c.mastered = false);
      this.currentCardIndex = 0;
      this.isFlipped = false;
      this.saveData();
      this.render();
      this.showToast('🔄 Đã đặt lại toàn bộ tiến trình học!');
    }
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  showToast(message, isError = false) {
    this.toastMessage.textContent = message;
    const toastIcon = document.getElementById('toastIcon');
    if (toastIcon) {
      toastIcon.setAttribute('data-lucide', isError ? 'alert-triangle' : 'check-circle');
      toastIcon.className = `w-5 h-5 ${isError ? 'text-rose-400' : 'text-emerald-400'}`;
      lucide.createIcons();
    }

    this.toast.classList.remove('translate-y-16', 'opacity-0', 'pointer-events-none');
    this.toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      this.toast.classList.add('translate-y-16', 'opacity-0', 'pointer-events-none');
      this.toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2500);
  }

  // ==================== IMPORT LOGIC ====================

  openImportModal() {
    this.populateDeckSelectors();
    this.importModal.classList.add('active');
    lucide.createIcons();
  }

  closeImportModal() {
    this.importModal.classList.remove('active');
  }

  switchImportTab(tabKey) {
    this.importTabs.forEach(t => {
      if (t.dataset.tab === tabKey) {
        t.className = 'import-tab active py-3 px-4 border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex items-center gap-2';
      } else {
        t.className = 'import-tab py-3 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm flex items-center gap-2';
      }
    });

    this.tabContentAiCode.classList.toggle('hidden', tabKey !== 'ai-code');
    this.tabContentPdfFile.classList.toggle('hidden', tabKey !== 'pdf-file');
    this.tabContentAiPrompt.classList.toggle('hidden', tabKey !== 'ai-prompt');
    lucide.createIcons();
  }

  insertSampleCode() {
    const sample = `[
  {
    "word": "eloquent",
    "phonetic": "/ˈeləkwənt/",
    "pos": "adjective",
    "meaning": "Có tài hùng biện, ăn nói lưu loát và thuyết phục",
    "example": "He gave an eloquent speech that moved the audience.",
    "exampleMeaning": "Anh ấy đã có một bài phát biểu hùng hồn làm rung động người nghe."
  },
  {
    "word": "perseverance",
    "phonetic": "/ˌpɜːrsəˈvɪrəns/",
    "pos": "noun",
    "meaning": "Sự kiên trì, bền bỉ vượt qua khó khăn để đạt mục tiêu",
    "example": "Success usually requires years of hard work and perseverance.",
    "exampleMeaning": "Thành công thường đòi hỏi nhiều năm nỗ lực và sự kiên trì."
  },
  {
    "word": "spontaneous",
    "phonetic": "/spɑːnˈteɪniəs/",
    "pos": "adjective",
    "meaning": "Tự phát, ngẫu hứng, không lên kế hoạch trước",
    "example": "We made a spontaneous decision to go on a road trip.",
    "exampleMeaning": "Chúng tôi đã đưa ra quyết định ngẫu hứng đi du lịch bằng ô tô."
  }
]`;
    this.aiCodeInput.value = sample;
    this.showToast('Đã dán mẫu code JSON thử nghiệm!');
  }

  copyPromptText() {
    const text = this.samplePromptText.textContent;
    navigator.clipboard.writeText(text).then(() => {
      this.copyPromptLabel.textContent = 'Đã sao chép! ✔';
      setTimeout(() => {
        this.copyPromptLabel.textContent = 'Sao chép prompt';
      }, 2000);
      this.showToast('📋 Đã sao chép prompt! Giờ bạn có thể dán vào ChatGPT / Gemini.');
    });
  }

  // Parse Text / JSON from AI Code input
  parseInputCode(raw) {
    const text = raw.trim();
    if (!text) return [];

    // Check if JSON
    if (text.startsWith('[') || text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        return list.map((item, idx) => ({
          id: 'card-' + Date.now() + '-' + idx,
          word: item.word || item.vocab || item.term || '',
          phonetic: item.phonetic || item.ipa || item.pronunciation || '',
          pos: item.pos || item.type || '',
          meaning: item.meaning || item.definition || item.vietnamese || '',
          example: item.example || item.sentence || '',
          exampleMeaning: item.exampleMeaning || item.example_meaning || item.sentenceMeaning || '',
          mastered: false,
          starred: false
        })).filter(c => c.word && c.meaning);
      } catch (err) {
        // Fallback to text parsing if JSON parse failed
        console.warn('JSON parse error, attempting line-based parse:', err);
      }
    }

    // Line-based parser (supporting pipes, hyphens, or colons)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const cards = [];

    lines.forEach((line, idx) => {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          cards.push({
            id: 'card-' + Date.now() + '-' + idx,
            word: parts[0],
            phonetic: parts.length > 2 && parts[1].startsWith('/') ? parts[1] : '',
            pos: '',
            meaning: parts.length > 2 && !parts[1].startsWith('/') ? parts[1] : (parts.length > 2 ? parts[2] : parts[1]),
            example: parts.length >= 4 ? parts[3] : '',
            exampleMeaning: parts.length >= 5 ? parts[4] : '',
            mastered: false,
            starred: false
          });
        }
      } else if (line.includes(' - ') || line.includes(': ')) {
        const sep = line.includes(' - ') ? ' - ' : ': ';
        const parts = line.split(sep);
        if (parts.length >= 2) {
          cards.push({
            id: 'card-' + Date.now() + '-' + idx,
            word: parts[0].replace(/^\d+[\.\/\)]\s*/, '').trim(),
            phonetic: '',
            pos: '',
            meaning: parts[1].trim(),
            example: '',
            exampleMeaning: '',
            mastered: false,
            starred: false
          });
        }
      }
    });

    return cards;
  }

  async handlePdfUpload(file) {
    if (!file || file.type !== 'application/pdf') {
      this.showToast('Vui lòng chọn một file định dạng .pdf hợp lệ', true);
      return;
    }

    this.pdfParsingStatus.classList.remove('hidden');
    this.pdfPreviewSection.classList.add('hidden');
    this.pdfStatusText.textContent = `Đang phân tích file "${file.name}"...`;

    try {
      const fullText = await PDFParser.extractTextFromPDF(file, (curr, total) => {
        this.pdfStatusText.textContent = `Đang đọc trang ${curr}/${total}...`;
      });

      const extracted = PDFParser.parseVocabularyText(fullText);
      this.parsedPdfCards = extracted.map((c, i) => ({
        ...c,
        id: 'pdf-card-' + Date.now() + '-' + i,
        mastered: false,
        starred: false
      }));

      this.pdfParsingStatus.classList.add('hidden');

      if (this.parsedPdfCards.length === 0) {
        this.showToast('Không tự động nhận diện được danh sách từ vựng trong PDF. Bạn hãy copy text và dán qua tab "Dán mã AI" nhé!', true);
        return;
      }

      // Display preview
      this.pdfExtractedCount.textContent = this.parsedPdfCards.length;
      this.pdfItemsList.innerHTML = this.parsedPdfCards.slice(0, 15).map(c => `
        <div class="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">${c.word}</span>
          <span class="text-slate-600 dark:text-slate-300 truncate max-w-xs">${c.meaning}</span>
        </div>
      `).join('');

      if (this.parsedPdfCards.length > 15) {
        this.pdfItemsList.innerHTML += `<div class="text-center text-slate-400 py-1">... và ${this.parsedPdfCards.length - 15} từ vựng khác</div>`;
      }

      this.pdfPreviewSection.classList.remove('hidden');
      this.showToast(`Đã tìm thấy ${this.parsedPdfCards.length} từ vựng từ PDF!`);
    } catch (err) {
      console.error('Lỗi khi đọc file PDF:', err);
      this.pdfParsingStatus.classList.add('hidden');
      this.showToast('Lỗi khi đọc file PDF: ' + err.message, true);
    }
  }

  submitImport() {
    let targetDeckId = this.importTargetDeck.value;
    let targetDeck = this.decks.find(d => d.id === targetDeckId);

    // If target deck is "__new__", prompt for a name
    if (targetDeckId === '__new__' || !targetDeck) {
      const name = prompt('Nhập tên cho bộ từ vựng mới:', 'Bộ từ vựng mới');
      if (!name) return;
      targetDeck = {
        id: 'deck-' + Date.now(),
        name: name.trim(),
        createdAt: Date.now(),
        cards: []
      };
      this.decks.push(targetDeck);
      targetDeckId = targetDeck.id;
    }

    let newCards = [];

    // Check which tab is active or which input has data
    const isPdfActive = !this.tabContentPdfFile.classList.contains('hidden');
    if (isPdfActive && this.parsedPdfCards.length > 0) {
      newCards = this.parsedPdfCards;
    } else {
      const rawText = this.aiCodeInput.value;
      newCards = this.parseInputCode(rawText);
    }

    if (!newCards || newCards.length === 0) {
      this.showToast('Không có từ vựng nào để thêm. Hãy dán mã code hoặc tải file PDF!', true);
      return;
    }

    targetDeck.cards.push(...newCards);
    this.currentDeckId = targetDeck.id;
    this.currentCardIndex = Math.max(0, targetDeck.cards.length - newCards.length);
    this.isFlipped = false;

    this.saveData();
    this.populateDeckSelectors();
    this.closeImportModal();
    this.render();

    // Reset inputs
    this.aiCodeInput.value = '';
    this.parsedPdfCards = [];
    this.pdfPreviewSection.classList.add('hidden');
    this.pdfFileInput.value = '';

    this.showToast(`🎉 Đã thêm thành công ${newCards.length} từ vựng vào "${targetDeck.name}"!`);
  }

  // ==================== DECK MANAGEMENT ====================

  openDeckModal() {
    this.renderDeckListModal();
    this.deckModal.classList.add('active');
    lucide.createIcons();
  }

  closeDeckModal() {
    this.deckModal.classList.remove('active');
  }

  renderDeckListModal() {
    this.deckListItems.innerHTML = this.decks.map(deck => `
      <div class="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div class="flex-1 mr-3">
          <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">${deck.name}</h4>
          <span class="text-xs text-slate-400">${deck.cards.length} thẻ • ${deck.cards.filter(c => c.mastered).length} đã thuộc</span>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="app.selectDeckFromModal('${deck.id}')" class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition">
            Chọn
          </button>
          ${this.decks.length > 1 ? `
          <button onclick="app.deleteDeck('${deck.id}')" class="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition" title="Xóa bộ thẻ">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          ` : ''}
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  createDeck() {
    const name = this.newDeckNameInput.value.trim();
    if (!name) {
      this.showToast('Vui lòng nhập tên cho bộ từ vựng', true);
      return;
    }

    const newDeck = {
      id: 'deck-' + Date.now(),
      name: name,
      createdAt: Date.now(),
      cards: []
    };

    this.decks.push(newDeck);
    this.currentDeckId = newDeck.id;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.newDeckNameInput.value = '';

    this.saveData();
    this.populateDeckSelectors();
    this.renderDeckListModal();
    this.render();
    this.showToast(`Đã tạo bộ thẻ: "${name}"`);
  }

  selectDeckFromModal(deckId) {
    this.currentDeckId = deckId;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.populateDeckSelectors();
    this.render();
    this.closeDeckModal();
  }

  deleteDeck(deckId) {
    const deck = this.decks.find(d => d.id === deckId);
    if (!deck) return;

    if (confirm(`Bạn có chắc muốn xóa bộ từ vựng "${deck.name}" và toàn bộ ${deck.cards.length} thẻ không?`)) {
      this.decks = this.decks.filter(d => d.id !== deckId);
      if (this.currentDeckId === deckId) {
        this.currentDeckId = this.decks[0].id;
        this.currentCardIndex = 0;
        this.isFlipped = false;
      }
      this.saveData();
      this.populateDeckSelectors();
      this.renderDeckListModal();
      this.render();
      this.showToast('Đã xóa bộ thẻ!');
    }
  }

  exportAllJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.decks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FlashLearn_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast('Đã tải xuống file sao lưu JSON!');
  }

  resetToDefault() {
    if (confirm('Khôi phục về bộ từ vựng mặc định ban đầu? Tất cả các từ đã thêm sẽ bị đặt lại.')) {
      this.decks = JSON.parse(JSON.stringify(DEFAULT_DECKS));
      this.currentDeckId = this.decks[0].id;
      this.currentCardIndex = 0;
      this.isFlipped = false;
      this.saveData();
      this.populateDeckSelectors();
      this.renderDeckListModal();
      this.render();
      this.showToast('Đã khôi phục dữ liệu mặc định ban đầu');
    }
  }

  // ==================== THEME LOGIC ====================
  initTheme() {
    const isDark = localStorage.getItem('flashlearn_theme') === 'dark' ||
      (!('flashlearn_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('flashlearn_theme', isDark ? 'dark' : 'light');
    lucide.createIcons();
  }

  // ==================== EVENT LISTENERS ====================
  initEvents() {
    // Card flip click
    this.flashcard.addEventListener('click', (e) => {
      // Don't flip if clicking interactive buttons inside card
      if (e.target.closest('button')) return;
      this.flipCard();
    });

    this.btnFlipCenter.addEventListener('click', () => this.flipCard());

    // Navigation buttons
    this.btnNextCard.addEventListener('click', () => this.nextCard());
    this.btnPrevCard.addEventListener('click', () => this.prevCard());

    // Rating buttons
    this.btnMarkLearning.addEventListener('click', () => this.markStatus(false));
    this.btnMarkMastered.addEventListener('click', () => this.markStatus(true));
    this.btnStarCard.addEventListener('click', () => this.toggleStar());

    // Audio TTS buttons
    this.btnPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      this.speakCurrentWord();
    });
    this.btnBackPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      this.speakCurrentWord();
    });

    // Deck select change
    this.deckSelect.addEventListener('change', (e) => {
      this.currentDeckId = e.target.value;
      this.currentCardIndex = 0;
      this.isFlipped = false;
      this.render();
    });

    // Top action buttons
    this.btnShuffle.addEventListener('click', () => this.shuffleCards());
    this.btnResetProgress.addEventListener('click', () => this.resetDeckProgress());
    this.btnToggleTheme.addEventListener('click', () => this.toggleTheme());

    // Filter tabs
    this.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeFilter = tab.dataset.filter;
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.render();
      });
    });

    // Import Modal triggers
    this.btnOpenImport.addEventListener('click', () => this.openImportModal());
    this.btnCloseImport.addEventListener('click', () => this.closeImportModal());
    this.btnCancelImport.addEventListener('click', () => this.closeImportModal());
    this.btnSubmitImport.addEventListener('click', () => this.submitImport());

    this.importTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchImportTab(tab.dataset.tab));
    });

    this.btnInsertSampleCode.addEventListener('click', () => this.insertSampleCode());
    this.btnCopyPrompt.addEventListener('click', () => this.copyPromptText());

    // PDF Drag & Drop and file picking
    this.dropZone.addEventListener('click', () => this.pdfFileInput.click());
    this.pdfFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handlePdfUpload(e.target.files[0]);
      }
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('border-indigo-500', 'bg-indigo-50/30');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/30');
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/30');
      if (e.dataTransfer.files.length > 0) {
        this.handlePdfUpload(e.dataTransfer.files[0]);
      }
    });

    // Deck Management Modal triggers
    this.btnManageDecks.addEventListener('click', () => this.openDeckModal());
    this.btnCloseDeckModal.addEventListener('click', () => this.closeDeckModal());
    this.btnCreateDeck.addEventListener('click', () => this.createDeck());
    this.newDeckNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createDeck();
    });
    this.btnExportAllJson.addEventListener('click', () => this.exportAllJson());
    this.btnResetToDefault.addEventListener('click', () => this.resetToDefault());

    // Close modals on clicking outside overlay
    window.addEventListener('click', (e) => {
      if (e.target === this.importModal) this.closeImportModal();
      if (e.target === this.deckModal) this.closeDeckModal();
    });

    // KEYBOARD SHORTCUTS
    window.addEventListener('keydown', (e) => {
      // Don't capture keyboard shortcuts when user is typing in inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.flipCard();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevCard();
      } else if (e.key === '1') {
        e.preventDefault();
        this.markStatus(false);
      } else if (e.key === '2') {
        e.preventDefault();
        this.markStatus(true);
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.toggleStar();
      } else if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'v') {
        e.preventDefault();
        this.speakCurrentWord();
      }
    });
  }
}

// Start application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new FlashLearnApp();
});

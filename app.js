/**
 * FlashLearn - Main Application Logic
 * Supports Multi-language Flashcards (English, Japanese, Korean, Chinese...) with Native TTS
 */

// Initial Sample Decks
const DEFAULT_DECKS = [
  {
    id: 'deck-japanese-n5',
    name: '🇯🇵 Từ vựng Tiếng Nhật N5 - N4 Thông Dụng',
    lang: 'ja-JP',
    createdAt: Date.now() - 1000,
    cards: [
      {
        id: 'jp1',
        word: '桜 (さくら)',
        phonetic: 'sakura',
        pos: 'danh từ',
        meaning: 'Hoa anh đào - biểu tượng mùa xuân của xứ sở mặt trời mọc',
        example: '春になると、桜の花がとても綺麗に咲きます。',
        exampleMeaning: 'Khi mùa xuân đến, hoa anh đào nở rất đẹp.',
        mastered: false,
        starred: true
      },
      {
        id: 'jp2',
        word: '食べる (たべる)',
        phonetic: 'taberu',
        pos: 'động từ nhóm 2',
        meaning: 'Ăn (dùng bữa)',
        example: '毎日朝ごはんをちゃんと食べます。',
        exampleMeaning: 'Mỗi ngày tôi đều ăn sáng đầy đủ.',
        mastered: false,
        starred: false
      },
      {
        id: 'jp3',
        word: '勉強 (べんきょう)',
        phonetic: 'benkyou',
        pos: 'danh từ / động từ',
        meaning: 'Học tập, việc học',
        example: '日本語の勉強はとても面白いです。',
        exampleMeaning: 'Việc học tiếng Nhật rất thú vị.',
        mastered: true,
        starred: false
      },
      {
        id: 'jp4',
        word: '素晴らしい (すばらしい)',
        phonetic: 'subarashii',
        pos: 'tính từ đuôi い',
        meaning: 'Tuyệt vời, xuất sắc, tráng lệ',
        example: '富士山の景色は本当に素晴らしいですね。',
        exampleMeaning: 'Phong cảnh núi Phú Sĩ thật sự rất tuyệt vời.',
        mastered: false,
        starred: true
      },
      {
        id: 'jp5',
        word: '感謝 (かんしゃ)',
        phonetic: 'kansha',
        pos: 'danh từ / động từ',
        meaning: 'Biết ơn, lòng cảm tạ',
        example: 'いつも助けてくれて心から感謝しています。',
        exampleMeaning: 'Tôi luôn ghi lòng biết ơn bạn vì đã luôn giúp đỡ tôi.',
        mastered: false,
        starred: false
      },
      {
        id: 'jp6',
        word: '一期一会 (いちごいちえ)',
        phonetic: 'ichigo ichie',
        pos: 'thành ngữ',
        meaning: 'Nhất kỳ nhất hội (mỗi cuộc gặp gỡ trong đời chỉ có một lần, hãy trân trọng)',
        example: '人との出会いを一期一会として大切にしたい。',
        exampleMeaning: 'Tôi muốn trân trọng từng cuộc gặp gỡ như một duyên lành chỉ có một lần trong đời.',
        mastered: false,
        starred: true
      }
    ]
  },
  {
    id: 'deck-ielts-core',
    name: '🇬🇧 Từ vựng IELTS & Giao tiếp Cốt Lõi',
    lang: 'en-US',
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
        word: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        pos: 'adjective',
        meaning: 'Có mặt ở khắp mọi nơi, rất phổ biến',
        example: 'Smartphones have become ubiquitous in modern society.',
        exampleMeaning: 'Điện thoại thông minh đã trở nên phổ biến ở khắp mọi nơi trong xã hội hiện đại.',
        mastered: true,
        starred: false
      },
      {
        id: 'c5',
        word: 'meticulous',
        phonetic: '/məˈtɪkjələs/',
        pos: 'adjective',
        meaning: 'Tỉ mỉ, cẩn thận, chăm chút từng li từng tí',
        example: 'He is meticulous about keeping his records up to date.',
        exampleMeaning: 'Anh ấy rất tỉ mỉ trong việc cập nhật hồ sơ của mình thường xuyên.',
        mastered: false,
        starred: false
      }
    ]
  }
];

class FlashLearnApp {
  constructor() {
    this.storageKey = 'flashlearn_app_data_v2';
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
    this.initVoices();
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
    this.frontLangBadge = document.getElementById('frontLangBadge');
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
    this.btnPlayExampleSound = document.getElementById('btnPlayExampleSound');

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
    this.btnInsertSampleEnglish = document.getElementById('btnInsertSampleEnglish');
    this.btnInsertSampleJapanese = document.getElementById('btnInsertSampleJapanese');
    this.dropZone = document.getElementById('dropZone');
    this.pdfFileInput = document.getElementById('pdfFileInput');
    this.pdfParsingStatus = document.getElementById('pdfParsingStatus');
    this.pdfStatusText = document.getElementById('pdfStatusText');
    this.pdfPreviewSection = document.getElementById('pdfPreviewSection');
    this.pdfExtractedCount = document.getElementById('pdfExtractedCount');
    this.pdfItemsList = document.getElementById('pdfItemsList');

    // Prompt Switcher
    this.btnPromptLangEn = document.getElementById('btnPromptLangEn');
    this.btnPromptLangJp = document.getElementById('btnPromptLangJp');
    this.promptTitleLabel = document.getElementById('promptTitleLabel');
    this.btnCopyPrompt = document.getElementById('btnCopyPrompt');
    this.copyPromptLabel = document.getElementById('copyPromptLabel');
    this.samplePromptText = document.getElementById('samplePromptText');

    // Decks Modal
    this.deckModal = document.getElementById('deckModal');
    this.btnCloseDeckModal = document.getElementById('btnCloseDeckModal');
    this.newDeckNameInput = document.getElementById('newDeckNameInput');
    this.newDeckLangSelect = document.getElementById('newDeckLangSelect');
    this.btnCreateDeck = document.getElementById('btnCreateDeck');
    this.deckListItems = document.getElementById('deckListItems');
    this.btnExportAllJson = document.getElementById('btnExportAllJson');
    this.btnResetToDefault = document.getElementById('btnResetToDefault');

    // Toast
    this.toast = document.getElementById('toast');
    this.toastMessage = document.getElementById('toastMessage');
  }

  initVoices() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Cached in browser
      };
    }
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
      opt.textContent = `${deck.name} (${deck.cards.length})`;
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

  // Detect language of word: Japanese, Korean, Chinese, or English
  detectLanguage(text) {
    if (!text) return 'en-US';
    // Japanese: Hiragana, Katakana, or typical Japanese Kanji
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
      return 'ja-JP';
    }
    // Korean: Hangul
    if (/[\uAC00-\uD7A3\u1100-\u11FF]/.test(text)) {
      return 'ko-KR';
    }
    // Kanji / CJK ideographs
    if (/[\u4E00-\u9FFF]/.test(text)) {
      const deck = this.getCurrentDeck();
      if (deck && deck.lang && deck.lang !== 'auto') return deck.lang;
      return 'ja-JP'; // Default Kanji to Japanese
    }
    return 'en-US';
  }

  cleanTextForSpeech(text, lang) {
    if (!text) return '';
    // If Japanese and contains reading in parentheses like "桜 (さくら)"
    const jpMatch = text.match(/\(([\u3040-\u309F\u30A0-\u30FF]+)\)/);
    if (lang === 'ja-JP' && jpMatch) {
      return jpMatch[1]; // speak the kana reading directly
    }
    // Remove parentheses and slashes
    return text.replace(/[\(\)\[\]\/]/g, ' ').trim();
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

    const cardLang = deck.lang && deck.lang !== 'auto' ? deck.lang : this.detectLanguage(currentCard.word);

    // Front Face
    this.frontWord.textContent = currentCard.word || 'Chưa có từ';
    this.frontPhonetic.textContent = currentCard.phonetic || '';
    this.frontPhonetic.style.display = currentCard.phonetic ? 'block' : 'none';
    this.frontPos.textContent = currentCard.pos || 'vocabulary';

    // Lang badge
    if (cardLang.startsWith('ja')) {
      this.frontLangBadge.textContent = '🇯🇵 JP';
      this.frontLangBadge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
    } else if (cardLang.startsWith('ko')) {
      this.frontLangBadge.textContent = '🇰🇷 KR';
      this.frontLangBadge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400';
    } else if (cardLang.startsWith('zh')) {
      this.frontLangBadge.textContent = '🇨🇳 CN';
      this.frontLangBadge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400';
    } else {
      this.frontLangBadge.textContent = '🇬🇧 EN';
      this.frontLangBadge.className = 'text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400';
    }

    // Star icon
    const starIcon = this.btnStarCard.querySelector('i');
    if (starIcon) {
      if (currentCard.starred) {
        this.btnStarCard.classList.add('text-amber-500');
        this.btnStarCard.classList.remove('text-slate-400');
        starIcon.classList.add('fill-amber-400');
      } else {
        this.btnStarCard.classList.remove('text-amber-500');
        this.btnStarCard.classList.add('text-slate-400');
        starIcon.classList.remove('fill-amber-400');
      }
    }

    // Back Face
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

    // Flip state synchronization
    if (this.isFlipped) {
      this.flashcard.classList.add('is-flipped');
    } else {
      this.flashcard.classList.remove('is-flipped');
    }

    lucide.createIcons();
  }

  renderEmptyState() {
    this.frontWord.textContent = 'Trống';
    this.frontPhonetic.textContent = 'Không có thẻ nào trong bộ lọc này';
    this.frontPos.textContent = 'empty';
    this.frontLangBadge.textContent = '--';
    this.backMeaning.textContent = 'Hãy thêm từ vựng mới hoặc chuyển sang bộ lọc khác!';
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

  resetFlipWithoutAnimation() {
    this.isFlipped = false;
    this.flashcard.style.transition = 'none';
    this.flashcard.classList.remove('is-flipped');
    // Force DOM reflow to apply instant transform
    void this.flashcard.offsetWidth;
    setTimeout(() => {
      this.flashcard.style.transition = '';
    }, 50);
  }

  nextCard() {
    const cards = this.getFilteredCards();
    if (this.currentCardIndex < cards.length - 1) {
      this.resetFlipWithoutAnimation();
      this.currentCardIndex++;
      this.render();
    } else if (cards.length > 0 && this.currentCardIndex === cards.length - 1) {
      this.triggerConfetti();
      this.showToast('🎉 Tuyệt vời! Bạn đã xem hết tất cả các thẻ trong phần này.');
    }
  }

  prevCard() {
    if (this.currentCardIndex > 0) {
      this.resetFlipWithoutAnimation();
      this.currentCardIndex--;
      this.render();
    }
  }

  markStatus(isMastered) {
    const card = this.getCurrentCard();
    if (!card) return;

    card.mastered = isMastered;
    this.saveData();

    if (isMastered) {
      this.showToast(`✅ Đã nhớ: "${card.word}"`);
    } else {
      this.showToast(`📌 Đã chuyển "${card.word}" vào danh sách cần ôn`);
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

  // TTS with Japanese, English and multi-language support
  speakText(rawText, explicitLang = null) {
    if (!rawText) return;

    if (!('speechSynthesis' in window)) {
      this.showToast('Trình duyệt của bạn không hỗ trợ phát âm TTS', true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop pending sounds

    const deck = this.getCurrentDeck();
    let lang = explicitLang || (deck && deck.lang && deck.lang !== 'auto' ? deck.lang : this.detectLanguage(rawText));

    const clean = this.cleanTextForSpeech(rawText, lang);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = lang.startsWith('ja') ? 0.95 : 0.9;

    // Match voice in browser
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split('-')[0].toLowerCase();

    const voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase())
      || voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));

    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);

    const langLabel = lang.startsWith('ja') ? 'Tiếng Nhật 🇯🇵' : (lang.startsWith('en') ? 'Tiếng Anh 🇬🇧' : lang);
    this.showToast(`🔊 Đang phát âm: ${langLabel}`);
  }

  shuffleCards() {
    const deck = this.getCurrentDeck();
    if (!deck || deck.cards.length <= 1) return;

    for (let i = deck.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
    }

    this.resetFlipWithoutAnimation();
    this.currentCardIndex = 0;
    this.saveData();
    this.render();
    this.showToast('🔀 Đã xáo trộn ngẫu nhiên thứ tự các thẻ!');
  }

  resetDeckProgress() {
    const deck = this.getCurrentDeck();
    if (!deck) return;

    if (confirm(`Bạn có chắc muốn đặt lại trạng thái học của bộ thẻ "${deck.name}" về ban đầu?`)) {
      deck.cards.forEach(c => c.mastered = false);
      this.resetFlipWithoutAnimation();
      this.currentCardIndex = 0;
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

  insertSampleEnglish() {
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
  }
]`;
    this.aiCodeInput.value = sample;
    this.showToast('Đã dán mẫu code Tiếng Anh!');
  }

  insertSampleJapanese() {
    const sample = `[
  {
    "word": "木漏れ日 (こもれび)",
    "phonetic": "komorebi",
    "pos": "danh từ",
    "meaning": "Ánh nắng len lỏi qua kẽ lá",
    "example": "森の中を歩きながら、木漏れ日を楽しんだ。",
    "exampleMeaning": "Vừa đi dạo trong rừng, vừa tận hưởng ánh nắng len lỏi qua kẽ lá."
  },
  {
    "word": "懐かしい (なつかしい)",
    "phonetic": "natsukashii",
    "pos": "tính từ đuôi い",
    "meaning": "Hoài niệm, gợi nhớ kỷ niệm xưa êm đềm",
    "example": "この曲を聞くと、子どもの頃が懐かしい。",
    "exampleMeaning": "Mỗi khi nghe bài hát này, tôi lại nhớ về thời thơ ấu."
  },
  {
    "word": "一生懸命 (いっしょうけんめい)",
    "phonetic": "isshoukenmei",
    "pos": "phó từ / danh từ",
    "meaning": "Cố gắng hết sức mình, dốc toàn lực",
    "example": "夢を叶えるために、一生懸命頑張ります。",
    "exampleMeaning": "Để biến ước mơ thành hiện thực, tôi sẽ cố gắng hết sức mình."
  }
]`;
    this.aiCodeInput.value = sample;
    this.showToast('Đã dán mẫu code Tiếng Nhật 🇯🇵!');
  }

  setPromptTemplate(lang) {
    if (lang === 'jp') {
      this.btnPromptLangJp.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 transition';
      this.btnPromptLangEn.className = 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 transition flex items-center gap-1';
      this.promptTitleLabel.textContent = 'Mẫu Prompt Tiếng Nhật (JLPT / Giao tiếp):';
      this.samplePromptText.textContent = `Hãy tạo cho tôi danh sách 15 từ vựng tiếng Nhật chủ đề [CHỦ ĐỀ BẠN MUỐN, VD: JLPT N5-N4 / Giao tiếp quán ăn / Công việc] dưới định dạng JSON sau:
[
  {
    "word": "Từ Kanji kèm cách đọc trong ngoặc, ví dụ: 桜 (さくら)",
    "phonetic": "cách đọc Romaji hoặc Hiragana",
    "pos": "từ loại (danh từ, động từ nhóm 1...)",
    "meaning": "nghĩa tiếng Việt ngắn gọn, dễ nhớ",
    "example": "Câu ví dụ tiếng Nhật tự nhiên",
    "exampleMeaning": "Dịch nghĩa câu ví dụ sang tiếng Việt"
  }
]
Chỉ xuất duy nhất khối JSON, không kèm lời dẫn.`;
    } else {
      this.btnPromptLangEn.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 transition';
      this.btnPromptLangJp.className = 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 transition flex items-center gap-1';
      this.promptTitleLabel.textContent = 'Mẫu Prompt Tiếng Anh:';
      this.samplePromptText.textContent = `Hãy tạo cho tôi danh sách 15 từ vựng tiếng Anh chủ đề [CHỦ ĐỀ_CỦA_BẠN, ví dụ: IELTS Speaking / Công nghệ / Du lịch] dưới định dạng JSON sau:
[
  {
    "word": "từ tiếng anh",
    "phonetic": "/phiên âm IPA/",
    "pos": "từ loại (noun, verb, adj...)",
    "meaning": "nghĩa tiếng Việt ngắn gọn, dễ hiểu",
    "example": "Câu ví dụ tiếng Anh tự nhiên",
    "exampleMeaning": "Dịch nghĩa câu ví dụ sang tiếng Việt"
  }
]
Chỉ xuất duy nhất khối JSON, không kèm lời dẫn.`;
    }
  }

  copyPromptText() {
    const text = this.samplePromptText.textContent;
    navigator.clipboard.writeText(text).then(() => {
      this.copyPromptLabel.textContent = 'Đã sao chép! ✔';
      setTimeout(() => {
        this.copyPromptLabel.textContent = 'Sao chép prompt';
      }, 2000);
      this.showToast('📋 Đã sao chép prompt! Bạn dán vào ChatGPT / Gemini nhé.');
    });
  }

  parseInputCode(raw) {
    const text = raw.trim();
    if (!text) return [];

    // Parse JSON
    if (text.startsWith('[') || text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        return list.map((item, idx) => ({
          id: 'card-' + Date.now() + '-' + idx,
          word: item.word || item.vocab || item.term || '',
          phonetic: item.phonetic || item.ipa || item.romaji || item.pronunciation || '',
          pos: item.pos || item.type || '',
          meaning: item.meaning || item.definition || item.vietnamese || '',
          example: item.example || item.sentence || '',
          exampleMeaning: item.exampleMeaning || item.example_meaning || item.sentenceMeaning || '',
          mastered: false,
          starred: false
        })).filter(c => c.word && c.meaning);
      } catch (err) {
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
            phonetic: parts.length > 2 && (parts[1].startsWith('/') || /^[a-zA-Z\s]+$/.test(parts[1])) ? parts[1] : '',
            pos: '',
            meaning: parts.length > 2 && (parts[1].startsWith('/') || /^[a-zA-Z\s]+$/.test(parts[1])) ? parts[2] : parts[1],
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
        this.showToast('Không tự động nhận diện được từ vựng. Bạn hãy copy text rồi dán qua tab "Dán mã AI" nhé!', true);
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
        lang: 'auto',
        createdAt: Date.now(),
        cards: []
      };
      this.decks.push(targetDeck);
      targetDeckId = targetDeck.id;
    }

    let newCards = [];

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
    this.resetFlipWithoutAnimation();
    this.currentCardIndex = Math.max(0, targetDeck.cards.length - newCards.length);

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
    this.deckListItems.innerHTML = this.decks.map(deck => {
      const langIcon = deck.lang === 'ja-JP' ? '🇯🇵' : (deck.lang === 'en-US' ? '🇬🇧' : (deck.lang === 'ko-KR' ? '🇰🇷' : '🌐'));
      return `
      <div class="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div class="flex-1 mr-3">
          <div class="flex items-center gap-1.5">
            <span>${langIcon}</span>
            <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">${deck.name}</h4>
          </div>
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
    `;}).join('');
    lucide.createIcons();
  }

  createDeck() {
    const name = this.newDeckNameInput.value.trim();
    if (!name) {
      this.showToast('Vui lòng nhập tên cho bộ từ vựng', true);
      return;
    }

    const lang = this.newDeckLangSelect.value || 'auto';

    const newDeck = {
      id: 'deck-' + Date.now(),
      name: name,
      lang: lang,
      createdAt: Date.now(),
      cards: []
    };

    this.decks.push(newDeck);
    this.currentDeckId = newDeck.id;
    this.resetFlipWithoutAnimation();
    this.currentCardIndex = 0;
    this.newDeckNameInput.value = '';

    this.saveData();
    this.populateDeckSelectors();
    this.renderDeckListModal();
    this.render();
    this.showToast(`Đã tạo bộ thẻ: "${name}"`);
  }

  selectDeckFromModal(deckId) {
    this.currentDeckId = deckId;
    this.resetFlipWithoutAnimation();
    this.currentCardIndex = 0;
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
        this.resetFlipWithoutAnimation();
        this.currentCardIndex = 0;
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
      this.resetFlipWithoutAnimation();
      this.currentCardIndex = 0;
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
    // Card flip click - only flips if not clicking inner action buttons
    this.flashcard.addEventListener('click', (e) => {
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

    // Audio TTS buttons: Word & Example sentence
    this.btnPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = this.getCurrentCard();
      if (card) this.speakText(card.word);
    });

    this.btnBackPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = this.getCurrentCard();
      if (card) this.speakText(card.word);
    });

    this.btnPlayExampleSound.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = this.getCurrentCard();
      if (card && card.example) this.speakText(card.example);
    });

    // Deck select change
    this.deckSelect.addEventListener('change', (e) => {
      this.currentDeckId = e.target.value;
      this.resetFlipWithoutAnimation();
      this.currentCardIndex = 0;
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
        this.resetFlipWithoutAnimation();
        this.currentCardIndex = 0;
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

    this.btnInsertSampleEnglish.addEventListener('click', () => this.insertSampleEnglish());
    this.btnInsertSampleJapanese.addEventListener('click', () => this.insertSampleJapanese());

    this.btnPromptLangEn.addEventListener('click', () => this.setPromptTemplate('en'));
    this.btnPromptLangJp.addEventListener('click', () => this.setPromptTemplate('jp'));
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
        const card = this.getCurrentCard();
        if (card) this.speakText(card.word);
      }
    });
  }
}

// Start application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new FlashLearnApp();
});

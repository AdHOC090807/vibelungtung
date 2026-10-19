/**
 * FlashLearn - Main Application Logic
 * Supports Multi-language Flashcards (Japanese 🇯🇵, English 🇬🇧, Korean 🇰🇷...)
 * With Dual-Engine Native Audio & Auto-Play Audio Support
 */

// Initial Sample Decks
const DEFAULT_DECKS = [
  {
    id: 'deck-japanese-n5',
    name: '🇯🇵 Tiếng Nhật N5 - N4 Thông Dụng',
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
        meaning: 'Ăn (dùng bữa, ăn uống)',
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
        meaning: 'Học tập, việc học hành',
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
        meaning: 'Biết ơn, lòng cảm tạ sâu sắc',
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
      },
      {
        id: 'jp7',
        word: '友達 (ともだち)',
        phonetic: 'tomodachi',
        pos: 'danh từ',
        meaning: 'Bạn bè, người bạn đồng hành',
        example: '週末に友達と一緒に映画を見に行きます。',
        exampleMeaning: 'Cuối tuần tôi đi xem phim cùng với bạn bè.',
        mastered: false,
        starred: false
      },
      {
        id: 'jp8',
        word: '約束 (やくそく)',
        phonetic: 'yakusoku',
        pos: 'danh từ / động từ',
        meaning: 'Lời hứa, cuộc hẹn ước',
        example: 'どんなことがあっても、約束を守ります。',
        exampleMeaning: 'Dù có chuyện gì xảy ra, tôi cũng sẽ giữ trọn lời hứa.',
        mastered: false,
        starred: true
      },
      {
        id: 'jp9',
        word: '先生 (せんせい)',
        phonetic: 'sensei',
        pos: 'danh từ',
        meaning: 'Thầy giáo, cô giáo, bác sĩ',
        example: '先生、いつも熱心に教えてくださりありがとうございます。',
        exampleMeaning: 'Thưa thầy cô, cảm ơn thầy cô đã luôn nhiệt tình chỉ dạy chúng em.',
        mastered: false,
        starred: false
      },
      {
        id: 'jp10',
        word: '家族 (かぞく)',
        phonetic: 'kazoku',
        pos: 'danh từ',
        meaning: 'Gia đình, những người thân yêu nhất',
        example: '私にとって家族が一番大切な存在です。',
        exampleMeaning: 'Đối với tôi, gia đình là điều quan trọng và quý giá nhất.',
        mastered: false,
        starred: true
      },
      {
        id: 'jp11',
        word: '行く (いく)',
        phonetic: 'iku',
        pos: 'động từ nhóm 1',
        meaning: 'Đi (di chuyển từ nơi này sang nơi khác)',
        example: '来週、友達と日本へ旅行に行きます。',
        exampleMeaning: 'Tuần sau tôi sẽ đi du lịch Nhật Bản cùng bạn bè.',
        mastered: false,
        starred: false
      },
      {
        id: 'jp12',
        word: '毎日 (まいにち)',
        phonetic: 'mainichi',
        pos: 'phó từ / danh từ',
        meaning: 'Mỗi ngày, hàng ngày',
        example: '毎日日本語の単語を10個覚えるようにしています。',
        exampleMeaning: 'Mỗi ngày tôi đều cố gắng học thuộc 10 từ vựng tiếng Nhật.',
        mastered: false,
        starred: false
      }
    ]
  },
  {
    id: 'deck-chinese-hsk',
    name: '🇨🇳 Tiếng Trung HSK & Giao Tiếp',
    lang: 'auto',
    createdAt: Date.now() - 500,
    cards: [
      {
        id: 'zh1',
        word: '你好',
        phonetic: 'nǐ hǎo',
        pos: 'thán từ / chào hỏi',
        meaning: 'Xin chào (lời chào lịch sự, thân thiện)',
        example: '你好！很高兴认识你。',
        exampleMeaning: 'Xin chào! Rất vui được làm quen với bạn.',
        mastered: false,
        starred: true
      },
      {
        id: 'zh2',
        word: '谢谢',
        phonetic: 'xièxie',
        pos: 'động từ / cảm ơn',
        meaning: 'Cảm ơn, cảm tạ sự giúp đỡ',
        example: '非常感谢你的热情帮助！',
        exampleMeaning: 'Vô cùng cảm ơn sự giúp đỡ nhiệt tình của bạn!',
        mastered: false,
        starred: false
      },
      {
        id: 'zh3',
        word: '学习',
        phonetic: 'xuéxí',
        pos: 'động từ / danh từ',
        meaning: 'Học tập, rèn luyện kiến thức',
        example: '每天努力学习中文，进步很快。',
        exampleMeaning: 'Mỗi ngày chăm chỉ học tiếng Trung, tiến bộ rất nhanh.',
        mastered: true,
        starred: false
      },
      {
        id: 'zh4',
        word: '朋友',
        phonetic: 'péngyou',
        pos: 'danh từ',
        meaning: 'Bạn bè, bạn hữu tri kỷ',
        example: '海内存知己，天涯若比邻。',
        exampleMeaning: 'Trong bốn bể có tri kỷ, thì chân trời cũng gần gũi như hàng xóm.',
        mastered: false,
        starred: true
      },
      {
        id: 'zh5',
        word: '世界',
        phonetic: 'shìjiè',
        pos: 'danh từ',
        meaning: 'Thế giới, vũ trụ bao la',
        example: '世界很大，我想去看看。',
        exampleMeaning: 'Thế giới rất rộng lớn, tôi muốn đi ngắm nhìn.',
        mastered: false,
        starred: false
      },
      {
        id: 'zh6',
        word: '再见',
        phonetic: 'zàijiàn',
        pos: 'từ chào tạm biệt',
        meaning: 'Tạm biệt (hẹn sớm gặp lại)',
        example: '明天见，路上小心，再见！',
        exampleMeaning: 'Ngày mai gặp lại nhé, đi đường cẩn thận, tạm biệt!',
        mastered: false,
        starred: false
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
    this.storageKey = 'flashlearn_app_data_v5';
    this.decks = [];
    this.currentDeckId = null;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.activeFilter = 'all'; // 'all' | 'learning' | 'starred'
    this.parsedPdfCards = [];
    this._currentAudio = null;
    this._audioCache = new Map();
    this._serverBaseUrl = window.location.origin.startsWith('http') ? window.location.origin : 'http://localhost:8000';
    this._isServerOnline = false;
    this.isAutoPlay = localStorage.getItem('flashlearn_autoplay') === 'true';

    this.initElements();
    this.loadData();
    this.initEvents();
    this.initTheme();
    this.updateAutoPlayUI();
    this.checkServerStatus();
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
    this.elevenLabsStatusBadge = document.getElementById('elevenLabsStatusBadge');

    // Auto Play Toggle
    this.btnToggleAutoPlay = document.getElementById('btnToggleAutoPlay');
    this.autoPlayIcon = document.getElementById('autoPlayIcon');
    this.autoPlayLabel = document.getElementById('autoPlayLabel');

    // Filter Tabs
    this.filterTabs = document.querySelectorAll('.filter-tab');

    // Card Elements
    this.flashcard = document.getElementById('flashcard');
    this.frontPos = document.getElementById('frontPos');
    this.frontLangBadge = document.getElementById('frontLangBadge');
    this.frontAiBadge = document.getElementById('frontAiBadge');
    this.btnStarCard = document.getElementById('btnStarCard');
    this.btnPlaySound = document.getElementById('btnPlaySound');
    this.btnWordSpeak = document.getElementById('btnWordSpeak');
    this.frontWord = document.getElementById('frontWord');
    this.frontPhonetic = document.getElementById('frontPhonetic');

    // Card Back
    this.backWord = document.getElementById('backWord');
    this.btnBackPlaySound = document.getElementById('btnBackPlaySound');
    this.backMeaning = document.getElementById('backMeaning');
    this.btnMeaningSpeak = document.getElementById('btnMeaningSpeak');
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
    this.btnInsertSampleChinese = document.getElementById('btnInsertSampleChinese');
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
    this.btnPromptLangZh = document.getElementById('btnPromptLangZh');
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

  loadData() {
    let saved = null;
    try {
      saved = localStorage.getItem('flashlearn_app_data_v5') ||
              localStorage.getItem('flashlearn_app_data_v4') ||
              localStorage.getItem('flashlearn_app_data_v3') || 
              localStorage.getItem('flashlearn_app_data_v2') || 
              localStorage.getItem('flashlearn_app_data_v1');
      if (saved) {
        this.decks = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu từ LocalStorage:', e);
    }

    if (!this.decks || this.decks.length === 0) {
      this.decks = JSON.parse(JSON.stringify(DEFAULT_DECKS));
    } else {
      // Ensure Japanese deck is present & has all 12 default cards
      let jpDeck = this.decks.find(d => d.id === 'deck-japanese-n5');
      if (!jpDeck) {
        jpDeck = this.decks.find(d => d.lang && d.lang.startsWith('ja'));
      }
      const defaultJp = DEFAULT_DECKS.find(d => d.id === 'deck-japanese-n5');
      if (!jpDeck) {
        if (defaultJp) this.decks.unshift(JSON.parse(JSON.stringify(defaultJp)));
      } else if (defaultJp) {
        // Merge any default cards that aren't in jpDeck yet
        defaultJp.cards.forEach(card => {
          if (!jpDeck.cards.some(c => c.id === card.id || c.word === card.word)) {
            jpDeck.cards.push(JSON.parse(JSON.stringify(card)));
          }
        });
      }

      // Ensure Chinese deck is present
      const hasChinese = this.decks.some(d => d.id === 'deck-chinese-hsk' || (d.lang && d.lang.startsWith('zh')));
      if (!hasChinese) {
        const zhDeck = DEFAULT_DECKS.find(d => d.id === 'deck-chinese-hsk');
        if (zhDeck) this.decks.splice(1, 0, JSON.parse(JSON.stringify(zhDeck)));
      }
    }

    this.saveData();
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

  // Tự động nhận diện ngôn ngữ văn bản: Tiếng Nhật (ja-JP), Tiếng Việt (vi-VN), Tiếng Anh (en-US)
  detectLanguage(text) {
    if (!text) return 'en-US';

    // 1. Tiếng Nhật: Chứa ký tự Hiragana, Katakana hoặc Kanji
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
      return 'ja-JP';
    }

    // 2. Tiếng Việt: Chứa ký tự có dấu hoặc chữ đ/Đ
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i.test(text)) {
      return 'vi-VN';
    }

    // 3. Mặc định còn lại: Tiếng Anh
    return 'en-US';
  }

  cleanTextForSpeech(text, lang) {
    if (!text) return '';
    if (lang.startsWith('ja')) {
      // Nếu là tiếng Nhật và có cách đọc Hiragana trong ngoặc ví dụ "桜 (さくら)" -> đọc "さくら"
      const jpMatch = text.match(/\(([\u3040-\u309F\u30A0-\u30FF]+)\)/);
      if (jpMatch) return jpMatch[1];
    }
    if (lang.startsWith('zh')) {
      // Bỏ pinyin hoặc chú thích trong ngoặc đơn/vuông ví dụ "你好 (nǐ hǎo)" -> "你好"
      const cleaned = text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
      if (cleaned) return cleaned;
    }
    if (lang.startsWith('en')) {
      // Bỏ ký hiệu phiên âm IPA hoặc chú thích ví dụ "resilient (/rɪˈzɪliənt/)" -> "resilient"
      const cleaned = text.replace(/\/[^\/]+\//g, '').replace(/\([^)]*\)/g, '').trim();
      if (cleaned) return cleaned;
    }
    // Dọn dẹp dấu ngoặc đơn, ngoặc vuông và gạch chéo
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

    const cardLang = (deck.lang && deck.lang !== 'auto') 
      ? (deck.lang === 'ja-JP' && /[\u4E00-\u9FFF]/.test(currentCard.word) ? 'ja-JP' : this.detectLanguage(currentCard.word))
      : this.detectLanguage(currentCard.word);

    // Front Face (TỪ VỰNG)
    this.frontWord.textContent = currentCard.word || 'Chưa có từ';
    this.frontPhonetic.textContent = currentCard.phonetic || '';
    this.frontPhonetic.style.display = currentCard.phonetic ? 'block' : 'none';
    this.frontPos.textContent = currentCard.pos || 'Từ vựng';

    // Lang badge
    if (cardLang.startsWith('zh')) {
      this.frontLangBadge.textContent = '🇨🇳 Tiếng Trung';
      this.frontLangBadge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40';
      if (this.frontAiBadge) this.frontAiBadge.style.display = 'none';
    } else if (cardLang.startsWith('ja')) {
      this.frontLangBadge.textContent = '🇯🇵 Tiếng Nhật';
      this.frontLangBadge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40';
      if (this.frontAiBadge) this.frontAiBadge.style.display = 'none';
    } else if (cardLang.startsWith('ko')) {
      this.frontLangBadge.textContent = '🇰🇷 Tiếng Hàn';
      this.frontLangBadge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40';
      if (this.frontAiBadge) this.frontAiBadge.style.display = 'none';
    } else {
      this.frontLangBadge.textContent = '🇬🇧 Tiếng Anh';
      this.frontLangBadge.className = 'text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40';
      if (this.frontAiBadge) this.frontAiBadge.style.display = 'inline-flex';
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

    // Back Face (NGHĨA & VÍ DỤ)
    this.backWord.textContent = currentCard.word;
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
    this.stopAudio();

    if (this.isFlipped) {
      this.flashcard.classList.add('is-flipped');
      // Khi người dùng bấm lật sang Mặt sau: Tự động đọc nghĩa (tiếng Việt) ở mặt sau
      if (this.isAutoPlay) {
        const card = this.getCurrentCard();
        if (card && card.meaning) {
          setTimeout(() => {
            if (this.isFlipped) {
              this.playAudio(card.meaning);
            }
          }, 180);
        }
      }
    } else {
      this.flashcard.classList.remove('is-flipped');
      // Khi người dùng lật về Mặt trước: Tự động đọc từ vựng ở mặt trước
      if (this.isAutoPlay) {
        const card = this.getCurrentCard();
        if (card && card.word) {
          setTimeout(() => {
            if (!this.isFlipped) {
              this.playAudio(card.word);
            }
          }, 180);
        }
      }
    }
  }

  resetFlipWithoutAnimation() {
    this.isFlipped = false;
    this.flashcard.style.transition = 'none';
    this.flashcard.classList.remove('is-flipped');
    void this.flashcard.offsetWidth; // Force reflow
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
      this.checkAndAutoPlay();
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
      this.checkAndAutoPlay();
    }
  }

  markStatus(isMastered) {
    const card = this.getCurrentCard();
    if (!card) return;

    card.mastered = isMastered;
    this.saveData();

    if (this._isServerOnline) {
      fetch(`${this._serverBaseUrl}/api/cards/${encodeURIComponent(card.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mastered: isMastered })
      }).catch(err => console.warn('[FlashLearn] Lỗi lưu trạng thái thẻ lên SQLite:', err));
    }

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

    if (this._isServerOnline) {
      fetch(`${this._serverBaseUrl}/api/cards/${encodeURIComponent(card.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: card.starred })
      }).catch(err => console.warn('[FlashLearn] Lỗi lưu sao lên SQLite:', err));
    }

    this.render();
    this.showToast(card.starred ? '⭐ Đã thêm vào mục Yêu thích' : 'Đã bỏ yêu thích');
  }

  // ==================== AUTO-PLAY LOGIC ====================
  toggleAutoPlay() {
    this.isAutoPlay = !this.isAutoPlay;
    localStorage.setItem('flashlearn_autoplay', this.isAutoPlay ? 'true' : 'false');
    this.updateAutoPlayUI();

    if (this.isAutoPlay) {
      this.showToast('🔊 Đã BẬT tự động đọc AI theo từng mặt thẻ!');
      const card = this.getCurrentCard();
      if (card) {
        if (this.isFlipped && card.meaning) {
          this.playAudio(card.meaning);
        } else if (!this.isFlipped && card.word) {
          this.playAudio(card.word);
        }
      }
    } else {
      this.stopAudio();
      this.showToast('🔇 Đã TẮT tự động đọc');
    }
  }

  updateAutoPlayUI() {
    if (this.isAutoPlay) {
      this.btnToggleAutoPlay.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 transition shadow-sm active:scale-95';
      this.autoPlayLabel.textContent = 'Tự động đọc: BẬT 🔊';
      this.autoPlayIcon.className = 'w-3.5 h-3.5 text-emerald-500 animate-pulse';
    } else {
      this.btnToggleAutoPlay.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm active:scale-95';
      this.autoPlayLabel.textContent = 'Tự động đọc: Tắt';
      this.autoPlayIcon.className = 'w-3.5 h-3.5 text-slate-400';
    }
    lucide.createIcons();
  }

  checkAndAutoPlay() {
    if (this.isAutoPlay && !this.isFlipped) {
      const card = this.getCurrentCard();
      if (card && card.word) {
        this.stopAudio();
        setTimeout(() => {
          if (!this.isFlipped) {
            this.playAudio(card.word);
          }
        }, 150);
      }
    }
  }

  // ==================== FASTAPI FULL-STACK & AUDIO SYSTEM ====================
  async checkServerStatus() {
    // Nếu đang chạy trên GitHub Pages (hoặc môi trường hosting tĩnh)
    if (window.location.hostname.includes('github.io')) {
      this._isServerOnline = false;
      this.updateServerBadge(false, null, true);
      console.log('[FlashLearn] Chạy trên GitHub Pages: Chế độ trực tuyến độc lập (Client-side Standalone)');
      return;
    }

    try {
      const res = await fetch(`${this._serverBaseUrl}/api/status`, { mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        this._isServerOnline = true;
        this.updateServerBadge(true, data);
        console.log('[FlashLearn] Full-stack Server is online:', data);
        // Đồng bộ dữ liệu CSDL SQLite
        await this.syncWithServer();
      } else {
        this._isServerOnline = false;
        this.updateServerBadge(false);
      }
    } catch (e) {
      this._isServerOnline = false;
      this.updateServerBadge(false);
    }
  }

  updateServerBadge(isOnline, data = null, isGitHubPages = false) {
    if (!this.elevenLabsStatusBadge) return;
    if (isGitHubPages) {
      this.elevenLabsStatusBadge.className = 'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 cursor-pointer shadow-sm hover:bg-indigo-100 transition';
      this.elevenLabsStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <i data-lucide="globe" class="w-3.5 h-3.5 text-indigo-600"></i>
        <span>GitHub Pages (Trực tuyến)</span>
      `;
      this.elevenLabsStatusBadge.title = 'Đang chạy trực tiếp trên GitHub Pages!\n- Âm thanh: Trực tuyến chuẩn tức thì (Native Stream + Web Speech)\n- Dữ liệu: Lưu an toàn trên trình duyệt (LocalStorage)\n- Khi muốn dùng SQLite & giọng ElevenLabs AI: hãy tải về và chạy start-server.bat';
    } else if (isOnline && data) {
      this.elevenLabsStatusBadge.className = 'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 cursor-pointer shadow-sm hover:bg-violet-100 transition';
      this.elevenLabsStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-violet-600"></i>
        <span>ElevenLabs AI (Đa ngôn ngữ) + SQLite</span>
      `;
      this.elevenLabsStatusBadge.title = `Server Full-stack & SQLite đang hoạt động!\nCSDL: SQLite (flashcards.db - ${data.cards_count} thẻ)\nGiọng đọc: ElevenLabs AI (${data.elevenlabs_model_id || 'eleven_flash_v2_5'})\nCache: ${data.cache_count} file (${data.cache_size_mb} MB)\nBấm vào để xem thông tin chi tiết.`;
    } else {
      this.elevenLabsStatusBadge.className = 'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 transition';
      this.elevenLabsStatusBadge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Bật Server Full-stack</span>
      `;
      this.elevenLabsStatusBadge.title = 'Nhấp đúp vào file start-server.bat để khởi chạy server Full-stack (FastAPI + SQLite + ElevenLabs)!';
    }
    lucide.createIcons();
  }

  async syncWithServer() {
    try {
      const resDecks = await fetch(`${this._serverBaseUrl}/api/decks`, { mode: 'cors' });
      if (!resDecks.ok) return;
      const decks = await resDecks.json();
      if (!decks || decks.length === 0) return;

      // Lấy thẻ cho từng bộ từ vựng
      for (const d of decks) {
        const resCards = await fetch(`${this._serverBaseUrl}/api/cards?deck_id=${encodeURIComponent(d.id)}`, { mode: 'cors' });
        if (resCards.ok) {
          d.cards = await resCards.json();
        } else {
          d.cards = [];
        }
      }

      this.decks = decks;
      this.saveData(); // Lưu dự phòng vào LocalStorage
      
      if (!this.decks.some(d => d.id === this.currentDeckId)) {
        this.currentDeckId = this.decks[0].id;
      }
      this.populateDeckSelectors();
      this.render();
      console.log('[FlashLearn] Đã đồng bộ thành công CSDL SQLite:', this.decks.length, 'bộ thẻ');
    } catch (e) {
      console.warn('[FlashLearn] Lỗi khi đồng bộ CSDL từ server:', e);
    }
  }

  showServerInfo() {
    if (window.location.hostname.includes('github.io')) {
      this.showToast('🌐 Ứng dụng đang hoạt động trực tuyến trên GitHub Pages! Dữ liệu được lưu trên trình duyệt của bạn.');
    } else if (this._isServerOnline) {
      this.showToast('🚀 Server Full-stack (FastAPI) & CSDL SQLite (flashcards.db) đang kết nối! Giọng đọc ElevenLabs AI đa ngôn ngữ & lưu cache.');
    } else {
      this.showToast('💡 Hãy nhấp đúp file start-server.bat (hoặc chạy "py server.py") để kích hoạt server FastAPI + SQLite + ElevenLabs!');
    }
  }

  stopAudio() {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
      } catch (e) {}
      this._currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.stopAudioAnimation();
  }

  startAudioAnimation() {
    if (this.btnPlaySound) this.btnPlaySound.classList.add('playing-audio');
    if (this.btnWordSpeak) this.btnWordSpeak.classList.add('playing-audio');
    if (this.btnBackPlaySound) this.btnBackPlaySound.classList.add('playing-audio');
    if (this.btnMeaningSpeak) this.btnMeaningSpeak.classList.add('playing-audio');
  }

  stopAudioAnimation() {
    if (this.btnPlaySound) this.btnPlaySound.classList.remove('playing-audio');
    if (this.btnWordSpeak) this.btnWordSpeak.classList.remove('playing-audio');
    if (this.btnBackPlaySound) this.btnBackPlaySound.classList.remove('playing-audio');
    if (this.btnMeaningSpeak) this.btnMeaningSpeak.classList.remove('playing-audio');
  }

  playAudioUrl(url, onError = null) {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
      } catch (e) {}
      this._currentAudio = null;
    }

    const audio = new Audio();
    audio.referrerPolicy = 'no-referrer';
    audio.src = url;
    this._currentAudio = audio;

    this.startAudioAnimation();

    audio.onended = () => {
      this.stopAudioAnimation();
    };
    audio.onerror = (e) => {
      console.warn('[FlashLearn] Audio play error:', e);
      this.stopAudioAnimation();
      if (typeof onError === 'function') onError(e);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[FlashLearn] Audio play promise rejected:', err);
        this.stopAudioAnimation();
        if (typeof onError === 'function') onError(err);
      });
    }
  }

  // ==================== MULTI-TIER AUDIO PLAYER ====================
  // Tier 1: FastAPI POST /api/tts (ElevenLabs AI Multilingual + audio_cache MD5)
  // Tier 2: Online Stream Fallback (Youdao / Google TTS)
  // Tier 3: Web Speech Synthesis (offline browser fallback)
  async playAudio(rawText, explicitLang = null) {
    if (!rawText) return;

    // Tự động nhận diện ngôn ngữ văn bản: ja-JP (Nhật), vi-VN (Việt), en-US (Anh)
    const targetLang = explicitLang || this.detectLanguage(rawText);
    const clean = this.cleanTextForSpeech(rawText, targetLang);
    const textToSpeak = clean || rawText;

    const langLabels = {
      'ja-JP': 'Tiếng Nhật 🇯🇵',
      'vi-VN': 'Tiếng Việt 🇻🇳',
      'en-US': 'Tiếng Anh 🇬🇧'
    };
    const langLabel = langLabels[targetLang] || 'Đa ngôn ngữ 🌐';

    // Dừng âm thanh đang phát trước đó
    this.stopAudio();

    const cacheKey = `${textToSpeak.toLowerCase().trim()}:${targetLang}`;

    // 1. Kiểm tra cache trong bộ nhớ RAM trình duyệt
    if (this._audioCache && this._audioCache.has(cacheKey)) {
      this.showToast(`🔊 ${langLabel} ⚡ [Audio Cache]`);
      const cachedUrl = this._audioCache.get(cacheKey);
      this.playAudioUrl(cachedUrl, () => {
        this.fallbackOnlineOrSpeech(textToSpeak, targetLang);
      });
      return;
    }

    this.showToast(`🎙️ Đang phát âm (${langLabel})...`);

    // 2. GỌI API POST /api/tts CỦA SERVER (ELEVENLABS + AUDIO_CACHE)
    let serverSucceeded = false;
    if (this._isServerOnline) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(`${this._serverBaseUrl}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            lang: targetLang
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const isCacheHit = response.headers.get('X-Cache') === 'HIT';
          const source = response.headers.get('X-Source') || 'ElevenLabs';
          this.showToast(isCacheHit ? `🔊 ${langLabel} ⚡ [Audio Cache]` : `✨ ${langLabel} 🎙️ [${source} AI]`);
          const audioBlob = await response.blob();
          const objectUrl = URL.createObjectURL(audioBlob);
          this._audioCache.set(cacheKey, objectUrl);
          this.playAudioUrl(objectUrl, () => {
            this.fallbackOnlineOrSpeech(textToSpeak, targetLang);
          });
          serverSucceeded = true;
          return;
        }
      } catch (err) {
        console.warn('[FlashLearn] Server /api/tts lỗi, chuyển sang luồng dự phòng:', err);
      }
    }

    // 3. FALLBACK BẮT BUỘC: NẾU GỌI /api/tts BỊ LỖI HOẶC CHƯA BẬT SERVER
    if (!serverSucceeded) {
      this.fallbackOnlineOrSpeech(textToSpeak, targetLang);
    }
  }

  fallbackOnlineOrSpeech(text, lang) {
    let onlineUrl = '';
    if (lang === 'ja-JP') {
      onlineUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    } else if (lang === 'vi-VN') {
      onlineUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(text)}`;
    } else if (lang === 'en-US') {
      onlineUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
    }

    if (onlineUrl) {
      this.playAudioUrl(onlineUrl, () => {
        this.fallbackWebSpeech(text, lang);
      });
    } else {
      this.fallbackWebSpeech(text, lang);
    }
  }

  fallbackWebSpeech(text, lang) {
    if (!('speechSynthesis' in window)) {
      this.showToast('⚠️ Trình duyệt của bạn không hỗ trợ Web Speech Synthesis');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = lang.startsWith('ja') ? 0.95 : 0.9;

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang.split('-')[0].toLowerCase();
      const voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase())
        || voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));

      if (voice) {
        utterance.voice = voice;
      }

      this.startAudioAnimation();
      utterance.onend = () => this.stopAudioAnimation();
      utterance.onerror = () => this.stopAudioAnimation();

      window.speechSynthesis.speak(utterance);
      this.showToast(`🗣️ Đang phát âm (Web Speech: ${lang})...`);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      this.stopAudioAnimation();
    }
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
    this.checkAndAutoPlay();
  }

  resetDeckProgress() {
    const deck = this.getCurrentDeck();
    if (!deck) return;

    if (confirm(`Bạn có chắc muốn đặt lại trạng thái học của bộ thẻ "${deck.name}" về ban đầu?`)) {
      deck.cards.forEach(c => c.mastered = false);
      this.resetFlipWithoutAnimation();
      this.currentCardIndex = 0;
      this.saveData();

      if (this._isServerOnline) {
        fetch(`${this._serverBaseUrl}/api/decks/${encodeURIComponent(deck.id)}/reset`, {
          method: 'POST'
        }).catch(err => console.warn('[FlashLearn] Lỗi đặt lại tiến trình trên SQLite:', err));
      }

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
    "meaning": "Có tài hùng biện, ăn nói lưu loát và đầy sức thuyết phục",
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

  insertSampleChinese() {
    const sample = `[
  {
    "word": "你好",
    "phonetic": "nǐ hǎo",
    "pos": "thán từ",
    "meaning": "Xin chào (lời chào cơ bản, thân thiện)",
    "example": "你好！很高兴认识你。",
    "exampleMeaning": "Xin chào! Rất vui được gặp bạn."
  },
  {
    "word": "学习",
    "phonetic": "xuéxí",
    "pos": "động từ",
    "meaning": "Học tập, tiếp thu kiến thức",
    "example": "他每天都在努力学习中文。",
    "exampleMeaning": "Cậu ấy mỗi ngày đều chăm chỉ học tiếng Trung."
  },
  {
    "word": "朋友",
    "phonetic": "péngyou",
    "pos": "danh từ",
    "meaning": "Bạn bè, bạn thân thiết",
    "example": "他们是从小一起长大的好朋友。",
    "exampleMeaning": "Họ là những người bạn tốt lớn lên cùng nhau từ nhỏ."
  },
  {
    "word": "谢谢",
    "phonetic": "xièxie",
    "pos": "động từ",
    "meaning": "Cảm ơn, bày tỏ sự biết ơn",
    "example": "非常感谢你的热情关照！",
    "exampleMeaning": "Vô cùng cảm ơn sự quan tâm nhiệt tình của bạn!"
  }
]`;
    this.aiCodeInput.value = sample;
    this.showToast('Đã dán mẫu code Tiếng Trung 🇨🇳!');
  }

  setPromptTemplate(lang) {
    const activeClass = 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm';
    const inactiveClass = 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1';

    if (this.btnPromptLangEn) this.btnPromptLangEn.className = inactiveClass;
    if (this.btnPromptLangJp) this.btnPromptLangJp.className = inactiveClass;
    if (this.btnPromptLangZh) this.btnPromptLangZh.className = inactiveClass;

    if (lang === 'zh') {
      if (this.btnPromptLangZh) this.btnPromptLangZh.className = activeClass;
      this.promptTitleLabel.textContent = 'Mẫu Prompt Tiếng Trung (HSK / Giao tiếp):';
      this.samplePromptText.textContent = `Hãy tạo cho tôi danh sách 15 từ vựng tiếng Trung chủ đề [CHỦ ĐỀ BẠN MUỐN, VD: HSK 1-4 / Giao tiếp du lịch / Ăn uống] dưới định dạng JSON sau:
[
  {
    "word": "Chữ Hán (Ví dụ: 你好)",
    "phonetic": "Phiên âm Pinyin kèm dấu (ví dụ: nǐ hǎo)",
    "pos": "từ loại (danh từ, động từ, tính từ...)",
    "meaning": "nghĩa tiếng Việt ngắn gọn, dễ nhớ",
    "example": "Câu ví dụ tiếng Trung tự nhiên",
    "exampleMeaning": "Dịch nghĩa câu ví dụ sang tiếng Việt"
  }
]
Chỉ xuất duy nhất khối JSON, không kèm lời dẫn.`;
    } else if (lang === 'jp') {
      if (this.btnPromptLangJp) this.btnPromptLangJp.className = activeClass;
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
      if (this.btnPromptLangEn) this.btnPromptLangEn.className = activeClass;
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

      if (this._isServerOnline) {
        fetch(`${this._serverBaseUrl}/api/decks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetDeck.id,
            name: targetDeck.name,
            lang: targetDeck.lang
          })
        }).catch(err => console.warn('[FlashLearn] Lỗi lưu deck lên server:', err));
      }
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

    // Lưu thẳng vào cơ sở dữ liệu SQLite qua API
    if (this._isServerOnline) {
      fetch(`${this._serverBaseUrl}/api/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deck_id: targetDeck.id,
          cards: newCards
        })
      }).then(res => res.json())
        .then(data => console.log('[FlashLearn] Đã lưu thẻ vào SQLite:', data))
        .catch(err => console.warn('[FlashLearn] Lỗi lưu thẻ lên SQLite:', err));
    }

    // Reset inputs
    this.aiCodeInput.value = '';
    this.parsedPdfCards = [];
    this.pdfPreviewSection.classList.add('hidden');
    this.pdfFileInput.value = '';

    this.showToast(`🎉 Đã thêm thành công ${newCards.length} từ vựng vào "${targetDeck.name}"!`);
    this.checkAndAutoPlay();
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

    const lang = this.newDeckLangSelect.value || 'ja-JP';

    const newDeck = {
      id: 'deck-' + Date.now(),
      name: name,
      lang: lang,
      createdAt: Date.now(),
      cards: []
    };

    if (this._isServerOnline) {
      fetch(`${this._serverBaseUrl}/api/decks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newDeck.id,
          name: newDeck.name,
          lang: newDeck.lang
        })
      }).catch(err => console.warn('[FlashLearn] Lỗi lưu deck lên SQLite:', err));
    }

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
    this.checkAndAutoPlay();
  }

  selectDeckFromModal(deckId) {
    this.currentDeckId = deckId;
    this.resetFlipWithoutAnimation();
    this.currentCardIndex = 0;
    this.populateDeckSelectors();
    this.render();
    this.closeDeckModal();
    this.checkAndAutoPlay();
  }

  deleteDeck(deckId) {
    const deck = this.decks.find(d => d.id === deckId);
    if (!deck) return;

    if (confirm(`Bạn có chắc muốn xóa bộ từ vựng "${deck.name}" và toàn bộ ${deck.cards.length} thẻ không?`)) {
      if (this._isServerOnline) {
        fetch(`${this._serverBaseUrl}/api/decks/${encodeURIComponent(deckId)}`, {
          method: 'DELETE'
        }).catch(err => console.warn('[FlashLearn] Lỗi xóa deck trên SQLite:', err));
      }

      this.decks = this.decks.filter(d => d.id !== deckId);
      if (this.currentDeckId === deckId) {
        this.currentDeckId = this.decks.length > 0 ? this.decks[0].id : null;
        this.resetFlipWithoutAnimation();
        this.currentCardIndex = 0;
      }
      this.saveData();
      this.populateDeckSelectors();
      this.renderDeckListModal();
      this.render();
      this.showToast('Đã xóa bộ thẻ!');
      this.checkAndAutoPlay();
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
      this.checkAndAutoPlay();
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
    // Card flip click - flips when clicking card background or text, but not action buttons
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

    // Auto Play Toggle Button
    this.btnToggleAutoPlay.addEventListener('click', () => this.toggleAutoPlay());

    // Audio Buttons (Front word, Word speak, Back word, Example sentence)
    if (this.btnWordSpeak) {
      this.btnWordSpeak.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const card = this.getCurrentCard();
        if (card) this.playAudio(card.word);
      });
    }

    this.btnPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = this.getCurrentCard();
      if (card) this.playAudio(card.word);
    });

    this.btnBackPlaySound.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = this.getCurrentCard();
      if (card) this.playAudio(card.word);
    });

    if (this.btnMeaningSpeak) {
      this.btnMeaningSpeak.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const card = this.getCurrentCard();
        if (card && card.meaning) this.playAudio(card.meaning);
      });
    }

    this.btnPlayExampleSound.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = this.getCurrentCard();
      if (card && card.example) this.playAudio(card.example);
    });

    if (this.elevenLabsStatusBadge) {
      this.elevenLabsStatusBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showServerInfo();
      });
    }

    // Deck select change
    this.deckSelect.addEventListener('change', (e) => {
      this.currentDeckId = e.target.value;
      this.resetFlipWithoutAnimation();
      this.currentCardIndex = 0;
      this.render();
      this.checkAndAutoPlay();
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

    if (this.btnInsertSampleEnglish) this.btnInsertSampleEnglish.addEventListener('click', () => this.insertSampleEnglish());
    if (this.btnInsertSampleJapanese) this.btnInsertSampleJapanese.addEventListener('click', () => this.insertSampleJapanese());
    if (this.btnInsertSampleChinese) this.btnInsertSampleChinese.addEventListener('click', () => this.insertSampleChinese());

    if (this.btnPromptLangEn) this.btnPromptLangEn.addEventListener('click', () => this.setPromptTemplate('en'));
    if (this.btnPromptLangJp) this.btnPromptLangJp.addEventListener('click', () => this.setPromptTemplate('jp'));
    if (this.btnPromptLangZh) this.btnPromptLangZh.addEventListener('click', () => this.setPromptTemplate('zh'));
    if (this.btnCopyPrompt) this.btnCopyPrompt.addEventListener('click', () => this.copyPromptText());

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
        if (card) this.playAudio(card.word);
      } else if (e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.toggleAutoPlay();
      }
    });
  }
}

// Khởi chạy ứng dụng an toàn (xử lý cả trường hợp DOM đã sẵn sàng trước khi script nạp xong)
let app;
function initFlashLearnApp() {
  if (!app) {
    app = new FlashLearnApp();
    window.app = app;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlashLearnApp);
} else {
  initFlashLearnApp();
}

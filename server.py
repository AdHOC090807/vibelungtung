#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FlashLearn Full-stack Japanese Flashcards Server
================================================
- Thống nhất Backend duy nhất sử dụng FastAPI + Uvicorn
- Phục vụ trực tiếp giao diện Web & toàn bộ API trên cùng một cổng (http://localhost:8000)
- Cơ sở dữ liệu SQLite vĩnh viễn (flashcards.db) cho Decks & Cards
- Giọng đọc AI tự nhiên chất lượng cao qua Edge-TTS (ja-JP-NanamiNeural cho tiếng Nhật, en-US-JennyNeural cho tiếng Anh)
  kết hợp ElevenLabs dự phòng và bộ nhớ đệm audio_cache
"""

import os
import sys
import json
import re
import hashlib
import sqlite3
import asyncio
from typing import Optional, List, Union, Dict, Any
from contextlib import asynccontextmanager

# Windows terminal UTF-8 encoding fix
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

import uvicorn
from fastapi import FastAPI, HTTPException, Request, Response, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import edge_tts

# ==================== CẤU HÌNH ĐƯỜNG DẪN & THƯ MỤC ====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(BASE_DIR, 'audio_cache')
DB_PATH = os.path.join(BASE_DIR, 'flashcards.db')
ENV_FILE = os.path.join(BASE_DIR, '.env')

os.makedirs(CACHE_DIR, exist_ok=True)

# Đọc file .env
def load_env(env_path):
    config = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip().strip('"').strip("'")
    return config

ENV = load_env(ENV_FILE)
PORT = int(os.environ.get('PORT') or ENV.get('PORT', 8000))
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY') or ENV.get('ELEVENLABS_API_KEY', '')
ELEVENLABS_VOICE_ID = os.environ.get('ELEVENLABS_VOICE_ID') or ENV.get('ELEVENLABS_VOICE_ID', 'Xb7hH8MSUJpSbSDYk0k2')
ELEVENLABS_MODEL_ID = os.environ.get('ELEVENLABS_MODEL_ID') or ENV.get('ELEVENLABS_MODEL_ID', 'eleven_flash_v2_5')

# ==================== DATABASE SQLITE (flashcards.db) ====================
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Khởi tạo cấu trúc bảng SQLite và nạp dữ liệu mẫu tiếng Nhật JLPT N5 nếu DB trống"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Bảng Decks (Bộ từ)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decks (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                lang TEXT DEFAULT 'ja-JP',
                created_at INTEGER NOT NULL
            )
        """)
        
        # Bảng Cards (Thẻ từ vựng)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cards (
                id TEXT PRIMARY KEY,
                deck_id TEXT NOT NULL,
                word TEXT NOT NULL,
                phonetic TEXT DEFAULT '',
                pos TEXT DEFAULT '',
                meaning TEXT NOT NULL,
                example TEXT DEFAULT '',
                example_meaning TEXT DEFAULT '',
                mastered INTEGER DEFAULT 0,
                starred INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id)")
        
        # Kiểm tra xem có dữ liệu chưa
        cursor.execute("SELECT COUNT(*) FROM decks")
        count = cursor.fetchone()[0]
        
        if count == 0:
            print("[DATABASE 📦] Đang khởi tạo dữ liệu mẫu JLPT N5 tiếng Nhật chuẩn vào flashcards.db...")
            now = 1729300000000
            
            # 1. Bộ Tiếng Nhật JLPT N5 mẫu
            cursor.execute("""
                INSERT INTO decks (id, name, lang, created_at)
                VALUES (?, ?, ?, ?)
            """, ('deck-japanese-n5', '🇯🇵 Tiếng Nhật JLPT N5 - Nhập Môn & Thông Dụng', 'ja-JP', now))
            
            sample_n5_cards = [
                ('jp1', 'deck-japanese-n5', '桜 (さくら)', 'sakura', 'danh từ', 'Hoa anh đào - biểu tượng mùa xuân của xứ sở mặt trời mọc', '春になると、桜の花がとても綺麗に咲きます。', 'Khi mùa xuân đến, hoa anh đào nở rất đẹp.', 0, 1, now + 1),
                ('jp2', 'deck-japanese-n5', '食べる (たべる)', 'taberu', 'động từ nhóm 2', 'Ăn (dùng bữa, ăn uống hàng ngày)', '毎日朝ごはんをちゃんと食べます。', 'Mỗi ngày tôi đều ăn sáng đầy đủ.', 0, 0, now + 2),
                ('jp3', 'deck-japanese-n5', '勉強 (べんきょう)', 'benkyou', 'danh từ / động từ', 'Học tập, việc rèn luyện tri thức', '日本語の勉強はとても面白いです。', 'Việc học tiếng Nhật rất thú vị.', 1, 0, now + 3),
                ('jp4', 'deck-japanese-n5', '素晴らしい (すばらしい)', 'subarashii', 'tính từ đuôi い', 'Tuyệt vời, xuất sắc, tráng lệ', '富士山の景色は本当に素晴らしいですね。', 'Phong cảnh núi Phú Sĩ thật sự rất tuyệt vời.', 0, 1, now + 4),
                ('jp5', 'deck-japanese-n5', '感謝 (かんしゃ)', 'kansha', 'danh từ / động từ', 'Biết ơn, lòng cảm tạ sâu sắc', 'いつも助けてくれて心から感謝しています。', 'Tôi luôn ghi lòng biết ơn bạn vì đã luôn giúp đỡ tôi.', 0, 0, now + 5),
                ('jp6', 'deck-japanese-n5', '一期一会 (いちごいちえ)', 'ichigo ichie', 'thành ngữ', 'Nhất kỳ nhất hội (mỗi cuộc gặp gỡ trong đời chỉ có một lần, hãy trân trọng)', '人との出会いを一期一会として大切にしたい。', 'Tôi muốn trân trọng từng cuộc gặp gỡ như một duyên lành chỉ có một lần trong đời.', 0, 1, now + 6),
                ('jp7', 'deck-japanese-n5', '友達 (ともだち)', 'tomodachi', 'danh từ', 'Bạn bè, người bạn đồng hành', '週末に友達と一緒に映画を見に行きます。', 'Cuối tuần tôi đi xem phim cùng với bạn bè.', 0, 0, now + 7),
                ('jp8', 'deck-japanese-n5', '約束 (やくそく)', 'yakusoku', 'danh từ / động từ', 'Lời hứa, cuộc hẹn ước', 'どんなことがあっても、約束を守ります。', 'Dù có chuyện gì xảy ra, tôi cũng sẽ giữ trọn lời hứa.', 0, 1, now + 8),
                ('jp9', 'deck-japanese-n5', '先生 (せんせい)', 'sensei', 'danh từ', 'Thầy giáo, cô giáo, bác sĩ', '先生、いつも熱心に教えてくださりありがとうございます。', 'Thưa thầy cô, cảm ơn thầy cô đã luôn nhiệt tình chỉ dạy chúng em.', 0, 0, now + 9),
                ('jp10', 'deck-japanese-n5', '家族 (かぞく)', 'kazoku', 'danh từ', 'Gia đình, những người thân yêu nhất', '私にとって家族が一番大切な存在です。', 'Đối với tôi, gia đình là điều quan trọng và quý giá nhất.', 0, 1, now + 10),
                ('jp11', 'deck-japanese-n5', '行く (いく)', 'iku', 'động từ nhóm 1', 'Đi (di chuyển từ nơi này sang nơi khác)', '来週、友達と日本へ旅行に行きます。', 'Tuần sau tôi sẽ đi du lịch Nhật Bản cùng bạn bè.', 0, 0, now + 11),
                ('jp12', 'deck-japanese-n5', '毎日 (まいにち)', 'mainichi', 'phó từ / danh từ', 'Mỗi ngày, hàng ngày', '毎日日本語の単語を10個覚えるようにしています。', 'Mỗi ngày tôi đều cố gắng học thuộc 10 từ vựng tiếng Nhật.', 0, 0, now + 12)
            ]
            
            cursor.executemany("""
                INSERT INTO cards (id, deck_id, word, phonetic, pos, meaning, example, example_meaning, mastered, starred, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_n5_cards)
            
            # 2. Bộ Tiếng Anh IELTS mẫu
            cursor.execute("""
                INSERT INTO decks (id, name, lang, created_at)
                VALUES (?, ?, ?, ?)
            """, ('deck-ielts-core', '🇬🇧 Từ vựng IELTS & Giao tiếp Cốt Lõi', 'en-US', now + 100))
            
            sample_en_cards = [
                ('c1', 'deck-ielts-core', 'resilient', '/rɪˈzɪliənt/', 'adjective', 'Kiên cường, có khả năng phục hồi nhanh sau khó khăn', 'Local businesses have proven to be remarkably resilient during the crisis.', 'Các doanh nghiệp địa phương đã chứng tỏ sự kiên cường đáng kể trong cuộc khủng hoảng.', 0, 1, now + 101),
                ('c2', 'deck-ielts-core', 'ambiguous', '/æmˈbɪɡjuəs/', 'adjective', 'Mơ hồ, có thể hiểu theo nhiều nghĩa khác nhau, không rõ ràng', 'The wording of the agreement is ambiguous and open to interpretation.', 'Cách diễn đạt của bản thỏa thuận còn mơ hồ và có thể được hiểu theo nhiều hướng.', 0, 0, now + 102),
                ('c3', 'deck-ielts-core', 'comprehend', '/ˌkɑːmprɪˈhend/', 'verb', 'Hiểu thấu đáo, lĩnh hội một vấn đề phức tạp', 'She found it hard to comprehend how much the technology had advanced.', 'Cô ấy cảm thấy khó có thể lĩnh hội được công nghệ đã tiến bộ đến mức nào.', 0, 0, now + 103),
                ('c4', 'deck-ielts-core', 'ubiquitous', '/juːˈbɪkwɪtəs/', 'adjective', 'Có mặt ở khắp mọi nơi, rất phổ biến', 'Smartphones have become ubiquitous in modern society.', 'Điện thoại thông minh đã trở nên phổ biến ở khắp mọi nơi trong xã hội hiện đại.', 1, 0, now + 104),
                ('c5', 'deck-ielts-core', 'meticulous', '/məˈtɪkjələs/', 'adjective', 'Tỉ mỉ, cẩn thận, chăm chút từng li từng tí', 'He is meticulous about keeping his records up to date.', 'Anh ấy rất tỉ mỉ trong việc cập nhật hồ sơ của mình thường xuyên.', 0, 0, now + 105)
            ]
            
            cursor.executemany("""
                INSERT INTO cards (id, deck_id, word, phonetic, pos, meaning, example, example_meaning, mastered, starred, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_en_cards)
            
            # 3. Bộ Tiếng Trung HSK mẫu
            cursor.execute("""
                INSERT INTO decks (id, name, lang, created_at)
                VALUES (?, ?, ?, ?)
            """, ('deck-chinese-hsk', '🇨🇳 Tiếng Trung HSK & Giao Tiếp', 'zh-CN', now + 200))
            
            sample_zh_cards = [
                ('zh1', 'deck-chinese-hsk', '你好', 'nǐ hǎo', 'thán từ / chào hỏi', 'Xin chào (lời chào thân thiện, lịch sự)', '你好！很高兴认识你。', 'Xin chào! Rất vui được làm quen với bạn.', 0, 1, now + 201),
                ('zh2', 'deck-chinese-hsk', '谢谢', 'xièxie', 'động từ / cảm ơn', 'Cảm ơn, cảm tạ sự giúp đỡ', '非常感谢你的热情帮助！', 'Vô cùng cảm ơn sự giúp đỡ nhiệt tình của bạn!', 0, 0, now + 202),
                ('zh3', 'deck-chinese-hsk', '学习', 'xuéxí', 'động từ / danh từ', 'Học tập, tiếp thu tri thức mới', '每天努力学习中文，进步很快。', 'Mỗi ngày chăm chỉ học tiếng Trung, tiến bộ rất nhanh.', 1, 0, now + 203),
                ('zh4', 'deck-chinese-hsk', '朋友', 'péngyou', 'danh từ', 'Bạn bè, bạn hữu tri kỷ', '海内存知己，天涯若比邻。', 'Trong bốn bể có tri kỷ, thì chân trời cũng gần gũi như hàng xóm.', 0, 1, now + 204),
                ('zh5', 'deck-chinese-hsk', '世界', 'shìjiè', 'danh từ', 'Thế giới, vũ trụ bao la', '世界很大，我想去看看。', 'Thế giới rất rộng lớn, tôi muốn đi ngắm nhìn.', 0, 0, now + 205),
                ('zh6', 'deck-chinese-hsk', '再见', 'zàijiàn', 'từ chào tạm biệt', 'Tạm biệt (hẹn ngày gặp lại)', '明天见，路上小心，再见！', 'Ngày mai gặp lại nhé, đi đường cẩn thận, tạm biệt!', 0, 0, now + 206)
            ]
            
            cursor.executemany("""
                INSERT INTO cards (id, deck_id, word, phonetic, pos, meaning, example, example_meaning, mastered, starred, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_zh_cards)
            
            conn.commit()
            print("[DATABASE ✅] Đã nạp thành công các bộ thẻ mẫu vào SQLite!")

# ==================== VOICE & TTS LOGIC ====================
EDGE_VOICES = {
    'ja': 'ja-JP-NanamiNeural',    # Giọng nữ tiếng Nhật tự nhiên, trong trẻo
    'ja-JP': 'ja-JP-NanamiNeural',
    'en': 'en-US-JennyNeural',     # Giọng nữ tiếng Anh chuẩn
    'en-US': 'en-US-JennyNeural',
    'zh': 'zh-CN-XiaoxiaoNeural',   # Giọng nữ tiếng Trung phổ thông
    'zh-CN': 'zh-CN-XiaoxiaoNeural',
    'ko': 'ko-KR-SunHiNeural',      # Giọng nữ tiếng Hàn
    'ko-KR': 'ko-KR-SunHiNeural'
}

def detect_language(text: str, default_lang: str = 'ja-JP') -> str:
    """Tự động phát hiện ngôn ngữ nếu không được chỉ định"""
    if not text:
        return default_lang
    # Chứa Kana tiếng Nhật -> ja-JP
    if re.search(r'[\u3040-\u309F\u30A0-\u30FF]', text):
        return 'ja-JP'
    # Chứa ký tự Hangul tiếng Hàn -> ko-KR
    if re.search(r'[\uAC00-\uD7AF\u1100-\u11FF]', text):
        return 'ko-KR'
    # Chứa chữ Hán (CJK) mà không có Kana:
    if re.search(r'[\u4E00-\u9FFF]', text):
        if default_lang.startswith('zh'):
            return 'zh-CN'
        return 'ja-JP' # Mặc định cho app học tiếng Nhật
    # Chữ Latinh
    if re.search(r'[a-zA-Z]', text):
        return 'en-US'
    return default_lang

def clean_text_for_speech(text: str, lang: str) -> str:
    """Làm sạch chuỗi trước khi chuyển thành giọng nói"""
    if not text:
        return ""
    # Nếu là tiếng Nhật và có Furigana trong ngoặc ví dụ "桜 (さくら)" -> Đọc "さくら"
    if lang.startswith("ja"):
        m = re.search(r"\(([\u3040-\u309F\u30A0-\u30FF\s]+)\)", text)
        if m:
            return m.group(1).strip()
    
    # Bỏ chú thích ngoặc đơn/vuông/gạch chéo
    cleaned = re.sub(r"\(.*?\)|\[.*?\]|\/.*?\/", " ", text)
    cleaned = re.sub(r"[\(\)\[\]\/]", " ", cleaned).strip()
    return cleaned or text

def get_cache_filename(text: str, voice: str) -> str:
    clean = re.sub(r'[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+', '_', text.strip().lower())
    slug = clean[:25].strip('_') or 'speech'
    key = f"{text.strip().lower()}:{voice}".encode('utf-8')
    h = hashlib.md5(key).hexdigest()[:12]
    return f"{slug}_{h}.mp3"

async def generate_edge_tts(text: str, voice: str, filepath: str):
    """Sinh file mp3 bằng Microsoft Edge TTS (miễn phí, chất lượng phòng thu)"""
    comm = edge_tts.Communicate(text, voice)
    await comm.save(filepath)

async def generate_elevenlabs_tts(text: str, filepath: str):
    """Dự phòng ElevenLabs nếu có API key trong .env"""
    if not ELEVENLABS_API_KEY:
        raise ValueError("Chưa cấu hình ELEVENLABS_API_KEY")
    import urllib.request
    api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "FlashLearn-Fullstack/1.0"
    }
    payload = {
        "text": text,
        "model_id": ELEVENLABS_MODEL_ID,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
    }
    req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    loop = asyncio.get_event_loop()
    def _fetch():
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.read()
    data = await loop.run_in_executor(None, _fetch)
    with open(filepath, 'wb') as f:
        f.write(data)

# ==================== PYDANTIC MODELS ====================
class DeckCreate(BaseModel):
    id: Optional[str] = None
    name: str
    lang: Optional[str] = 'ja-JP'

class CardCreate(BaseModel):
    id: Optional[str] = None
    deck_id: Optional[str] = None
    word: str
    phonetic: Optional[str] = ''
    pos: Optional[str] = ''
    meaning: str
    example: Optional[str] = ''
    exampleMeaning: Optional[str] = ''
    example_meaning: Optional[str] = ''
    mastered: Optional[bool] = False
    starred: Optional[bool] = False

class BatchCardsCreate(BaseModel):
    deck_id: str
    cards: List[Dict[str, Any]]

class CardUpdate(BaseModel):
    word: Optional[str] = None
    phonetic: Optional[str] = None
    pos: Optional[str] = None
    meaning: Optional[str] = None
    example: Optional[str] = None
    exampleMeaning: Optional[str] = None
    example_meaning: Optional[str] = None
    mastered: Optional[bool] = None
    starred: Optional[bool] = None

class TtsRequest(BaseModel):
    text: str
    lang: Optional[str] = None
    voice: Optional[str] = None

# ==================== KHỞI TẠO FASTAPI APP ====================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo DB khi bật server
    init_db()
    yield

app = FastAPI(
    title="FlashLearn Japanese Flashcard Server",
    description="Full-stack Flashcards Server with SQLite & Edge-TTS",
    version="3.0.0",
    lifespan=lifespan
)

# Cho phép CORS toàn diện (ngăn chặn mọi lỗi lệch nguồn / origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Cache", "Content-Length", "Content-Range"]
)

# ==================== API ENDPOINTS ====================

@app.get("/api/status")
async def get_status():
    """Kiểm tra trạng thái server, cấu hình TTS và dữ liệu SQLite"""
    cached_files = [f for f in os.listdir(CACHE_DIR) if f.endswith('.mp3')]
    total_cache_size = sum(os.path.getsize(os.path.join(CACHE_DIR, f)) for f in cached_files)
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM decks")
        decks_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM cards")
        cards_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM cards WHERE mastered = 1")
        mastered_count = cursor.fetchone()[0]

    return {
        "status": "online",
        "app_name": "FlashLearn Full-stack",
        "port": PORT,
        "database": "SQLite (flashcards.db)",
        "decks_count": decks_count,
        "cards_count": cards_count,
        "mastered_count": mastered_count,
        "tts_default_voice_ja": EDGE_VOICES['ja-JP'],
        "tts_default_voice_en": EDGE_VOICES['en-US'],
        "edge_tts_available": True,
        "elevenlabs_available": bool(ELEVENLABS_API_KEY and not ELEVENLABS_API_KEY.startswith('your_')),
        "cache_count": len(cached_files),
        "cache_size_mb": round(total_cache_size / (1024 * 1024), 2)
    }

# ---------- DECKS APIs ----------
@app.get("/api/decks")
async def list_decks():
    """Lấy danh sách tất cả các bộ từ kèm số lượng thẻ"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.id, d.name, d.lang, d.created_at,
                   COUNT(c.id) as card_count,
                   SUM(CASE WHEN c.mastered = 1 THEN 1 ELSE 0 END) as mastered_count
            FROM decks d
            LEFT JOIN cards c ON d.id = c.deck_id
            GROUP BY d.id
            ORDER BY d.created_at ASC
        """)
        rows = cursor.fetchall()
        
        decks = []
        for r in rows:
            decks.append({
                "id": r["id"],
                "name": r["name"],
                "lang": r["lang"] or "ja-JP",
                "createdAt": r["created_at"],
                "totalCards": r["card_count"],
                "masteredCount": r["mastered_count"] or 0
            })
        return decks

@app.post("/api/decks")
async def create_deck(deck: DeckCreate):
    """Tạo bộ từ vựng mới"""
    deck_id = deck.id or f"deck-{int(asyncio.get_event_loop().time() * 1000)}"
    now = int(asyncio.get_event_loop().time() * 1000)
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO decks (id, name, lang, created_at)
            VALUES (?, ?, ?, ?)
        """, (deck_id, deck.name, deck.lang or 'ja-JP', now))
        conn.commit()
    
    return {"id": deck_id, "name": deck.name, "lang": deck.lang, "createdAt": now}

@app.delete("/api/decks/{deck_id}")
async def delete_deck(deck_id: str):
    """Xóa bộ từ và các thẻ liên quan (Cascade)"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM decks WHERE id = ?", (deck_id,))
        deleted = cursor.rowcount
        conn.commit()
    
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy bộ từ vựng cần xóa")
    return {"success": True, "deleted_deck_id": deck_id}

@app.post("/api/decks/{deck_id}/reset")
async def reset_deck_progress(deck_id: str):
    """Đặt lại trạng thái học (mastered = 0) cho toàn bộ thẻ trong bộ"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE cards SET mastered = 0 WHERE deck_id = ?", (deck_id,))
        conn.commit()
    return {"success": True, "deck_id": deck_id}

# ---------- CARDS APIs ----------
@app.get("/api/cards")
async def list_cards(deck_id: Optional[str] = Query(None)):
    """Lấy danh sách thẻ từ vựng (lọc theo deck_id nếu có)"""
    with get_db() as conn:
        cursor = conn.cursor()
        if deck_id:
            cursor.execute("SELECT * FROM cards WHERE deck_id = ? ORDER BY created_at ASC", (deck_id,))
        else:
            cursor.execute("SELECT * FROM cards ORDER BY created_at ASC")
        rows = cursor.fetchall()
        
        cards = []
        for r in rows:
            cards.append({
                "id": r["id"],
                "deckId": r["deck_id"],
                "word": r["word"],
                "phonetic": r["phonetic"],
                "pos": r["pos"],
                "meaning": r["meaning"],
                "example": r["example"],
                "exampleMeaning": r["example_meaning"],
                "mastered": bool(r["mastered"]),
                "starred": bool(r["starred"]),
                "createdAt": r["created_at"]
            })
        return cards

@app.post("/api/cards")
async def create_cards(payload: Union[BatchCardsCreate, CardCreate, Dict[str, Any]]):
    """
    Thêm thẻ từ vựng mới:
    - Hỗ trợ thêm 1 thẻ
    - Hỗ trợ nhập hàng loạt từ AI Code hoặc từ PDF-parser
    """
    now = int(asyncio.get_event_loop().time() * 1000)
    cards_to_insert = []
    
    if isinstance(payload, BatchCardsCreate):
        target_deck_id = payload.deck_id
        for idx, c in enumerate(payload.cards):
            card_id = c.get('id') or f"card-{now}-{idx}"
            word = c.get('word', '').strip()
            meaning = c.get('meaning', '').strip()
            if not word or not meaning:
                continue
            cards_to_insert.append((
                card_id,
                target_deck_id,
                word,
                c.get('phonetic', '') or c.get('romaji', '') or '',
                c.get('pos', '') or '',
                meaning,
                c.get('example', '') or '',
                c.get('exampleMeaning', '') or c.get('example_meaning', '') or '',
                1 if c.get('mastered') else 0,
                1 if c.get('starred') else 0,
                now + idx
            ))
    elif isinstance(payload, CardCreate):
        card_id = payload.id or f"card-{now}"
        cards_to_insert.append((
            card_id,
            payload.deck_id or 'deck-japanese-n5',
            payload.word.strip(),
            payload.phonetic or '',
            payload.pos or '',
            payload.meaning.strip(),
            payload.example or '',
            payload.exampleMeaning or payload.example_meaning or '',
            1 if payload.mastered else 0,
            1 if payload.starred else 0,
            now
        ))
    elif isinstance(payload, dict):
        if 'cards' in payload and isinstance(payload['cards'], list):
            target_deck_id = payload.get('deck_id') or 'deck-japanese-n5'
            for idx, c in enumerate(payload['cards']):
                card_id = c.get('id') or f"card-{now}-{idx}"
                word = (c.get('word') or '').strip()
                meaning = (c.get('meaning') or '').strip()
                if not word or not meaning:
                    continue
                cards_to_insert.append((
                    card_id,
                    target_deck_id,
                    word,
                    c.get('phonetic', '') or c.get('romaji', '') or '',
                    c.get('pos', '') or '',
                    meaning,
                    c.get('example', '') or '',
                    c.get('exampleMeaning', '') or c.get('example_meaning', '') or '',
                    1 if c.get('mastered') else 0,
                    1 if c.get('starred') else 0,
                    now + idx
                ))
        else:
            card_id = payload.get('id') or f"card-{now}"
            cards_to_insert.append((
                card_id,
                payload.get('deck_id') or 'deck-japanese-n5',
                payload.get('word', '').strip(),
                payload.get('phonetic', ''),
                payload.get('pos', ''),
                payload.get('meaning', '').strip(),
                payload.get('example', ''),
                payload.get('exampleMeaning', '') or payload.get('example_meaning', ''),
                1 if payload.get('mastered') else 0,
                1 if payload.get('starred') else 0,
                now
            ))

    if not cards_to_insert:
        raise HTTPException(status_code=400, detail="Không có thẻ từ vựng hợp lệ để lưu.")

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executemany("""
            INSERT OR REPLACE INTO cards (id, deck_id, word, phonetic, pos, meaning, example, example_meaning, mastered, starred, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, cards_to_insert)
        conn.commit()

    return {"success": True, "count": len(cards_to_insert)}

@app.put("/api/cards/{card_id}")
async def update_card(card_id: str, card: CardUpdate):
    """Cập nhật trạng thái thẻ (đã thuộc, đánh dấu sao, nội dung từ)"""
    updates = []
    params = []
    
    if card.word is not None:
        updates.append("word = ?")
        params.append(card.word)
    if card.phonetic is not None:
        updates.append("phonetic = ?")
        params.append(card.phonetic)
    if card.pos is not None:
        updates.append("pos = ?")
        params.append(card.pos)
    if card.meaning is not None:
        updates.append("meaning = ?")
        params.append(card.meaning)
    if card.example is not None:
        updates.append("example = ?")
        params.append(card.example)
    if card.exampleMeaning is not None or card.example_meaning is not None:
        updates.append("example_meaning = ?")
        params.append(card.exampleMeaning or card.example_meaning)
    if card.mastered is not None:
        updates.append("mastered = ?")
        params.append(1 if card.mastered else 0)
    if card.starred is not None:
        updates.append("starred = ?")
        params.append(1 if card.starred else 0)
        
    if not updates:
        return {"success": True, "message": "Không có trường nào cần cập nhật"}

    params.append(card_id)
    query = f"UPDATE cards SET {', '.join(updates)} WHERE id = ?"

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()

    return {"success": True, "card_id": card_id}

@app.delete("/api/cards/{card_id}")
async def delete_card(card_id: str):
    """Xóa 1 thẻ từ vựng"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cards WHERE id = ?", (card_id,))
        deleted = cursor.rowcount
        conn.commit()
        
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy thẻ cần xóa")
    return {"success": True, "deleted_card_id": card_id}

# ---------- TTS AUDIO API (/api/tts) ----------
async def process_tts(text: str, lang: Optional[str] = None, custom_voice: Optional[str] = None):
    text = (text or '').strip()
    if not text:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp tham số 'text' để phát âm.")

    # Tự động nhận diện ngôn ngữ nếu không chỉ định rõ
    detected_lang = lang if lang and lang != 'auto' else detect_language(text)
    clean_text = clean_text_for_speech(text, detected_lang)
    text_to_speak = clean_text or text

    # Chọn Voice chuẩn cho Edge-TTS
    voice = custom_voice or EDGE_VOICES.get(detected_lang) or EDGE_VOICES.get(detected_lang.split('-')[0]) or 'ja-JP-NanamiNeural'
    
    cache_filename = get_cache_filename(text_to_speak, voice)
    cache_filepath = os.path.join(CACHE_DIR, cache_filename)

    # 1. KIỂM TRA BỘ NHỚ ĐỆM (CACHE)
    if os.path.exists(cache_filepath) and os.path.getsize(cache_filepath) > 0:
        return FileResponse(
            cache_filepath,
            media_type="audio/mpeg",
            headers={
                "X-Cache": "HIT",
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        )

    # 2. SINH ÂM THANH MỚI: ƯU TIÊN EDGE-TTS (MIỄN PHÍ, TỰ NHIÊN, KHÔNG GIỚI HẠN)
    try:
        await generate_edge_tts(text_to_speak, voice, cache_filepath)
        return FileResponse(
            cache_filepath,
            media_type="audio/mpeg",
            headers={
                "X-Cache": "MISS",
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        )
    except Exception as edge_err:
        print(f"[EDGE-TTS WARN] Lỗi Edge-TTS: {edge_err}. Đang thử ElevenLabs...")
        
        # 3. DỰ PHÒNG ELEVENLABS NẾU CÓ KEY
        if ELEVENLABS_API_KEY:
            try:
                await generate_elevenlabs_tts(text_to_speak, cache_filepath)
                return FileResponse(
                    cache_filepath,
                    media_type="audio/mpeg",
                    headers={"X-Cache": "MISS", "Cache-Control": "public, max-age=31536000, immutable"}
                )
            except Exception as el_err:
                print(f"[ELEVENLABS WARN] Lỗi ElevenLabs: {el_err}")

        # Nếu cả 2 đều lỗi, trả về lỗi để Frontend lập tức fallback sang Web Speech Synthesis
        raise HTTPException(
            status_code=500,
            detail=f"Không thể sinh âm thanh TTS từ server ({str(edge_err)}). Sử dụng Web Speech API thay thế."
        )

@app.get("/api/tts")
async def tts_get(text: str = Query(...), lang: Optional[str] = Query(None), voice: Optional[str] = Query(None)):
    """Phát âm qua GET request (dễ nhúng trực tiếp vào thẻ <audio src=...>)"""
    return await process_tts(text, lang, voice)

@app.post("/api/tts")
async def tts_post(payload: TtsRequest):
    """Phát âm qua POST JSON request"""
    return await process_tts(payload.text, payload.lang, payload.voice)

@app.get("/api/cache")
async def list_cache():
    """Xem danh sách các file âm thanh đã lưu đệm"""
    cached_files = [f for f in os.listdir(CACHE_DIR) if f.endswith('.mp3')]
    return {
        "count": len(cached_files),
        "files": cached_files
    }

# ==================== PHỤC VỤ STATIC FILES & GIAO DIỆN WEB ====================
# Phục vụ index.html tại trang chủ
@app.get("/")
async def serve_index():
    index_file = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file, media_type="text/html")
    raise HTTPException(status_code=404, detail="index.html not found")

# Mount toàn bộ thư mục BASE_DIR để phục vụ app.js, style.css, pdf-parser.js...
app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")

# ==================== RUN SERVER ====================
def run():
    print("=" * 64)
    print("🚀  FLASHLEARN - JAPANESE FLASHCARD FULL-STACK SERVER (FastAPI)")
    print("=" * 64)
    print(f"👉 Địa chỉ truy cập Web:     http://localhost:{PORT}")
    print(f"👉 CSDL SQLite vĩnh viễn:    {DB_PATH}")
    print(f"👉 API TTS Edge-TTS:         http://localhost:{PORT}/api/tts?text=桜&lang=ja-JP")
    print(f"👉 Trạng thái server & DB:   http://localhost:{PORT}/api/status")
    print(f"📁 Thư mục lưu Cache:        {CACHE_DIR}")
    print(f"🎙️ Giọng đọc tiếng Nhật:     {EDGE_VOICES['ja-JP']} (Nanami Neural)")
    print(f"🎙️ Giọng đọc tiếng Anh:      {EDGE_VOICES['en-US']} (Jenny Neural)")
    print("=" * 64)
    uvicorn.run(app, host="0.0.0.0", port=PORT)

if __name__ == '__main__':
    run()

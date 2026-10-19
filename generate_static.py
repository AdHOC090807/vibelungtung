#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_static.py - Pre-generate Static Flashcards & Audio Assets for GitHub Pages
====================================================================================
1. Đọc toàn bộ decks & cards từ CSDL SQLite (flashcards.db).
2. Tên file âm thanh theo hash sha1((text + voice_id)[:16]) + ".mp3", lưu vào audio/.
3. Ưu tiên tái sử dụng file đã có trong audio/ hoặc audio_cache/ để tiết kiệm quota.
4. Sinh âm thanh bằng ElevenLabs AI (nếu có ELEVENLABS_API_KEY trong .env) với retry 3 lần,
   hoặc tự động dùng Edge-TTS nếu không có key / hết quota.
5. Xuất flashcards.json tại thư mục gốc với đường dẫn tương đối (ví dụ: "audio/1501d488164e2098.mp3").
"""

import os
import sys
import re
import json
import time
import shutil
import hashlib
import sqlite3
import asyncio
from typing import Dict, Any, List, Optional

# Windows terminal UTF-8 encoding fix
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

import requests
import edge_tts

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'flashcards.db')
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
CACHE_DIR = os.path.join(BASE_DIR, 'audio_cache')
JSON_PATH = os.path.join(BASE_DIR, 'flashcards.json')
ENV_FILE = os.path.join(BASE_DIR, '.env')

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

# Đọc cấu hình từ .env
def load_env(env_path: str) -> Dict[str, str]:
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
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY') or ENV.get('ELEVENLABS_API_KEY', '')
ELEVENLABS_VOICE_ID = os.environ.get('ELEVENLABS_VOICE_ID') or ENV.get('ELEVENLABS_VOICE_ID', 'JBFqnCBsd6RMkjVDRZzb')
ELEVENLABS_MODEL_ID = os.environ.get('ELEVENLABS_MODEL_ID') or ENV.get('ELEVENLABS_MODEL_ID', 'eleven_flash_v2_5')

EDGE_VOICES = {
    'ja': 'ja-JP-NanamiNeural',
    'ja-JP': 'ja-JP-NanamiNeural',
    'vi': 'vi-VN-HoaiMyNeural',
    'vi-VN': 'vi-VN-HoaiMyNeural',
    'en': 'en-US-JennyNeural',
    'en-US': 'en-US-JennyNeural',
    'zh': 'zh-CN-XiaoxiaoNeural',
    'zh-CN': 'zh-CN-XiaoxiaoNeural',
    'ko': 'ko-KR-SunHiNeural',
    'ko-KR': 'ko-KR-SunHiNeural'
}

def detect_language(text: str, default_lang: str = 'ja-JP') -> str:
    """Tự động phát hiện ngôn ngữ văn bản: Tiếng Nhật (ja-JP), Tiếng Việt (vi-VN), Tiếng Anh (en-US)"""
    if not text:
        return default_lang
    if re.search(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]', text):
        return 'ja-JP'
    if re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]', text, re.IGNORECASE):
        return 'vi-VN'
    return 'en-US'

def clean_text_for_speech(text: str, lang: str) -> str:
    """Làm sạch chuỗi trước khi chuyển thành giọng nói"""
    if not text:
        return ""
    if lang.startswith("ja"):
        m = re.search(r"\(([\u3040-\u309F\u30A0-\u30FF\s]+)\)", text)
        if m:
            return m.group(1).strip()
    cleaned = re.sub(r"\(.*?\)|\[.*?\]|\/.*?\/", " ", text)
    cleaned = re.sub(r"[\(\)\[\]\/]", " ", cleaned).strip()
    return cleaned or text

def is_valid_mp3_file(filepath: str) -> bool:
    """Kiểm tra file tồn tại, dung lượng > 0 và header khớp định dạng MP3 (ID3 hoặc sync frame)"""
    if not os.path.exists(filepath):
        return False
    if os.path.getsize(filepath) < 32:
        return False
    try:
        with open(filepath, 'rb') as f:
            header = f.read(16)
        if header.startswith(b'ID3'):
            return True
        if len(header) >= 2 and header[0] == 0xFF and (header[1] & 0xE0) == 0xE0:
            return True
        if b'error' in header.lower() or header.startswith(b'{') or header.startswith(b'<'):
            return False
        return True
    except Exception:
        return False

def get_cache_filenames(text: str) -> List[str]:
    """Tạo các tên file tương thích với audio_cache cũ"""
    text_key = text.strip().lower()
    h = hashlib.md5(text_key.encode('utf-8')).hexdigest()
    clean = re.sub(r'[^\w]+', '_', text.strip()[:20], flags=re.UNICODE).strip('_')
    filenames = []
    if clean:
        filenames.append(f"{clean}_{h[:12]}.mp3")
    filenames.append(f"{h}.mp3")
    return filenames

def call_elevenlabs_api(text: str, voice_id: str, model_id: str, api_key: str) -> bytes:
    """Gọi REST API ElevenLabs để sinh audio MP3"""
    api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    resp = requests.post(api_url, json=payload, headers=headers, timeout=20)
    content_type = resp.headers.get("content-type", "").lower()
    if resp.status_code != 200 or "audio" not in content_type:
        error_msg = f"HTTP {resp.status_code} ({content_type}): {resp.text[:200]}"
        raise RuntimeError(error_msg)
    if len(resp.content) == 0:
        raise RuntimeError("ElevenLabs trả về 0 bytes")
    return resp.content

async def call_edge_tts_async(text: str, voice: str, filepath: str):
    """Sinh audio bằng Edge-TTS"""
    comm = edge_tts.Communicate(text, voice)
    await comm.save(filepath)

def main():
    print("=" * 64)
    print("📦  FLASHLEARN - GENERATE STATIC ASSETS CHO GITHUB PAGES")
    print("=" * 64)

    has_elevenlabs = bool(ELEVENLABS_API_KEY and not ELEVENLABS_API_KEY.startswith('your_'))
    print(f"👉 Thư mục output audio:     {AUDIO_DIR}")
    print(f"👉 Thư mục cache:            {CACHE_DIR}")
    print(f"👉 File JSON đầu ra:         {JSON_PATH}")

    if has_elevenlabs:
        print(f"🎙️ Engine chính:             ElevenLabs (Voice: {ELEVENLABS_VOICE_ID}, Model: {ELEVENLABS_MODEL_ID})")
        print(f"🔑 ElevenLabs API Key:       Đã nạp thành công (Độ dài: {len(ELEVENLABS_API_KEY)} ký tự)")
    else:
        print("🎙️ Engine chính:             Edge-TTS (Miễn phí 100%, Nanami / HoaiMy / Jenny / Xiaoxiao)")

    # 1. Đọc dữ liệu từ SQLite
    if not os.path.exists(DB_PATH):
        print(f"❌ Không tìm thấy database SQLite tại {DB_PATH}. Vui lòng chạy server.py trước!")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    decks_rows = cursor.execute("SELECT * FROM decks ORDER BY created_at ASC").fetchall()
    cards_rows = cursor.execute("SELECT * FROM cards ORDER BY created_at ASC").fetchall()
    conn.close()

    print(f"📊 Tìm thấy: {len(decks_rows)} bộ thẻ và {len(cards_rows)} thẻ từ vựng.")

    deck_map = {}
    for d in decks_rows:
        deck_map[d['id']] = {
            'id': d['id'],
            'name': d['name'],
            'lang': d['lang'] or 'ja-JP',
            'createdAt': d['created_at']
        }

    # 2. Xử lý và sinh audio cho từng thẻ
    # Sử dụng cache hash text -> audio_rel_path để các thẻ có cùng text dùng chung 1 file
    text_to_audio_map = {}
    total_chars_used = 0
    success_count = 0
    fail_count = 0
    reused_count = 0
    generated_count = 0

    cards_json_list = []

    print("\n🚀 Bắt đầu kiểm tra và tạo file âm thanh...")

    for idx, card in enumerate(cards_rows, 1):
        card_id = card['id']
        deck_id = card['deck_id']
        deck_info = deck_map.get(deck_id, {})
        deck_lang = deck_info.get('lang', 'ja-JP')

        raw_word = card['word'].strip()
        detected_lang = deck_lang if deck_lang and deck_lang != 'auto' else detect_language(raw_word)
        text_to_speak = clean_text_for_speech(raw_word, detected_lang) or raw_word

        # Xác định voice_id dùng cho hash
        if has_elevenlabs:
            voice_id = ELEVENLABS_VOICE_ID
        else:
            voice_id = EDGE_VOICES.get(detected_lang) or EDGE_VOICES.get(detected_lang.split('-')[0]) or 'ja-JP-NanamiNeural'

        # Tính hash ổn định theo (text + voice_id)[:16]
        hash_src = f"{raw_word}{voice_id}"
        hash_str = hashlib.sha1(hash_src.encode('utf-8')).hexdigest()[:16]
        audio_filename = f"{hash_str}.mp3"
        audio_target_path = os.path.join(AUDIO_DIR, audio_filename)
        rel_audio_path = f"audio/{audio_filename}"

        # Nếu cùng text đã được xử lý ở thẻ trước -> dùng chung file
        if raw_word in text_to_audio_map:
            assigned_rel_path = text_to_audio_map[raw_word]
            success_count += 1
            print(f"  [{idx}/{len(cards_rows)}] '{raw_word}' -> Dùng chung file {assigned_rel_path}")
        else:
            file_ready = False

            # Kiểm tra xem file đã có sẵn trong audio/ và hợp lệ chưa
            if is_valid_mp3_file(audio_target_path):
                file_ready = True
                reused_count += 1
                success_count += 1
                print(f"  [{idx}/{len(cards_rows)}] '{raw_word}' -> Đã có sẵn trong audio/ ({audio_filename})")

            # Kiểm tra xem có thể tái sử dụng từ audio_cache/ không
            if not file_ready:
                possible_cache_names = get_cache_filenames(text_to_speak) + get_cache_filenames(raw_word)
                for cname in possible_cache_names:
                    cpath = os.path.join(CACHE_DIR, cname)
                    if is_valid_mp3_file(cpath):
                        shutil.copy2(cpath, audio_target_path)
                        file_ready = True
                        reused_count += 1
                        success_count += 1
                        print(f"  [{idx}/{len(cards_rows)}] '{raw_word}' -> Tái sử dụng từ audio_cache: {cname} -> {audio_filename}")
                        break

            # Nếu chưa có -> sinh mới
            if not file_ready:
                gen_success = False
                # Ưu tiên ElevenLabs nếu có key
                if has_elevenlabs:
                    for attempt in range(1, 4):
                        try:
                            print(f"  [{idx}/{len(cards_rows)}] Đang gọi ElevenLabs cho '{text_to_speak}' (lần thử {attempt}/3)...")
                            audio_bytes = call_elevenlabs_api(
                                text=text_to_speak,
                                voice_id=ELEVENLABS_VOICE_ID,
                                model_id=ELEVENLABS_MODEL_ID,
                                api_key=ELEVENLABS_API_KEY
                            )
                            with open(audio_target_path, 'wb') as f:
                                f.write(audio_bytes)
                            # Kiểm tra lại magic bytes
                            if is_valid_mp3_file(audio_target_path):
                                total_chars_used += len(text_to_speak)
                                gen_success = True
                                generated_count += 1
                                success_count += 1
                                print(f"  [{idx}/{len(cards_rows)}] ✅ ElevenLabs thành công: {audio_filename} ({len(audio_bytes)} bytes)")
                                # Lưu thêm vào audio_cache cho local
                                cache_file = os.path.join(CACHE_DIR, get_cache_filenames(text_to_speak)[0])
                                try:
                                    shutil.copy2(audio_target_path, cache_file)
                                except Exception:
                                    pass
                                break
                            else:
                                print(f"  [{idx}/{len(cards_rows)}] ⚠️ File tạo ra không phải MP3 hợp lệ, thử lại...")
                                if os.path.exists(audio_target_path):
                                    os.remove(audio_target_path)
                        except Exception as el_err:
                            print(f"  [{idx}/{len(cards_rows)}] ⚠️ ElevenLabs lỗi: {el_err}")
                            if attempt < 3:
                                sleep_sec = 2 ** attempt
                                time.sleep(sleep_sec)

                # Fallback sang Edge-TTS nếu ElevenLabs không dùng hoặc thất bại
                if not gen_success:
                    try:
                        edge_voice = EDGE_VOICES.get(detected_lang) or EDGE_VOICES.get(detected_lang.split('-')[0]) or 'ja-JP-NanamiNeural'
                        print(f"  [{idx}/{len(cards_rows)}] Đang sinh audio qua Edge-TTS ({edge_voice})...")
                        asyncio.run(call_edge_tts_async(text_to_speak, edge_voice, audio_target_path))
                        if is_valid_mp3_file(audio_target_path):
                            gen_success = True
                            generated_count += 1
                            success_count += 1
                            print(f"  [{idx}/{len(cards_rows)}] ✅ Edge-TTS thành công: {audio_filename}")
                            cache_file = os.path.join(CACHE_DIR, get_cache_filenames(text_to_speak)[0])
                            try:
                                shutil.copy2(audio_target_path, cache_file)
                            except Exception:
                                pass
                        else:
                            print(f"  [{idx}/{len(cards_rows)}] ❌ Edge-TTS tạo file không hợp lệ!")
                    except Exception as edge_err:
                        print(f"  [{idx}/{len(cards_rows)}] ❌ Lỗi Edge-TTS: {edge_err}")

                if not gen_success:
                    fail_count += 1
                    assigned_rel_path = ""
                else:
                    assigned_rel_path = rel_audio_path

            text_to_audio_map[raw_word] = rel_audio_path
            assigned_rel_path = rel_audio_path

        # 3. Tạo entry cho flashcards.json
        card_entry = {
            "id": card_id,
            "deckId": deck_id,
            "deck_id": deck_id,
            "deckName": deck_info.get('name', 'Bộ từ vựng'),
            "deckLang": deck_lang,
            "front": card['word'],
            "back": card['meaning'],
            "word": card['word'],
            "phonetic": card['phonetic'] or "",
            "pos": card['pos'] or "",
            "meaning": card['meaning'],
            "example": card['example'] or "",
            "exampleMeaning": card['example_meaning'] or "",
            "example_meaning": card['example_meaning'] or "",
            "mastered": bool(card['mastered']),
            "starred": bool(card['starred']),
            "createdAt": card['created_at'],
            "audio": assigned_rel_path
        }
        cards_json_list.append(card_entry)

    # 4. Ghi file flashcards.json ra thư mục gốc
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(cards_json_list, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 64)
    print("🎉  KẾT QUẢ PRE-GENERATE TĨNH:")
    print("=" * 64)
    print(f"✅ Tổng số thẻ đã xử lý:      {len(cards_rows)}")
    print(f"✅ Thành công:                 {success_count}")
    print(f"❌ Thất bại:                   {fail_count}")
    print(f"🔄 Tái sử dụng (0 quota):      {reused_count}")
    print(f"🎙️ Mới tạo:                    {generated_count}")
    print(f"🔤 Tổng ký tự gửi ElevenLabs:  {total_chars_used} ký tự")
    print(f"📄 File JSON:                  {JSON_PATH} ({os.path.getsize(JSON_PATH)} bytes)")
    print(f"📁 Thư mục Audio:              {AUDIO_DIR} ({len(os.listdir(AUDIO_DIR))} files)")
    print("=" * 64)

if __name__ == '__main__':
    main()

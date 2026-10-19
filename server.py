#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FlashLearn ElevenLabs Audio Server
===================================
- Tự động đọc API key và cấu hình từ file .env
- Gọi ElevenLabs TTS API với model 'eleven_flash_v2_5' (tiết kiệm 50% điểm)
- Bộ nhớ đệm (Cache) trên ổ đĩa: lưu vĩnh viễn các file âm thanh đã tải về,
  đảm bảo khi nghe lại từ cũ KHÔNG BAO GIỜ tốn thêm bất kỳ điểm miễn phí nào!
- Phục vụ toàn bộ ứng dụng web tại http://localhost:3000
"""

import os
import sys
import json
import re
import hashlib
import mimetypes
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(BASE_DIR, 'audio_cache')
ENV_FILE = os.path.join(BASE_DIR, '.env')

# Dam bao terminal Windows khong bi loi UnicodeEncodeError khi in emoji / tieng Viet
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Đảm bảo thư mục cache tồn tại
os.makedirs(CACHE_DIR, exist_ok=True)

def load_env(env_path):
    """Đọc file .env thủ công không cần thư viện ngoài"""
    config = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    k, v = line.split('=', 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    config[k] = v
    return config

ENV = load_env(ENV_FILE)
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY') or ENV.get('ELEVENLABS_API_KEY', '')
DEFAULT_VOICE_ID = os.environ.get('ELEVENLABS_VOICE_ID') or ENV.get('ELEVENLABS_VOICE_ID', 'Xb7hH8MSUJpSbSDYk0k2') # Alice
MODEL_ID = os.environ.get('ELEVENLABS_MODEL_ID') or ENV.get('ELEVENLABS_MODEL_ID', 'eleven_flash_v2_5')
PORT = int(os.environ.get('PORT') or ENV.get('PORT', 3000))

def get_cache_filename(text, voice_id, model_id):
    """Tạo tên file cache an toàn và dễ đọc: {slug}_{hash}.mp3"""
    clean_text = text.strip().lower()
    # Lấy 20 ký tự đầu làm slug dễ đọc
    slug = re.sub(r'[^a-zA-Z0-9]+', '_', clean_text)[:20].strip('_') or 'speech'
    key = f"{clean_text}:{voice_id}:{model_id}".encode('utf-8')
    h = hashlib.md5(key).hexdigest()[:12]
    return f"{slug}_{h}.mp3"

class FlashLearnHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization')
        self.send_header('Access-Control-Expose-Headers', 'X-Cache, Content-Length, Content-Range')

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Endpoint 1: Trạng thái server & cấu hình ElevenLabs
        if path == '/api/status':
            self.handle_status()
            return

        # Endpoint 2: Xử lý phát âm Text-to-Speech (GET /api/tts?text=...)
        if path == '/api/tts':
            params = parse_qs(parsed.query)
            text = params.get('text', [''])[0]
            voice_id = params.get('voice_id', [DEFAULT_VOICE_ID])[0]
            self.handle_tts(text, voice_id)
            return

        # Endpoint 3: Danh sách các từ đã được lưu trong cache
        if path == '/api/cache':
            self.handle_cache_list()
            return

        # Mặc định: Phục vụ các file tĩnh trong web (index.html, app.js, style.css...)
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/tts':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                data = json.loads(body)
            except Exception:
                data = {}
            text = data.get('text', '')
            voice_id = data.get('voice_id', DEFAULT_VOICE_ID)
            self.handle_tts(text, voice_id)
            return

        self.send_error(404, "Endpoint not found")

    def handle_status(self):
        cached_files = [f for f in os.listdir(CACHE_DIR) if f.endswith('.mp3')]
        total_cache_size = sum(os.path.getsize(os.path.join(CACHE_DIR, f)) for f in cached_files)
        
        has_key = bool(ELEVENLABS_API_KEY and not ELEVENLABS_API_KEY.startswith('your_'))
        masked_key = f"{ELEVENLABS_API_KEY[:7]}...{ELEVENLABS_API_KEY[-4:]}" if has_key else "Chưa cấu hình"

        res = {
            "status": "online",
            "provider": "ElevenLabs",
            "model_id": MODEL_ID,
            "voice_id": DEFAULT_VOICE_ID,
            "voice_name": "Alice (Clear, Engaging Educator)",
            "api_key_configured": has_key,
            "api_key_masked": masked_key,
            "cache_count": len(cached_files),
            "cache_size_bytes": total_cache_size,
            "cache_size_mb": round(total_cache_size / (1024 * 1024), 2)
        }
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))

    def handle_cache_list(self):
        cached_files = [f for f in os.listdir(CACHE_DIR) if f.endswith('.mp3')]
        res = {
            "count": len(cached_files),
            "files": cached_files
        }
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))

    def handle_tts(self, text, voice_id):
        text = (text or '').strip()
        if not text:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Vui lòng cung cấp tham số 'text' để phát âm."}).encode('utf-8'))
            return

        if not ELEVENLABS_API_KEY:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Chưa có ELEVENLABS_API_KEY trong file .env"}).encode('utf-8'))
            return

        active_voice = voice_id or DEFAULT_VOICE_ID
        active_model = MODEL_ID
        cache_filename = get_cache_filename(text, active_voice, active_model)
        cache_filepath = os.path.join(CACHE_DIR, cache_filename)

        # ========================================================
        # 1. KIỂM TRA BỘ NHỚ ĐỆM (CACHE)
        # Nếu file âm thanh đã tồn tại -> Trả về ngay lập tức!
        # KHÔNG GỌI API ELEVENLABS -> TIẾT KIỆM 100% ĐIỂM
        # ========================================================
        if os.path.exists(cache_filepath) and os.path.getsize(cache_filepath) > 0:
            try:
                with open(cache_filepath, 'rb') as f:
                    audio_data = f.read()
                print(f"[CACHE HIT ⚡] '{text}' -> Trả về từ {cache_filename} (0 điểm API tiêu tốn)")
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_data)))
                self.send_header('X-Cache', 'HIT')
                self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
                self.end_cors_headers()
                self.end_headers()
                self.wfile.write(audio_data)
                return
            except Exception as e:
                print(f"[CACHE READ ERROR] {e}, sẽ thử tải mới...")

        # ========================================================
        # 2. NẾU CHƯA CÓ TRONG CACHE -> GỌI ELEVENLABS API
        # Model: eleven_flash_v2_5 (tiết kiệm 50% điểm)
        # ========================================================
        print(f"[ELEVENLABS API 🎙️] Đang tải âm thanh mới cho: '{text}' (Voice: {active_voice}, Model: {active_model})...")
        api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{active_voice}?output_format=mp3_44100_128"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "FlashLearn-Audio-Server/1.0"
        }
        payload = {
            "text": text,
            "model_id": active_model,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8
            }
        }

        try:
            req_data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(api_url, data=req_data, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=15) as resp:
                audio_data = resp.read()

            # Lưu vào file cache trên ổ đĩa để lần sau nghe lại không tốn điểm
            with open(cache_filepath, 'wb') as f:
                f.write(audio_data)
            print(f"[CACHE SAVED 💾] Đã lưu file cache: {cache_filename} ({len(audio_data)} bytes). Lần sau nghe lại sẽ miễn phí!")

            # Trả file âm thanh về cho trình duyệt
            self.send_response(200)
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Length', str(len(audio_data)))
            self.send_header('X-Cache', 'MISS')
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
            self.end_cors_headers()
            self.end_headers()
            self.wfile.write(audio_data)

        except urllib.error.HTTPError as err:
            err_body = err.read().decode('utf-8', errors='ignore')
            print(f"[ELEVENLABS ERROR] HTTP {err.code}: {err_body}")
            self.send_response(err.code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": f"ElevenLabs API Error (HTTP {err.code})",
                "details": err_body
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as err:
            print(f"[SERVER ERROR] {err}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(err)}, ensure_ascii=False).encode('utf-8'))


def run_server():
    current_port = PORT
    server = None
    # Nếu port 3000 bị chiếm, tự động thử các port tiếp theo (3001, 3002...)
    for p in range(current_port, current_port + 10):
        try:
            server = HTTPServer(('0.0.0.0', p), FlashLearnHandler)
            current_port = p
            break
        except OSError:
            continue

    if not server:
        print(f"Không thể mở cổng từ {PORT} đến {PORT + 10}. Vui lòng kiểm tra lại.")
        sys.exit(1)

    print("=" * 60)
    print("🚀  FLASHLEARN - ELEVENLABS AI VOICE SERVER ĐÃ KHỞI CHẠY!")
    print("=" * 60)
    print(f"👉 Địa chỉ truy cập Web:    http://localhost:{current_port}")
    print(f"👉 API TTS Endpoint:         http://localhost:{current_port}/api/tts?text=hello")
    print(f"👉 Trạng thái server:        http://localhost:{current_port}/api/status")
    print(f"📁 Thư mục lưu Cache:        {CACHE_DIR}")
    print(f"🎙️ Model ElevenLabs:         {MODEL_ID} (Tiết kiệm 50% điểm)")
    print(f"🗣️ Giọng đọc mặc định:       Alice ({DEFAULT_VOICE_ID})")
    print("=" * 60)
    print("💡 Mẹo: Bấm Ctrl + C trong cửa sổ này để dừng server.")
    print("=" * 60)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nĐang tắt server...")
        server.server_close()

if __name__ == '__main__':
    run_server()

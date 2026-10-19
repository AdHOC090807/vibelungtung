# FlashLearn - Ứng Dụng Web Học Từ Vựng Flashcard Tiếng Nhật Full-Stack

Ứng dụng web học từ vựng Flashcard 2 mặt hoàn chỉnh theo phong cách hiện đại (tương tự Anki / Quizlet), tích hợp CSDL SQLite vĩnh viễn và giọng đọc AI bản xứ (Edge-TTS Nanami 🇯🇵, Jenny 🇬🇧, ElevenLabs).

---

## 🚀 Khởi động ứng dụng (1-Click)

### Cách 1: Khởi động Full-Stack Server (Khuyên dùng)
Chỉ cần **nhấp đúp chuột vào file `start-server.bat`**:
- Hệ thống sẽ tự động kiểm tra môi trường Python.
- Tự động cài đặt các thư viện cần thiết từ `requirements.txt` (`fastapi`, `uvicorn`, `edge-tts`).
- Khởi động FastAPI server tại địa chỉ: **`http://localhost:8000`** và tự động mở trình duyệt.
- Cả giao diện Web lẫn API đều chạy chung trên cổng `8000` (tuyệt đối không bị lỗi CORS hay lệch cổng).

Hoặc chạy thủ công qua Terminal:
```powershell
pip install -r requirements.txt
py server.py
# Hoặc: python server.py
```

### Cách 2: Chạy trực tiếp trên GitHub Pages (Tĩnh 100% không cần server)
- Link trực tuyến: [https://adhoc090807.github.io/vibelungtung/](https://adhoc090807.github.io/vibelungtung/)
- Web chạy hoàn toàn **Static (Client-side)** trên GitHub Pages:
  - Dữ liệu thẻ và bộ từ được nạp trực tiếp từ `flashcards.json` (đường dẫn tương đối).
  - Toàn bộ giọng đọc AI chất lượng cao được lưu sẵn trong thư mục `audio/` (tên file theo mã băm SHA1).
  - Bấm loa phát ngay lập tức không trễ, không phụ thuộc server Python.
  - Tiến trình học, thẻ yêu thích, hoặc thẻ thêm mới được lưu tự động trên trình duyệt (`localStorage`).
  - Hỗ trợ đầy đủ bộ trích xuất PDF (`pdf-parser.js`) trực tiếp trên client.

### 🔄 Cách cập nhật thẻ và sinh lại Audio trước khi đẩy lên GitHub:
Khi bạn thêm từ mới hoặc sửa đổi thẻ trong `flashcards.db` ở máy local:
1. Chạy script tạo dữ liệu tĩnh:
   ```powershell
   py generate_static.py
   ```
   - Script tự động đọc `flashcards.db`, sinh âm thanh AI vào `audio/` (tự động bỏ qua file đã có để tiết kiệm quota ElevenLabs) và xuất `flashcards.json`.
2. Đẩy lên GitHub:
   ```powershell
   git add .
   git commit -m "Update static flashcards and audio"
   git push origin main
   ```
3. GitHub Pages sẽ tự động cập nhật web mới nhất!

---

## 🏗️ Kiến trúc Full-Stack & CSDL SQLite (`flashcards.db`)

1. **Thống nhất Backend duy nhất (`server.py`)**:
   - Sử dụng **FastAPI** và **Uvicorn** hiệu năng cao.
   - Vừa phục vụ file tĩnh (`index.html`, `app.js`, `style.css`, `pdf-parser.js`), vừa xử lý các API RESTful trên cùng một cổng `8000`.

2. **Cơ sở dữ liệu SQLite vĩnh viễn (`flashcards.db`)**:
   - Tự động nạp sẵn bộ thẻ mẫu **🇯🇵 Tiếng Nhật JLPT N5 - Nhập Môn & Thông Dụng** (với Kanji, Furigana cách đọc, nghĩa tiếng Việt, câu ví dụ và bản dịch).
   - Tự động đồng bộ 2 chiều: Khi có server, dữ liệu được ghi thẳng vào SQLite qua API; khi offline, dữ liệu được lưu dự phòng vào `localStorage`.

3. **Danh sách API chính**:
   - `GET /api/status`: Kiểm tra trạng thái máy chủ, CSDL SQLite và số file cache.
   - `GET /api/decks`: Lấy danh sách bộ thẻ kèm thống kê số thẻ đã thuộc/cần ôn.
   - `POST /api/decks`: Tạo bộ thẻ mới.
   - `DELETE /api/decks/{deck_id}`: Xóa bộ thẻ và các thẻ từ vựng liên quan.
   - `POST /api/decks/{deck_id}/reset`: Đặt lại tiến trình học về 0.
   - `GET /api/cards?deck_id=...`: Lấy danh sách thẻ từ vựng theo bộ.
   - `POST /api/cards`: Thêm thẻ từ vựng (hỗ trợ nhập 1 thẻ hoặc hàng loạt từ AI/PDF).
   - `PUT /api/cards/{card_id}`: Cập nhật trạng thái đã thuộc, đánh dấu sao ⭐.
   - `DELETE /api/cards/{card_id}`: Xóa thẻ từ vựng.
   - `GET /api/tts?text=...&lang=...`: Phát âm Text-to-Speech với bộ nhớ đệm cache.

---

## 🎙️ Hệ thống Giọng đọc AI & Bộ nhớ đệm Audio Cache

1. **Ưu tiên 1 - Edge-TTS (Chất lượng phòng thu, Miễn phí 100%)**:
   - Tiếng Nhật: Giọng nữ bản xứ tự nhiên **`ja-JP-NanamiNeural`** phát âm cực chuẩn và truyền cảm.
   - Tiếng Anh: Giọng nữ chuẩn quốc tế **`en-US-JennyNeural`**.
   - Tiếng Trung: **`zh-CN-XiaoxiaoNeural`**.
   - Không cần API key, không giới hạn số lượng ký tự.

2. **Ưu tiên 2 - ElevenLabs AI Voice (Dự phòng)**:
   - Nếu có cấu hình `ELEVENLABS_API_KEY` trong file `.env`, hệ thống có thể kết hợp thêm giọng ElevenLabs.

3. **Cơ chế lưu đệm Cache thông minh (`audio_cache/`)**:
   - Mọi từ vựng hoặc câu ví dụ sau khi phát âm lần đầu sẽ được lưu thành file `.mp3` trong thư mục `audio_cache/`.
   - Lần nghe sau sẽ phản hồi tức thì với `X-Cache: HIT` trong 0.01 giây mà không tốn công sinh lại.

4. **Bấm loa chống lật thẻ & Dự phòng không gián đoạn**:
   - Các nút loa 🔊 đều được tích hợp `e.stopPropagation()` và `e.preventDefault()`, không bao giờ bị lật thẻ ngoài ý muốn khi nhấn nghe.
   - Nếu server offline hoặc gặp sự cố mạng, hệ thống **ngay lập tức** chuyển sang `window.speechSynthesis` của trình duyệt hoặc audio stream trực tiếp, đảm bảo **bấm loa lúc nào cũng có tiếng**!

---

## 📄 Hỗ trợ Trích xuất Từ vựng từ PDF (`pdf-parser.js`)

- Đọc trực tiếp các file PDF từ vựng tiếng Nhật, tiếng Anh.
- Tự động nhận diện định dạng:
  - `桜 (さくら) : Hoa anh đào`
  - `1. 食べる - Ăn`
  - `Từ vựng | Phiên âm | Nghĩa | Ví dụ`
- Khi nhấn **"Thêm vào bộ thẻ"**, toàn bộ từ trích xuất từ PDF sẽ được gửi qua `POST /api/cards` và lưu vĩnh viễn vào SQLite database!

---

## ⌨️ Phím tắt tiện lợi (Keyboard Shortcuts)

| Phím tắt | Chức năng |
|----------|-----------|
| `Space` hoặc click thẻ | Lật mặt trước / mặt sau của thẻ |
| `→` (Mũi tên phải) | Chuyển sang thẻ tiếp theo |
| `←` (Mũi tên trái) | Quay lại thẻ trước |
| `1` | Đánh dấu: **Chưa nhớ** (Cần ôn lại) |
| `2` | Đánh dấu: **Đã nhớ** (Thành thạo) |
| `S` | Đánh dấu sao yêu thích ⭐ |
| `P` hoặc `V` | Bấm nghe phát âm AI |
| `A` | Bật / Tắt chế độ tự động đọc khi chuyển thẻ |

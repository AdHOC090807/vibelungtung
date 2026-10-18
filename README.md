# FlashLearn - Ứng Dụng Web Học Từ Vựng Flashcard Lật 2 Mặt

Ứng dụng web học từ vựng bằng flashcard lật 2 mặt tương tự Quizlet / Anki, thiết kế hiện đại, mượt mà và trực quan.

## 🚀 Cách mở và sử dụng

Chỉ cần nhấp đúp chuột để mở trực tiếp file `index.html` trong bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari) mà không cần cài đặt thêm phần mềm gì.

Hoặc mở bằng terminal:
```powershell
Start-Process "d:\web\index.html"
```

---

## ✨ Tính năng nổi bật

1. **Thẻ Flashcard lật 3D 2 mặt**:
   - **Mặt trước**: Từ vựng, phiên âm chuẩn IPA, từ loại, nút nghe phát âm tiếng Anh chuẩn bản xứ (sử dụng Web Speech Synthesis của trình duyệt), nút đánh dấu yêu thích ⭐.
   - **Mặt sau**: Định nghĩa tiếng Việt chi tiết, câu ví dụ thực tế kèm bản dịch nghĩa tiếng Việt.
   - Hiệu ứng lật thẻ 3D mượt mà bằng cách nhấn vào thẻ hoặc bấm phím cách (`Space`).

2. **Cách nhập từ vựng cực kỳ linh hoạt**:
   - **Cách 1: Nhập bằng mã AI (JSON hoặc văn bản thông thường)**:
     - Hỗ trợ định dạng JSON đầy đủ.
     - Hỗ trợ định dạng văn bản ngắn gọn: `từ | phiên âm | nghĩa | ví dụ | dịch câu` hoặc `từ - nghĩa`.
     - Tích hợp sẵn nút **"Mẫu lệnh cho AI 🤖"** và nút **"Sao chép prompt"** 1-click để bạn dán vào ChatGPT / Gemini / Claude là có ngay mã code để dán vào app.
   - **Cách 2: Đọc trực tiếp từ file PDF**:
     - Kéo thả hoặc chọn file tài liệu PDF từ vựng tiếng Anh.
     - Ứng dụng tự động bóc tách từ vựng, phiên âm và nghĩa (nhờ thư viện `PDF.js` xử lý ngay trên trình duyệt).
     - Cho phép xem trước danh sách từ vựng trích xuất trước khi lưu vào bộ thẻ.

3. **Quản lý nhiều bộ thẻ (Decks)**:
   - Tạo nhiều chủ đề từ vựng (ví dụ: IELTS, TOEIC, Giao tiếp hằng ngày, Từ vựng chuyên ngành...).
   - Sao lưu toàn bộ dữ liệu ra file `.json` hoặc khôi phục dữ liệu bất cứ lúc nào.
   - Tự động lưu tiến trình học vào trình duyệt (LocalStorage), không bị mất dữ liệu khi F5.

4. **Bộ lọc & Thống kê thông minh**:
   - Theo dõi số lượng: **Đã thuộc** và **Cần ôn**.
   - Bộ lọc: "Tất cả", "Cần ôn", "Yêu thích ⭐".
   - Nút xáo trộn thẻ (Shuffle) để thay đổi thứ tự ôn tập.
   - Hiệu ứng pháo hoa ăn mừng khi hoàn thành một bộ thẻ 🎉.

---

## ⌨️ Phím tắt tiện lợi (Keyboard Shortcuts)

| Phím tắt | Chức năng |
|----------|-----------|
| `Space` hoặc `Lật thẻ` | Lật mặt trước / mặt sau của thẻ |
| `→` (Mũi tên phải) | Chuyển sang thẻ tiếp theo |
| `←` (Mũi tên trái) | Quay lại thẻ trước |
| `1` | Đánh dấu: **Chưa nhớ** (Cần ôn lại) |
| `2` | Đánh dấu: **Đã nhớ** (Thành thạo) |
| `S` | Đánh dấu sao yêu thích ⭐ |
| `P` hoặc `V` | Nghe phát âm tiếng Anh (Pronunciation) |

---

## 🤖 Hướng dẫn lấy mã từ vựng bằng AI (ChatGPT, Claude, Gemini)

Sao chép câu lệnh mẫu dưới đây và gửi cho AI:

```text
Hãy tạo cho tôi danh sách 20 từ vựng tiếng Anh chủ đề [ĐIỀN CHỦ ĐỀ VÀO ĐÂY] dưới định dạng JSON sau:
[
  {
    "word": "từ tiếng anh",
    "phonetic": "/phiên âm IPA/",
    "pos": "noun / verb / adjective...",
    "meaning": "nghĩa tiếng Việt ngắn gọn, dễ hiểu",
    "example": "Câu ví dụ tiếng Anh tự nhiên",
    "exampleMeaning": "Dịch nghĩa câu ví dụ sang tiếng Việt"
  }
]
Chỉ xuất duy nhất khối JSON, không kèm lời dẫn.
```

Sau khi AI tạo xong, bấm copy đoạn mã rồi mở web, bấm nút **"Thêm từ vựng"**, dán vào ô văn bản và nhấn **"Thêm vào bộ thẻ"** là xong!

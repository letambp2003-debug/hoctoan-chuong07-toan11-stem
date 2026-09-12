# Toán 11 – Chương VII: Quan hệ vuông góc trong không gian
## Ứng dụng Web Học tập Tương tác, Mô hình hóa & STEM Challenge

Ứng dụng web học tập Toán 11 – Chương VII (Tập 2) được thiết kế hiện đại, nạp dữ liệu động 100% từ thư mục `/data/` và sẵn sàng vận hành trên **GitHub Pages**.

---

## 🌟 Tính năng nổi bật

### 1. Nguồn dữ liệu duy nhất từ `/data/` (Không hardcode trong HTML)
- `knowledge.json`: Toàn bộ nội dung kiến thức chuẩn Bài 22 đến Bài 27 và bài tập ôn tập cuối chương.
- `modeling.json`: Ngân hàng 7 tình huống mô hình hóa toán học 4 bước chuẩn Bộ GD&ĐT.
- `stem.json`: Dự án STEM trọng tâm "Thiết kế mô hình cầu vượt giao thông an toàn".
- `quiz.json`: 22 câu hỏi tương tác (Trắc nghiệm 4 lựa chọn, Đúng/Sai đa mệnh đề, Trả lời ngắn có dung sai).
- `references.json`: Bản đồ đối chiếu trang sách SGK (27–65) và trang PDF (1–39).

### 2. Knowledge Hub
Hiển thị đầy đủ 6 thành phần bắt buộc cho mỗi bài học:
1. **Mục tiêu cần đạt** (Learning outcomes)
2. **Thuật ngữ cốt lõi** (Key terms)
3. **Kiến thức cốt lõi** (Core knowledge với công thức KaTeX sắc nét)
4. **Tình huống thực tế** (Real-world contexts)
5. **Hoạt động mô hình hóa** (Liên kết trực tiếp sang Modeling Lab)
6. **Bài luyện tập củng cố** (Làm và chấm điểm trực tiếp tại chỗ)

### 3. Modeling Lab
Thực hành quy trình 4 bước mô hình hóa toán học cho 7 bài toán thực tế:
- Nút giao thông khác mức (Bài 22)
- Kiểm tra cột bóng rổ (Bài 23)
- Góc cất cánh máy bay (Bài 24)
- Độ dốc đường dành cho người khuyết tật (Bài 25)
- Khung hạn chế chiều cao ở đầu cầu vượt (Bài 26)
- Tính chiều cao giá đỡ ba chân (Bài 26)
- Chọn công suất điều hòa theo thể tích phòng (Bài 27)

### 4. STEM Challenge (Trung tâm của ứng dụng)
- **Quy trình kỹ thuật 7 bước EDP**: **ASK → MODEL → DESIGN → SIMULATE → BUILD → TEST → IMPROVE**.
- **Mô phỏng 3D thời gian thực (Three.js)**: Tương tác xoay 360°, điều chỉnh góc chéo $\theta$, tĩnh không an toàn $H$, chỉ thị trực quan đoạn vuông góc chung $MN$.
- **Tích hợp GeoGebra 3D**: Khung applet nhúng trực tiếp kèm bộ lệnh chuẩn để học sinh dựng và đo đạc.
- **⚡ Challenge Mode (Dành riêng cho học sinh chuyên)**:
  - *Bài toán tối ưu*: Tối ưu hóa dầm cầu và đường dốc, chứng minh cực tiểu chi phí vật liệu tại góc trực giao $\theta = 90^\circ$.
  - *So sánh phương án*: Ma trận định lượng cầu trực giao ($90^\circ$) vs cầu xiên góc ($45^\circ - 60^\circ$).
  - *Chứng minh toán học*: Chứng minh định lý đoạn vuông góc chung $MN$ là khoảng cách ngắn nhất giữa hai đường thẳng chéo nhau bằng giải tích vectơ $Oxyz$.

### 5. Quiz Center
- 22 câu hỏi tương tác theo cấu trúc đề thi mới.
- 2 chế độ: Luyện tập tự do & Thi tính giờ 25 phút, chấm điểm thang 10, phân tích ma trận đúng/sai.

### 6. References
- Bảng đối chiếu chi tiết giữa Trang SGK và Trang PDF tài liệu nguồn (`TOAN11_SGK_T2_C07.pdf`).
- Quy tắc sư phạm và hướng dẫn sử dụng.

---

## 🚀 Hướng dẫn kích hoạt GitHub Pages

1. Vào repository trên GitHub: `https://github.com/letambp2003-debug/hoctoan-chuong07-toan11-stem`
2. Chọn **Settings** $\to$ mục **Pages** (ở thanh menu bên trái).
3. Tại phần **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`
   - **Branch**: Chọn `main` và thư mục `/ (root)`
   - Bấm **Save**.
4. Sau 1–2 phút, trang web sẽ xuất hiện tại địa chỉ:
   `https://letambp2003-debug.github.io/hoctoan-chuong07-toan11-stem/`

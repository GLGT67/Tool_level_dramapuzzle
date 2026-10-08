# Drama Puzzle Level Editor

Công cụ hỗ trợ Game Designer, Level Designer và Content Creator xây dựng, trực quan hóa và kiểm thử các màn chơi giải đố tình huống drama (kịch tính) trực tiếp trên trình duyệt web.

Đường dẫn trải nghiệm trực tiếp: https://glgt67.github.io/Tool_level_dramapuzzle/

---

## Giới thiệu chung

Drama Puzzle Level Editor được phát triển nhằm tối ưu hóa quy trình thiết kế màn chơi giải đố cốt truyện theo hướng trực quan và khép kín. Công cụ loại bỏ hoàn toàn rào cản kỹ thuật phức tạp, giúp người làm game tập trung tối đa vào trải nghiệm gameplay và logic kịch bản.

Từ khâu định hình ý tưởng (Drama Hook & Main Reveal), dựng bối cảnh (Artboard & Reference Layer), bố trí nhân vật (Characters & Tray), viết cây manh mối (Clue Tree), thiết lập chuỗi phản ứng (Reaction Events) cho đến kiểm thử trực tiếp (Play Mode) và xuất bàn giao (Dev JSON, Asset Request XLSX, Scene PNG), mọi khâu đều được tích hợp đồng bộ trong một giao diện duy nhất.

---

## Tính năng chính

### 1. Artboard 1080x1610 và Bộ công cụ vẽ Vector
- Khung Artboard chuẩn tỷ lệ dọc điện thoại (1080 x 1610 px).
- Hỗ trợ dán ảnh tham khảo trực tiếp (Ctrl/Cmd+V) và quản lý nhiều lớp Reference Layer độc lập.
- Bộ ba công cụ vẽ chuyên sâu:
  - **Pencil (Bút chì):** Vẽ nét mảnh tự do, phản hồi tức thì, tối ưu cho việc phác thảo nhanh vị trí và ghi chú hiện trường.
  - **Brush (Cọ vẽ):** Nét cọ dày mượt mà, bo tròn hai đầu nét vẽ và hỗ trợ độ mờ đục mềm, phù hợp cho việc đánh dấu vùng không gian nghệ thuật.
  - **Pen (Bút mực Vector Bézier):** Cơ chế vẽ đường cong chuyên nghiệp tương tự Adobe Illustrator. Nhấp chuột tạo điểm neo (Anchor Point) góc nhọn, nhấp giữ và kéo chuột để kéo dài tay đòn cong Bézier hai bên. Khi rê chuột về điểm neo đầu tiên, hệ thống tự động khép kín đường vẽ (Close Path). Hỗ trợ chốt nét hở bằng phím Enter hoặc nút bấm chuyên dụng.
- **Tương tác và chỉnh sửa Path trực tiếp:** Nét vẽ sau khi hoàn tất trở thành đối tượng vector độc lập. Bấm công cụ Select để chọn nét, hiển thị toàn bộ điểm neo và tay đòn trên Artboard để kéo dời đỉnh hoặc nắn chỉnh độ cong bất cứ lúc nào.
- **Inspector chuyên sâu cho Vector & Path:** Tùy biến linh hoạt Stroke Color, Stroke Width, Opacity, Stroke Style (Solid, Dashed, Dotted), Closed Path, Fill Color bên trong, Z-Index và khóa đối tượng (Lock).
- Hỗ trợ các hình khối Vector cơ bản: Star, Triangle, Polygon, Circle, Rectangle, Line, Arrow và Text.
- Xem trước hình dạng thật khi vẽ (Live Shape Preview) và giữ phím Shift để khóa chuẩn tỷ lệ 1:1.

### 2. Quản lý Characters và Tray
- Phân loại nhân vật rõ ràng: Nhân vật di chuyển (M - Movable) và Nhân vật cố định (F - Fixed).
- Quản lý Character ID, Character Name, Gender (M/F/Other), Name Pool khi xáo trộn (Shuffle), Role và Ghi chú nội bộ.
- Thiết lập Initial Emotion, Initial Gaze và Gaze Target trực quan.
- Xác định vị trí đáp án (Solved Position) trực tiếp trên Artboard.
- Khay Tray nhân vật mô phỏng chính xác giao diện người chơi thực tế.

### 3. Cây manh mối Clue Tree
- Tổ chức cây manh mối nhiều tầng: Root Clues hiển thị sẵn từ đầu và Sub-Clues mở khóa khi điều kiện logic được đáp ứng.
- Hỗ trợ cú pháp thẻ token dạng {M01}, {F02} tự động đồng bộ theo tên nhân vật khi người chơi đổi tên hoặc xáo trộn ngẫu nhiên.
- Thiết lập điều kiện giải (Solve Requires) dựa trên vị trí đặt nhân vật đúng.

### 4. Chuỗi phản ứng kịch tính (Reaction Events)
- Điều kiện kích hoạt linh hoạt: Self Placed (bản thân được đặt đúng), Char Placed (nhân vật khác được đặt đúng) hoặc All Placed (tổ hợp nhân vật được đặt đúng).
- Chuỗi hành động tuần tự theo bước (Reaction Sequence): thay đổi nét mặt, đổi hướng mắt nhìn, đổi mục tiêu nhìn hoặc hiển thị biểu tượng thoại.

### 5. Kiểm tra luồng Logic (Logic Flow · Solve Graph)
- Tự động phân tích toàn bộ dữ liệu màn chơi để vẽ sơ đồ đồ thị giải đố (Solve Graph).
- Phát hiện trực quan các điểm nghẽn, ngõ cụt logic, manh mối không thể mở khóa hoặc điều kiện đặt bị mâu thuẫn trước khi chuyển giao sản xuất.

### 6. Linter kiểm tra lỗi (Check Level)
- Quét toàn diện tính toàn vẹn dữ liệu: kiểm tra thiếu thông tin bắt buộc, mã ID trùng lặp, tham chiếu rỗng hoặc tài nguyên chưa gắn kết.
- Phân loại cảnh báo theo mức độ nghiêm trọng giúp tinh chỉnh dữ liệu chính xác.

### 7. Chế độ Chơi thử (Play Mode Sandbox) & Test độ khó
- Chuyển đổi một chạm giữa Edit Mode và Play Mode mà không làm xê dịch bố cục Artboard hay thanh điều hướng.
- Mô phỏng chính xác cơ chế gameplay: kéo thả nhân vật từ Tray lên Artboard, trừ mạng khi đặt sai, kích hoạt phản ứng khi đặt đúng và kiểm tra điều kiện hoàn thành màn chơi.
- Module Test độ khó độc lập: Level Designer chơi thử trực tiếp, tự đánh giá cảm nhận thời gian/số lần thử, sau đó hệ thống đối chiếu với Target Difficulty ban đầu để đưa ra đề xuất cân bằng.

### 8. Ending & Prompt AI & Xuất dữ liệu Production
- Thiết lập màn kết thúc (Ending): tóm tắt bối cảnh, câu thoại chốt hạ (Ending Line) và nút phán quyết thưởng (Verdict CTA).
- Tự động sinh Prompt AI chuẩn tiếng Anh mô tả khoảnh khắc đắt giá nhất của drama để tạo ảnh kết thúc qua Midjourney / DALL-E / Stable Diffusion.
- Xuất dữ liệu bàn giao tiêu chuẩn:
  - **Dev JSON:** Cấu trúc dữ liệu chuẩn hóa nạp trực tiếp vào game engine (Unity / Cocos / Godot / Web).
  - **Asset Request XLSX:** Bảng kê chi tiết toàn bộ tài nguyên nền, nhân vật, biểu cảm và đạo cụ cho đội ngũ Artist.
  - **Scene PNG:** Ảnh chụp toàn cảnh khung cảnh Artboard kèm các lớp minh họa và ghi chú hiện trường.

---

## Bảng phím tắt và thao tác chuột

| Thao tác | Phím tắt / Cách thực hiện | Mô tả |
| :--- | :--- | :--- |
| Vẽ Bút chì / Cọ vẽ | Chọn Pencil / Brush rồi kéo chuột trên Artboard | Phác thảo nét tự do hoặc tô nét cọ dày |
| Đặt điểm neo Pen | Chọn Pen rồi nhấp chuột từng điểm | Tạo các điểm nối góc nhọn (Anchor Point) |
| Uốn cong nét vẽ Pen | Nhấp giữ và kéo chuột tại điểm neo | Tạo và kéo dài tay đòn Bézier hai bên |
| Khép kín đường Pen | Rê chuột về gần điểm neo đầu tiên | Tự động đóng đường vẽ thành hình khép kín |
| Chốt nét Pen hở | Phím Enter hoặc nhấp đúp chuột | Hoàn tất nét vẽ Pen dạng hở |
| Chọn nét vẽ / đối tượng | Chọn Select Tool rồi nhấp vào đối tượng | Mở Inspector và hiển thị điểm neo/tay đòn |
| Nắn chỉnh điểm neo | Kéo điểm neo hoặc tay đòn tròn trên Artboard | Tinh chỉnh vị trí đỉnh và độ cong của nét vẽ |
| Hủy nét đang vẽ | Phím Escape hoặc nút Hủy nét | Hủy các điểm đang vẽ dở của công cụ Pen |
| Về công cụ Chọn | Phím Escape khi không vẽ | Trở về Select Tool |
| Pan vùng nhìn Artboard | Giữ phím Space rồi kéo chuột, hoặc chuột giữa | Di chuyển khung nhìn Artboard |
| Zoom Artboard | Nút +, - ở góc dưới hoặc nút 1:1 | Phóng to, thu nhỏ hoặc đặt lại tỷ lệ chuẩn |
| Dán ảnh nhanh | Ctrl+V (Windows) / Cmd+V (macOS) | Dán ảnh trực tiếp từ bộ nhớ tạm vào Artboard |
| Khóa tỷ lệ 1:1 | Giữ phím Shift khi kéo chuột | Giữ chuẩn tỷ lệ vuông, tròn hoặc tỷ lệ ảnh |
| Quét chọn nhiều đối tượng | Kéo chuột trái trên vùng trống | Chọn đồng thời nhiều layer để dời vị trí |
| Căn chỉnh vị trí | Bảng nút Align trong Inspector | Căn lề trái, phải, trên, dưới hoặc tâm |
| Lật đối xứng | Nút Flip H hoặc Flip V | Lật ảnh hoặc đổi hướng nhìn nhân vật |
| Xoay đối tượng | Slider xoay hoặc nút +90 độ | Xoay góc đối tượng |
| Nhân bản đối tượng | Nút Duplicate hoặc giữ Alt rồi kéo chuột | Tạo bản sao của hình khối, nét vẽ, ảnh |
| Thứ tự hiển thị | Bring to Front / Send to Back / Forward / Backward | Điều chỉnh Z-Index của các layer |
| Xóa đối tượng | Phím Delete / Backspace hoặc nút Delete | Xóa layer đang chọn |

---

## Thông số kỹ thuật

- **Kích thước Artboard:** 1080 x 1610 px (chuẩn 9:16 dọc trên thiết bị di động).
- **Tỷ lệ ảnh Ending:** 4:3 ngang.
- **Trình duyệt tương thích:** Chrome, Edge, Firefox, Safari, Cốc Cốc (hỗ trợ đầy đủ Canvas API, SVG Path2D và Pointer Events).
- **Lưu trữ dữ liệu:** Dự án được lưu trực tiếp dưới dạng tệp JSON trên máy cục bộ, không phụ thuộc server và bảo mật tuyệt đối.

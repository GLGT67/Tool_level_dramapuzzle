# TÀI LIỆU KỸ THUẬT VÀ QUY CHUẨN MÃ NGUỒN (CODE GUIDE)
## DRAMA PUZZLE LEVEL EDITOR

---

## MỤC LỤC
1. [Kiến Trúc Tổng Thể và Vòng Đời Ứng Dụng](#1-kiến-trúc-tổng-thể-và-vòng-đời-ứng-dụng)
2. [Quy Chuẩn Mô Hình Dữ Liệu và Migration Lịch Sử](#2-quy-chuẩn-mô-hình-dữ-liệu-và-migration-lịch-sử)
3. [Logic Game và Hệ Thống Suy Luận](#3-logic-game-và-hệ-thống-suy-luận)
4. [Quản Lý Sân Khấu và Thao Tác Đối Tượng](#4-quản-lý-sân-khấu-và-thao-tác-đối-tượng)
5. [Bộ Công Cụ Vẽ và Thuật Toán Bézier Chuẩn Illustrator](#5-bộ-công-cụ-vẽ-và-thuật-toán-bézier-chuẩn-illustrator)
6. [Quy Chuẩn Xuất Bản và Tích Hợp Game](#6-quy-chuẩn-xuất-bản-và-tích-hợp-game)

---

## 1. KIẾN TRÚC TỔNG THỂ VÀ VÒNG ĐỜI ỨNG DỤNG

### 1.1. Cấu Trúc Trạng Thái Trung Tâm (Single Source of Truth)
Ứng dụng sử dụng một đối tượng trạng thái toàn cục duy nhất mang tên `data`:
- `data.level`: Chứa các cấu hình chung của màn chơi bao gồm `id`, `name`, `difficultyTarget` (EASY / MEDIUM / HARD), `lives` (mặc định cố định 2 mạng), `dramaHook`, `mainReveal`, `ending` và các thông tin sản xuất mỹ thuật (`production`).
- `data.characters`: Danh sách nhân vật tham gia màn chơi, phân tách thành hai nhóm: nhân vật di chuyển (Mxx) và nhân vật cố định (Fxx).
- `data.clues`: Cây manh mối phân cấp (Clue Tree), quản lý điều kiện hoàn tất và luồng suy luận.
- `data.reactionEvents`: Danh sách sự kiện phản ứng biểu cảm khi người chơi tương tác hoặc hoàn thành các bước suy luận.
- `data.images`: Danh sách các lớp ảnh tham khảo (Reference Layers) đặt trên sân khấu.
- `data.annotations`: Danh sách các đối tượng hình khối vector và đường vẽ tự do (Pencil, Brush, Pen, Shapes).

### 1.2. Cơ Chế Kết Xuất Phản Ứng (Reactive Rendering Loop)
- Mọi thao tác chỉnh sửa dữ liệu kích hoạt hàm `save()` để lưu trạng thái vào LocalStorage và lịch sử hoàn tác (Undo/Redo Stack).
- Hàm `render()` cập nhật toàn bộ giao diện: cây phân cấp bên trái, sân khấu trung tâm (Stage & Artboard), và bảng thuộc tính chi tiết bên phải (Inspector).
- Để tối ưu hóa hiệu năng và tránh hiện tượng giật khung hình, các thao tác kéo thả (drag & drop), vẽ nét hoặc co giãn kích thước sử dụng hàm kết xuất tức thời `renderLive()` hoặc vẽ trực tiếp trên thẻ Canvas HTML5, sau đó mới đồng bộ vào mô hình dữ liệu khi nhả chuột.

### 1.3. Cơ Chế Chuyển Đổi Chế Độ (Mode Switcher)
- **Chế độ Chỉnh sửa (EDIT):** Cho phép biên tập viên tự do thêm bớt nhân vật, vẽ hình khối, chỉnh sửa manh mối, thay đổi vị trí đáp án chuẩn trên Artboard.
- **Chế độ Chơi thử (PLAY):** Khóa toàn bộ các thao tác biên tập, đưa nhân vật về khay (Tray), cho phép người chơi thực hiện kéo thả thử nghiệm, kiểm tra cơ chế trừ mạng khi đặt sai, xem phản ứng biểu cảm tức thời và xác thực luồng giải đố. Khi rời khỏi PLAY về lại EDIT, phiên chơi chỉ tạm dừng (pause) mà không làm mất tiến trình đã tương tác.

---

## 2. QUY CHUẨN MÔ HÌNH DỮ LIỆU VÀ MIGRATION LỊCH SỬ

### 2.1. Chuẩn Hóa Nhân Vật (Characters)
- **Tiền tố ID và Loại:** Tiền tố ID và thuộc tính `type` luôn luôn được đồng bộ tuyệt đối:
  - Nhân vật di chuyển (Movable): Bắt buộc có ID dạng `M01`, `M02`, `M03`... Thuộc tính `type = "movable"`.
  - Nhân vật cố định (Fixed): Bắt buộc có ID dạng `F01`, `F02`, `F03`... Thuộc tính `type = "fixed"`.
- **Ràng Buộc Kích Hoạt Đặt Nhân Vật (Placement Triggers):** Chỉ có nhân vật di chuyển (Mxx) mới được phép tham gia vào điều kiện kích hoạt đặt vị trí (`placement-trigger`). Nếu dữ liệu cũ nhập vào chứa Fxx trong danh sách trigger thì hệ thống sẽ tự động dọn dẹp để ngăn chặn các trigger ẩn gây lỗi runtime.

### 2.2. Chuẩn Hóa Cây Manh Mối (Clue Schema)
- **Manh mối gốc (Root Clue):** Luôn ở trạng thái kích hoạt (Active) ngay khi bắt đầu màn chơi (START).
- **Manh mối con (Child Clue):** Tự động mở khi manh mối cha trực tiếp hoàn tất (Resolves). Thuộc tính `preOpen` chỉ quyết định việc manh mối con hiển thị dưới dạng giữ chỗ bị khóa (`LOCKED`) hay ẩn hoàn toàn khỏi giao diện (`HIDDEN`).
- **Main Drama Reveal:** Có thể được cấu hình gắn dưới một manh mối cụ thể như một kết quả tiết lộ đặc biệt. Nếu manh mối cha bị xóa, liên kết này sẽ tự động được dọn dẹp để tránh tham chiếu rác (dangling reference).

### 2.3. Lịch Sử Các Bản Vá Di Chuyển (Migrations)
- **V1.4:** Chuyển đổi dữ liệu phản ứng cũ thành mô hình chuẩn Sự Kiện Phản Ứng (Reaction Event) kết hợp Chuỗi Hành Động (Sequence).
- **V1.24.1:** Ngăn chặn nhân vật Fixed kích hoạt điều kiện giải.
- **V1.27:** Loại bỏ trạng thái `START` khỏi danh sách Reaction, gộp trạng thái này vào trạng thái ban đầu (Initial State). Ở bước cuối của chuỗi phản ứng, nếu dữ liệu cũ cấu hình không giữ lại (hold=false), hệ thống tự động gán biểu cảm gốc (BASE) làm bước kết thúc.
- **V1.28:** Cố định 2 mạng cho toàn bộ trò chơi, chuẩn hóa hệ thống định hướng ánh nhìn (Gaze Target).
- **V1.29:** Loại bỏ trường dữ liệu `Scene Evidence` khỏi phần biên tập để tinh giản dữ liệu, logic chuyển hoàn toàn sang quản lý theo cây manh mối và điều kiện vị trí đặt.

---

## 3. LOGIC GAME VÀ HỆ THỐNG SUY LUẬN

### 3.1. Hệ Thống Định Hướng Ánh Nhìn (Gaze Target System)
- Hướng nhìn của nhân vật được tự động tính toán dựa trên vector vị trí giữa nhân vật và đối tượng mục tiêu, sau đó quy chuẩn về 12 cung giờ đồng hồ (Clockwise 1–12h).
- Khi hiển thị bong bóng biểu cảm:
  - Nếu hướng nhìn quay sang trái: Mũi tên được xếp phía trước để hướng về mục tiêu (ví dụ: `target ← biểu cảm`).
  - Nếu hướng nhìn quay sang phải hoặc các hướng khác: Mũi tên được xếp phía sau (ví dụ: `biểu cảm → target`).
- Trong chế độ Chơi thử (PLAY), tên của mục tiêu bị ẩn để đảm bảo tính thử thách và góc nhìn của người chơi.

### 3.2. Chuỗi Phản Ứng (Reaction Sequences)
- Sự kiện phản ứng được kích hoạt dựa trên các điều kiện:
  - `SELF_PLACED`: Kích hoạt khi chính nhân vật đó được thả đúng vị trí. Chỉ áp dụng cho nhân vật di chuyển (Mxx).
  - `CHAR_PLACED`: Kích hoạt khi một nhân vật khác được đặt đúng vị trí.
  - `ALL_PLACED`: Kích hoạt khi tất cả nhân vật trong màn chơi đã được xếp đúng.
- Khi một phản ứng mới xảy ra, nó sẽ ngắt ngay chuỗi phản ứng đang chạy của cùng nhân vật đó để thực thi phản ứng mới nhất.

### 3.3. Cơ Chế Chẩn Đoán Độ Khó (Difficulty Diagnosis)
- Biên tập viên đặt ra mục tiêu độ khó ban đầu (`difficultyTarget`: Dễ, Vừa, Khó).
- Sau khi thực hiện kiểm thử thực tế toàn bộ màn chơi (Full Play), biên tập viên trả lời 3 câu hỏi đánh giá độc lập về:
  1. Cảm nhận độ khó tổng thể.
  2. Số lượng lựa chọn khả dĩ trước nước đi khó nhất.
  3. Số lượng nguồn thông tin cần kết hợp cùng lúc.
- Hệ thống thực hiện ma trận đối chiếu khách quan giữa cảm nhận sau chơi và mục tiêu ban đầu để đưa ra khuyến nghị tinh chỉnh.

---

## 4. QUẢN LÝ SÂN KHẤU VÀ THAO TÁC ĐỐI TƯỢNG

### 4.1. Quy Chuẩn Tọa Độ và Kích Thước Artboard
- Artboard tiêu chuẩn có kích thước cố định `1080 × 1610` px (tỉ lệ màn hình dọc chuẩn game casual).
- Tất cả các đối tượng (nhân vật, ảnh tham khảo, nét vẽ vector) đều được lưu trữ theo hệ tọa độ phẳng tuyệt đối so với góc trên bên trái của Artboard.

### 4.2. Cơ Chế Cuộn Viền Tự Động (Auto-Wrap Boundary 60%)
- Khi người dùng kéo một hình ảnh hoặc đối tượng ra ngoài biên Artboard quá ngưỡng 60% kích thước của nó:
  - Vượt quá 60% sang trái (`curX <= -0.6 * width`): Tự động chuyển tọa độ sang mép phải Artboard.
  - Vượt quá 60% sang phải (`curX >= 1080 - 0.4 * width`): Tự động chuyển tọa độ sang mép trái Artboard.
  - Vượt quá 60% lên trên (`curY <= -0.6 * height`): Tự động chuyển tọa độ sang mép dưới Artboard.
  - Vượt quá 60% xuống dưới (`curY >= 1610 - 0.4 * height`): Tự động chuyển tọa độ sang mép trên Artboard.
- Cơ chế này đảm bảo không bao giờ có đối tượng nào bị kéo trôi mất khỏi vùng nhìn thấy của biên tập viên.

### 4.3. Thao Tác Co Giãn và Nhân Bản Đối Tượng
- **Khóa Tỷ Lệ Chuẩn (Shift Key):** Khi giữ phím Shift trong lúc thay đổi kích thước hoặc vẽ hình khối, hệ thống tự động khóa tỷ lệ 1:1 hoặc tỷ lệ khung hình gốc ban đầu.
- **Nhân Bản Nhanh (Alt + Drag):** Giữ phím Alt trong khi nhấp giữ và kéo đối tượng sẽ tự động tạo một bản sao tại vị trí mới mà không làm mất đối tượng ban đầu.
- **Quản Lý Lớp Hiển Thị (Z-Index):** Cả ảnh tham khảo và các hình vẽ vector đều nằm chung trong hệ thống phân tầng thống nhất, hỗ trợ các thao tác: Lên trên cùng, Xuống dưới cùng, Lên một lớp và Xuống một lớp.

---

## 5. BỘ CÔNG CỤ VẼ VÀ THUẬT TOÁN BÉZIER CHUẨN ILLUSTRATOR

### 5.1. Phân Loại Bộ Ba Công Cụ Vẽ
- **Bút Chì (Pencil Tool):** Thu thập chuỗi điểm di chuyển tự do với nét vẽ mỏng và độ dày thanh thoát, lưu trữ dưới dạng mảng điểm rời rạc.
- **Cọ Vẽ (Brush Tool):** Nét vẽ tự do mềm mại với độ dày lớn hơn, phục vụ phác thảo ý tưởng nhanh hoặc đánh dấu khu vực.
- **Bút Mực Vector (Pen Tool):** Tạo đường vẽ thông qua các điểm neo (Anchor Points) và tay đòn Bézier điều khiển độ cong hai phía (`cp1` và `cp2`).

### 5.2. Thuật Toán Ngắt Tay Đòn và Bẻ Góc Nhọn (Handle Retraction)
- Khi đang vẽ đường cong bằng Pen Tool, nếu người dùng nhấp chuột trực tiếp vào điểm neo cuối cùng vừa tạo (`lastPt` trong bán kính 16px):
  - **Trường hợp có tay đòn cong phía trước:** Hệ thống thu hồi tay đòn `cp2` về trùng với tọa độ điểm neo (`lastPt.cp2 = { x: lastPt.x, y: lastPt.y }`), trong khi vẫn bảo toàn nguyên vẹn tay đòn phía sau `cp1`. Điểm neo được chuyển thành góc nhọn (Corner Point). Điểm tiếp theo được vẽ sẽ nối bằng đường thẳng góc nhọn sắc nét, loại bỏ hoàn toàn hiện tượng uốn cong lặp vòng 360 độ.
  - **Trường hợp đã là góc nhọn:** Nhấp tiếp vào chính điểm này sẽ kết thúc sớm đường vẽ (`finishPenPath`) và lưu vào danh sách đối tượng.
- **Tự Động Khép Kín Hình Dạng (Close Path):** Khi rê chuột về gần điểm neo đầu tiên (`penActivePoints[0]` trong bán kính 16px) sau khi đã vẽ từ 3 điểm trở lên, hệ thống sẽ kích hoạt chỉ báo khép kín và tự động đóng nét vẽ thành một đa giác kín, cho phép tô màu nền (Fill Color).

### 5.3. Thao Tác Điểm Neo Nâng Cao
- Khi sử dụng công cụ Chọn (Select Tool), nhấp vào hình vẽ sẽ hiển thị các chốt điểm neo và thanh tay đòn Bézier.
- Giữ phím `Alt` khi kéo tay đòn cho phép ngắt góc độc lập (chỉ uốn cong một phía mà không làm lệch phía đối diện).
- Thao tác `Alt + Click` vào một điểm neo hiện có sẽ chuyển đổi qua lại giữa trạng thái góc nhọn (Corner) và góc cong mượt (Smooth).

---

## 6. QUY CHUẨN XUẤT BẢN VÀ TÍCH HỢP GAME

### 6.1. Runtime Dev JSON
- Tệp JSON xuất ra dành cho lập trình viên Client/Engine chỉ chứa các trường thông tin runtime cần thiết:
  - Thông số màn chơi: `levelId`, `lives = 2`, `hook`, `dialogue`.
  - Danh sách nhân vật với Asset ID tham chiếu, tọa độ đáp án (`solvedX`, `solvedY`), hướng nhìn và biểu cảm khởi đầu.
  - Cây manh mối với điều kiện giải (`resolveWhen`).
  - Danh sách sự kiện phản ứng và thứ tự thực thi.
- Tất cả các trường metadata chỉ phục vụ lúc biên tập (như ghi chú của Artist, thông số bộ lọc ảnh thử nghiệm) đều được lược bỏ để tối ưu dung lượng tệp và tốc độ nạp game.

### 6.2. Tài Liệu Yêu Cầu Tài Nguyên Mỹ Thuật (Asset Request XLSX)
- Tự động xuất bảng tổng hợp toàn bộ các asset cần thiết cho màn chơi dưới định dạng Excel (.xlsx), bao gồm:
  - Sprite nhân vật (Base Asset, Tray Asset, các biểu cảm theo từng ID).
  - Background chính và các đạo cụ tách lớp (Baked BG, Foreground, Props).
  - Tỉ lệ khung hình, kích thước đề xuất và các ghi chú mỹ thuật đính kèm.

### 6.3. Khung Cảnh Kết Màn và Sinh Câu Lệnh Trợ Lý AI (Ending & Prompt Maker)
- Tạo ảnh kết cục với tỉ lệ khung hình ngang tiêu chuẩn `4:3`.
- Tự động sinh câu lệnh prompt chi tiết bằng tiếng Anh (phù hợp với các mô hình Midjourney / Stable Diffusion / DALL-E) dựa trên bối cảnh drama, nhân vật tham gia và cảm xúc đỉnh điểm của màn chơi.
- Cung cấp câu thoại chốt hạ (Ending Line) và nút bấm phán quyết người chơi (CTA Verdict) phục vụ tăng tỷ lệ giữ chân người chơi (Retention).

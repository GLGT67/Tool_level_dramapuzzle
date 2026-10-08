# Drama Puzzle Level Editor - Bản đặc tả kỹ thuật hệ thống V1.37

Hệ thống công cụ kỹ thuật hỗ trợ thiết kế màn chơi, trực quan hóa kịch bản giải đố logic và kiểm thử tương tác vận hành hoàn toàn trên trình duyệt web phía máy khách.

Địa chỉ triển khai trực tiếp: https://glgt67.github.io/Tool_level_dramapuzzle/

---

## 1. Kiến trúc phần mềm và nguyên lý phân rã module

Nhằm đảm bảo hiệu năng xử lý, khả năng bảo trì lâu dài và tối ưu hóa chi phí ngữ cảnh khi phát triển với các công cụ tự động hóa, mã nguồn hệ thống được phân tách thành các module độc lập theo trách nhiệm cụ thể:

- **index.html (xấp xỉ 19 KB):** Khung cấu trúc ngữ nghĩa tinh gọn, loại bỏ toàn bộ dữ liệu mẫu nhúng trực tiếp, liên kết tài nguyên thông qua các thẻ chuẩn.
- **css/style.css (xấp xỉ 38 KB):** Hệ thống giao diện làm việc chuyên nghiệp, bao gồm hệ thống lưới, bảng điều khiển công cụ, các hộp thoại chức năng và định dạng hiển thị cho sàn diễn.
- **js/app.js (xấp xỉ 196 KB):** Động cơ xử lý logic cốt lõi: quản lý tương tác trên sàn diễn, hệ thống công cụ đồ họa vector, bảng thanh tra thuộc tính, thuật toán phân tích cây suy luận và cơ chế mô phỏng chơi thử.
- **data/sample_levels.js (xấp xỉ 12 MB):** Kho lưu trữ dữ liệu tĩnh và hình ảnh mã hóa chuỗi cơ sở của các màn chơi mẫu, được cô lập hoàn toàn để không ảnh hưởng đến tốc độ phân tích mã nguồn chính.

---

## 2. Động cơ đồ họa vector và xử lý hình học

Hệ thống tích hợp bộ công cụ đồ họa vector chuyên dụng phục vụ việc phác thảo bối cảnh và bố cục màn chơi với các tính năng kỹ thuật nâng cao:

### Cơ chế hiển thị bóng thực thể động khi kéo vẽ
- Khi người dùng chọn công cụ hình học và kéo chuột trên sàn diễn, hệ thống tự động khởi tạo và kết xuất bóng xem trước thời gian thực bằng chính phần tử vector tương ứng thay vì dùng khung bao chữ nhật ước lượng.
- Các hình dạng được hỗ trợ kết xuất động bao gồm: Ngôi sao năm cánh, Lục giác đều, Tam giác cân, Hình tròn, Đoạn thẳng, Mũi tên chỉ dẫn và Hình chữ nhật.
- Tọa độ, kích thước và góc đỉnh của hình khối được tính toán chính xác theo thời gian thực dựa trên độ dịch chuyển con trỏ chuột.

### Ràng buộc tỷ lệ khung hình chuẩn
- Khi người dùng giữ phím Shift trong quá trình kéo vẽ hình mới, hệ thống tự động áp dụng ràng buộc tỷ lệ khung hình vuông cân bằng: chiều rộng và chiều cao được khóa bằng giá trị độ lệch cực đại theo hai trục tọa độ.
- Khi thay đổi kích thước các đối tượng đã có trên sàn diễn thông qua các điểm điều khiển neo, việc giữ phím Shift sẽ khóa cứng tỷ lệ khung hình ban đầu, ngăn chặn hiện tượng biến dạng hoặc méo hình.

### Hệ thống thuộc tính hình học và xử lý bề mặt
- **Điều chỉnh bo góc:** Hỗ trợ tinh chỉnh bán kính góc lượn của hình chữ nhật từ 0 đến 60 điểm ảnh trực tiếp từ thanh điều khiển thuộc tính.
- **Đặc tính nét vẽ viền:** Cho phép thiết lập độ dày nét vẽ từ 1 đến 30 điểm ảnh với các kiểu hiển thị: Nét liền, Nét đứt và Nét chấm bi.
- **Bộ lọc và hiệu ứng đồ họa:** Hỗ trợ các chế độ hòa trộn lớp màu, điều chỉnh độ sáng, độ tương phản, độ bão hòa, độ mờ đục và bóng đổ ngoại vi.
- **Cơ chế cuộn biên tự động:** Khi đối tượng đồ họa bị di chuyển vượt qua giới hạn biên sàn diễn quá 60% kích thước, hệ thống tự động tính toán tọa độ bù trừ để đưa đối tượng xuất hiện ở biên đối diện.

---

## 3. Kiến trúc giao diện tĩnh và ổn định bố cục

Hệ thống được thiết kế theo nguyên tắc giao diện làm việc ổn định, bảo toàn không gian hiển thị của sàn diễn qua các chế độ vận hành:

- **Khóa tĩnh bố cục tuyệt đối:** Độ dịch chuyển vị trí của thanh tiêu đề trên cùng và sàn diễn trung tâm được duy trì ở mức 0 điểm ảnh khi chuyển đổi qua lại giữa chế độ biên tập và chế độ chơi thử.
- **Tích hợp cụm điều khiển chơi thử:** Nút chuyển đổi chế độ và các nút điều hướng phiên chơi được bố trí trực tiếp tại thanh công cụ của sàn diễn, đồng cấp với chỉ số mạng, loại bỏ hiện tượng thay đổi kích thước trên thanh điều hướng chính.
- **Bản địa hóa ngôn ngữ kỹ thuật chuẩn xác:** Toàn bộ giao diện người dùng, nhãn thuộc tính, hộp thoại chức năng và hướng dẫn thao tác được chuyển đổi hoàn toàn sang tiếng Việt kỹ thuật chuẩn mực, loại bỏ các cụm từ ngoại ngữ chú thích trong ngoặc đơn.

---

## 4. Hệ thống phân tích logic kịch bản và chẩn đoán độ khó

### Phân tích đồ thị suy luận logic
- Động cơ tự động quét toàn bộ cây manh mối của màn chơi để xây dựng đồ thị liên kết điều kiện.
- Phân biệt rõ ràng giữa các nhánh điều kiện kết hợp đồng thời và các nhánh điều kiện thay thế.
- Tự động phát hiện các điểm nghẽn logic, các manh mối mồ côi hoặc các trạng thái không thể giải quyết trước khi xuất bản kịch bản sang giai đoạn sản xuất.

### Mô phỏng chơi thử và đánh giá độ khó
- Cung cấp môi trường kiểm thử trực tiếp kịch bản với đầy đủ quy tắc trò chơi: tự động xáo trộn vị trí các thẻ nhân vật, trừ mạng khi đặt sai vị trí và kích hoạt các phản ứng biểu cảm kịch tính.
- Hộp thoại phân tích độ khó cho phép ghi nhận cảm nhận sau phiên chơi thử để đối chiếu với thông số độ khó mục tiêu ban đầu.

### Thiết kế màn kết thúc và tổng hợp đặc tả mỹ thuật
- Hỗ trợ xây dựng khung hình tổng kết màn chơi theo tỷ lệ chuẩn 4:3.
- Tự động tổng hợp thông tin kịch bản, nhân vật và bối cảnh thành câu lệnh đặc tả mỹ thuật chi tiết, hỗ trợ tạo hình minh họa kết màn thông qua các công cụ sinh ảnh tự động.

---

## 5. Xuất bản dữ liệu kỹ thuật

Hệ thống cung cấp quy trình kiểm định và đóng gói dữ liệu phục vụ các bộ phận phát triển liên quan:

- **Bộ kiểm tra tính toàn vẹn:** Rà soát tự động toàn bộ mã định danh nhân vật, tính hợp lệ của cây manh mối và các liên kết tài nguyên trước khi cho phép xuất tệp.
- **Dữ liệu kịch bản dạng JSON:** Cấu trúc dữ liệu chuẩn hóa, sẵn sàng nạp trực tiếp vào các bộ công cụ phát triển trò chơi đa nền tảng như Unity, Cocos hoặc Godot.
- **Bảng danh mục tài nguyên dạng bảng tính:** Tự động tổng hợp danh sách nhân vật, các trạng thái biểu cảm, hướng nhìn và danh mục đạo cụ bàn giao cho bộ phận đồ họa.
- **Tệp hình ảnh chụp sàn diễn và màn kết:** Cung cấp ảnh chụp chất lượng cao phục vụ việc lưu trữ tài liệu thiết kế trò chơi.

---

## 6. Quy chuẩn kiểm thử tự động và kiểm soát chất lượng mã nguồn

Nhằm duy trì độ tin cậy của phần mềm trong suốt quá trình phát triển, dự án áp dụng quy chuẩn kiểm thử nghiêm ngặt:

- **Môi trường kiểm thử tự động cô lập:** Toàn bộ các kịch bản kiểm thử giao diện người dùng tự động trên trình duyệt không giao diện và các tệp ảnh kết quả nghiệm thu được quy hoạch vào thư mục riêng biệt.
- **Kiểm soát tệp loại trừ:** Cấu hình tệp loại trừ của hệ thống quản lý phiên bản ngăn chặn hoàn toàn việc lưu vết các tệp rác, nhật ký kiểm thử tạm thời và ảnh chụp màn hình kiểm tra vào nhánh mã nguồn chính.
- **Quy tắc cập nhật tài liệu kỹ thuật:** Sau mỗi lần lưu vết quan trọng trên hệ thống quản lý phiên bản, bản mô tả kỹ thuật của hệ thống bắt buộc phải được rà soát và cập nhật mới nhằm phản ánh chính xác trạng thái kiến trúc và tính năng hiện tại.

---

## 7. Bảng phím tắt thao tác nhanh

| Thao tác | Phím tắt hoặc chuột | Chức năng kỹ thuật |
| :--- | :--- | :--- |
| Di chuyển vùng nhìn | Phím cách kèm kéo chuột hoặc nút chuột giữa | Dịch chuyển tọa độ sàn diễn tự do |
| Thu phóng vùng nhìn | Nút thu phóng hoặc chọn tỷ lệ chuẩn | Điều chỉnh tỷ lệ hiển thị từ 50% đến 200% |
| Dán ảnh nhanh | Phím tắt dán dữ liệu | Nạp ảnh trực tiếp từ bộ nhớ tạm vào sàn diễn |
| Khóa tỷ lệ khung hình | Giữ phím Shift khi kéo vẽ hoặc thay đổi kích thước | Khóa tỷ lệ hình học 1:1 hoặc duy trì tỷ lệ gốc |
| Chọn nhiều đối tượng | Kéo chuột trái trên vùng trống | Quét vùng chọn đa đối tượng |
| Căn lề tự động | Thanh công cụ căn lề nhanh | Căn thẳng hàng các đối tượng theo các trục |
| Lật đối xứng | Nút lật ngang hoặc lật dọc | Phản chiếu đối tượng qua trục trung tâm |
| Xoay đối tượng | Thanh trượt xoay hoặc nút quay góc vuông | Xoay góc đối tượng từ 0 đến 360 độ |
| Nhân bản đối tượng | Nút nhân bản hoặc giữ phím Alt kèm kéo chuột | Tạo bản sao đối tượng tức thì |
| Sắp xếp thứ tự lớp | Nút chuyển lên trên hoặc chuyển xuống dưới | Điều chỉnh chỉ số độ sâu hiển thị của đối tượng |
| Xóa đối tượng | Phím xóa | Loại bỏ đối tượng đang được chọn |
| Hoàn tác thao tác | Phím tắt hoàn tác | Phục hồi trạng thái sàn diễn trước đó |

---

## 8. Thông số kỹ thuật môi trường

- **Kích thước khung nhìn sàn diễn:** 1080 x 1610 điểm ảnh (chuẩn màn hình dọc tỷ lệ 9:16).
- **Tỷ lệ khung ảnh kết thúc:** Tỷ lệ ngang 4:3.
- **Môi trường vận hành:** Hoàn toàn phía máy khách trên nền tảng HTML5, CSS3 và JavaScript hiện đại; không yêu cầu máy chủ xử lý trung gian.
- **Lưu trữ và trao đổi dữ liệu:** Nhập và xuất dữ liệu thông qua tệp định dạng JSON trực tiếp trên bộ nhớ thiết bị người dùng.
- **Phân tách kiểm thử:** Thư mục kiểm thử tự động được tách biệt độc lập thông qua cấu hình loại trừ của hệ thống quản lý phiên bản.

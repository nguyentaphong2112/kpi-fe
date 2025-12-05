# HCM fontend web
hcm frontend web angular

Các thành phần structure project:
-src/app/core:
+apis

-common urls: chứa các url dùng toàn project
-http-intercepter: nơi xử lý các mã lỗi trả về từ api, authorized.... với chức năng phê duyệt và đánh chặn 
-http-wapper: chứa các method call api(get, post...)  theo phương thức call api
+utils: chứa các hàm dùng chung cho toàn project 
-src/app/shared:
+components: 
-Chứa các components dùng chung  cho toàn project
+directive : 
-Tạo ra html data binding theo ý mong muốn
+pipe:
-Tạo ra các dạng filter data theo ý mong muốn mà  cho toàn project 
-src/app/app-routing.module:
Chứa root routing cho các domain chính của project 
-src/app/app.module.ts:
Chứa toàn bộ khai báo dùng chung thuộc toàn bộ component 
-src/app/pages:
Chứa các feature phát triền của project
+service:
Gọi api cho các pages của project
+models: 
Chứa kiểu dữ liệu cho các pages của project
-styles:
Toàn bộ những css dùng chung: color, variable...
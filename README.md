# Internship project

> Dự án thực tập xây dựng website bán sách trực tuyến, sử dụng Vue 3 + Vite cho frontend và JSON Server làm backend giả lập.  
> Ứng dụng cho phép người dùng xem sản phẩm, tìm kiếm, thêm vào giỏ hàng, đăng nhập, và đặt hàng.

# Spotlight project

- **BookStore** là một ứng dụng mô phỏng **nền tảng thương mại điện tử** chuyên về bán sách.  
  Dự án giúp sinh viên rèn luyện kỹ năng phát triển ứng dụng web với giao diện hiện đại, thân thiện,  
  và tích hợp API đơn giản để xử lý dữ liệu sách và người dùng.

# Main function

- Home: Hiển thị banner/logo và menu điều hướng: Home, Sản phẩm, Giỏ hàng, Đăng nhập/Đăng ký và 1 số sản phẩm nổi bật
- Danh sách sản phẩm: Hiển thị danh sách sách có chức năng tìm kiếm, filter và pagination
- Chi tiết sản phẩm: Hiển thị chi tiết sản phẩm gồm thông tin sản phẩm và nút mua sản phẩm và thêm vào giỏ hàng
- Giỏ hàng: Hiển thị sản phẩm đã thêm vô sản phẩm gồm tăng giảm số lượng sản phẩm, hiển thị tổng tiền và nút thanh toán
- Đăng nhập: Nhập username, password --> lưu vào Pinia, truy cập vào Cart và Checkout
- Đăng ký: Form đăng ký sẽ gồm username, email và password
- Thanh toán: Nhập tên, địa chỉ, số điện thoại → hiển thị lại giỏ hàng → nhấn Đặt hàng → xóa giỏ → chuyển đến trang Cảm ơn.
- Trang admin: Thêm/sửa/xóa sản phẩm, quản lý đơn hàng. Chỉ admin đăng nhập mới truy cập được.
- Biểu đồ doanh thu: Biểu đồ doanh thu: hiển thị doanh thu (fake data).
- Biểu đồ bán chạy: Hiển thị số lượng sản phẩm bán chạy

## Technology used

| **Frontend Framework** | [Vue.js](https://vuejs.org/) |
| **Quản lý trạng thái** | [Pinia](https://pinia.vuejs.org/) |
| **Định tuyến** | [Vue Router](https://router.vuejs.org/) |
| **Công cụ build** | [Vite](https://vitejs.dev/) |
| **Giao diện người dùng** | [Bootstrap 5](https://getbootstrap.com/) |
| **Backend giả lập** | [JSON Server](https://github.com/typicode/json-server) |
| **Ngôn ngữ lập trình** | JavaScript |
| **Trình quản lý gói** | npm |

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/)
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

"# BookStore Project"

#### Directory structure

BookStore/
│
├── public/ # Chứa favicon, logo, index.html
│
├── src/ # Thư mục mã nguồn chính
│ ├── assets/ # Hình ảnh, icon, file tĩnh
│ │
│ ├── components/ # Các component giao diện chia nhỏ
│ │ ├── Admin/ # Quản trị: thêm/sửa/xóa sản phẩm, đơn hàng
│ │ ├── Cart/ # Giỏ hàng: tăng giảm số lượng, xóa, thanh toán
│ │ ├── Checkout/ # Trang thanh toán: nhập thông tin đặt hàng
│ │ ├── Home/ # Trang chủ: banner, danh mục, sản phẩm nổi bật
│ │ └── House/ # Layout chính cho người dùng
│ │ ├── Footer/ # Chân trang
│ │ ├── Header/ # Thanh điều hướng (navbar, logo, menu)
│ │ └── MainContent/ # Nội dung chính hiển thị theo route
│ │
│ ├── Router/ # Cấu hình định tuyến (Vue Router)
│ │ ├── AuthLayout.vue # Layout cho các trang đăng nhập/đăng ký
│ │ ├── DefaultLayout.vue # Layout mặc định cho trang người dùng
│ │ └── House.vue # Trang hiển thị chung layout chính
│ │
│ ├── ProductList/ # Trang danh sách sản phẩm (search, filter, pagination)
│ ├── ProductDetail/ # Trang chi tiết sản phẩm (mô tả, thêm giỏ hàng)
│ ├── LoginAndRegister/ # Đăng nhập / Đăng ký người dùng
│ │
│ ├── App.vue # Component gốc của ứng dụng
│ └── main.js # File khởi tạo ứng dụng Vue
│
├── package.json # Cấu hình và dependencies của dự án
├── vite.config.js # Cấu hình Vite
└── README.md # Tài liệu mô tả dự án

##### Training skills
- Xây dựng ứng dụng theo **mô hình component-based**  
- Quản lý trạng thái với **Pinia**  
- Điều hướng & bảo vệ route bằng **Vue Router**  
- Thực hiện **CRUD** với dữ liệu mô phỏng (JSON Server)  
- Thiết kế **responsive** bằng Bootstrap 5  
- Quản lý logic **đăng nhập / đăng ký / giỏ hàng**  
- Viết mã **sạch, có chú thích, dễ mở rộng**
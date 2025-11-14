<template>
  <section class="about-section py-5">
    <div class="container">
      <h1 class="text-center mb-5 wow fadeInDown">Giới Thiệu Về Chúng Tôi</h1>

      <div class="row align-items-center">
        <!-- Ảnh -->
        <div class="col-md-6 mb-4 mb-md-0 wow fadeInLeft">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
            alt="Giới thiệu"
            class="img-fluid rounded shadow-lg about-img"
          />
        </div>

        <!-- Nội dung -->
        <div class="col-md-6 wow fadeInRight">
          <h2 class="text-primary mb-4">
            <i class="fas fa-book-open me-2"></i> Chúng tôi là ai?
          </h2>
          <p class="lead">
            Chào mừng bạn đến với cửa hàng sách của chúng tôi! Chúng tôi cam kết mang đến
            những đầu sách chất lượng và đa dạng thể loại, phục vụ mọi nhu cầu đọc của
            bạn.
          </p>

          <div class="row my-4">
            <div class="col-6 mb-3 d-flex align-items-center">
              <i class="fas fa-star fa-2x text-warning me-3"></i>
              <div>
                <h5 class="mb-1">Chất lượng hàng đầu</h5>
                <small>Sách chuẩn, bản quyền đầy đủ</small>
              </div>
            </div>
            <div class="col-6 mb-3 d-flex align-items-center">
              <i class="fas fa-shipping-fast fa-2x text-success me-3"></i>
              <div>
                <h5 class="mb-1">Giao hàng nhanh</h5>
                <small>Giao nhanh toàn quốc, đúng hẹn</small>
              </div>
            </div>
            <div class="col-6 mb-3 d-flex align-items-center">
              <i class="fas fa-headset fa-2x text-info me-3"></i>
              <div>
                <h5 class="mb-1">Hỗ trợ 24/7</h5>
                <small>Đội ngũ tư vấn tận tình mọi lúc</small>
              </div>
            </div>
            <div class="col-6 mb-3 d-flex align-items-center">
              <i class="fas fa-heart fa-2x text-danger me-3"></i>
              <div>
                <h5 class="mb-1">Yêu sách như bạn</h5>
                <small>Chúng tôi đam mê và tận tâm</small>
              </div>
            </div>
          </div>

          <h2 class="text-primary mt-4 mb-3">
            <i class="fas fa-bullseye me-2"></i> Sứ mệnh của chúng tôi
          </h2>
          <p>
            Lan tỏa văn hóa đọc và kết nối cộng đồng yêu sách rộng khắp. Chúng tôi luôn nỗ
            lực xây dựng môi trường mua sắm thân thiện và tiện lợi nhất.
          </p>

          <h2 class="text-primary mt-4 mb-3">
            <i class="fas fa-envelope me-2"></i> Liên hệ
          </h2>
          <p>
            Email: <a href="mailto:support@bookstore.com">support@bookstore.com</a><br />
            Điện thoại: <strong>0123 456 789</strong>
          </p>

          <button class="btn btn-gradient mt-4 px-4 py-2" @click="contactUs">
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function contactUs() {
  // Ví dụ chuyển đến trang liên hệ
  router.push("/contact");
}
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.about-section {
  border-radius: 15px;
  box-shadow: 0 10px 25px rgb(0 0 0 / 0.1);
}

.about-img {
  border-radius: 20px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
  transition: transform 0.3s ease;
}
.about-img:hover {
  transform: scale(1.05) rotate(1deg);
}

h1,
h2 {
  font-weight: 700;
}

.lead {
  font-size: 1.15rem;
  color: #055160;
}

.btn-gradient {
  background: linear-gradient(90deg, #0d6efd, #6610f2);
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 6px 12px rgb(13 110 253 / 0.5);
  transition: background 0.4s ease, transform 0.3s ease;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #6610f2, #0d6efd);
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgb(102 16 242 / 0.7);
}

@media (max-width: 767px) {
  .about-section {
    border-radius: 0;
  }
}
</style>

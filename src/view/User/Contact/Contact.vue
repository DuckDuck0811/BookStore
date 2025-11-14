<template>
  <section class="contact-info-section py-5">
    <div class="container">
      <h1 class="text-center mb-5">Liên hệ với chúng tôi</h1>

      <div class="row gy-4">
        <div class="col-md-6">
          <h3 class="mb-4">Thông tin liên hệ</h3>
          <ul class="list-unstyled fs-5">
            <li class="mb-3 d-flex align-items-center">
              <i class="bi bi-geo-alt-fill me-3 fs-3 text-primary"></i>
              <span>123 Đường ABC, Quận Bắc Từ Liêm, Thành phố Hà Nội, Việt Nam</span>
            </li>
            <li class="mb-3 d-flex align-items-center">
              <i class="bi bi-telephone-fill me-3 fs-3 text-primary"></i>
              <span>+84 123 456 789</span>
            </li>
            <li class="mb-3 d-flex align-items-center">
              <i class="bi bi-envelope-fill me-3 fs-3 text-primary"></i>
              <span>contact@company.com</span>
            </li>
            <li class="mb-3 d-flex align-items-center">
              <i class="bi bi-clock-fill me-3 fs-3 text-primary"></i>
              <span>Thứ 2 - Thứ 6: 8h00 - 17h00</span>
            </li>
          </ul>

          <h3 class="mb-3">Mạng xã hội</h3>
          <div class="social-icons fs-3 mb-5">
            <a href="#" aria-label="Facebook" class="me-3 text-primary">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter" class="me-3 text-info">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" class="me-3 text-danger">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn" class="text-primary">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        <div class="col-md-6">
          <h3 class="mb-4">Gửi tin nhắn cho chúng tôi</h3>
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="mb-3">
              <label for="name" class="form-label">Họ và tên</label>
              <input
                id="name"
                type="text"
                v-model="form.name"
                class="form-control"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                class="form-control"
                placeholder="Nhập email"
                required
              />
            </div>

            <div class="mb-3">
              <label for="subject" class="form-label">Tiêu đề</label>
              <input
                id="subject"
                type="text"
                v-model="form.subject"
                class="form-control"
                placeholder="Nhập tiêu đề"
                required
              />
            </div>

            <div class="mb-3">
              <label for="message" class="form-label">Nội dung</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                class="form-control"
                placeholder="Nhập nội dung tin nhắn"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-100 btn-send">
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-12">
          <h3 class="mb-3">Bản đồ</h3>
          <div class="map-responsive">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.059167273045!2d105.75698231540817!3d21.05669848599466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba5a24e1d0d%3A0xf740f6a1660ed314!2zQmFjIFR1IEzhuqEsIEjDsm4gSOG7kyBUw6JuLCBIw6AgTeG7mWksIEjDoCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1699935300000!5m2!1svi!2s"
              width="100%"
              height="350"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { toast } from "vue3-toastify";

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

function submitForm() {
  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.subject.trim() ||
    !form.message.trim()
  ) {
    toast.error("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  // Ở đây bạn xử lý gửi form, ví dụ gọi API
  toast.success("Gửi tin nhắn thành công!");
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
}
</script>

<style scoped>
.contact-info-section {
  background: #f7f9fc;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 8px 25px rgb(0 0 0 / 0.12);
  max-width: 900px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1,
h3 {
  color: #1e3a8a;
  font-weight: 700;
}

.contact-form .form-label {
  font-weight: 600;
  color: #334155;
}

.contact-form .form-control {
  border-radius: 12px;
  border: 1.5px solid #cbd5e1;
  padding: 10px 15px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.1);
}

.contact-form .form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px #2563eb;
  outline: none;
}

.btn-send {
  background: #2563eb;
  border: none;
  border-radius: 25px;
  padding: 12px 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  box-shadow: 0 5px 15px rgb(37 99 235 / 0.5);
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.btn-send:hover {
  background: #1e40af;
  box-shadow: 0 8px 20px rgb(30 64 175 / 0.7);
  transform: scale(1.05);
}

.btn-send:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.5);
}

/* Responsive */
@media (max-width: 767px) {
  .contact-info-section {
    padding: 30px 20px;
  }
}
</style>

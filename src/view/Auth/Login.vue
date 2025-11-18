<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <!-- Login form -->
    <div class="card shadow p-4" style="width: 400px; border-radius: 12px">
      <h3 class="text-center mb-4">Đăng nhập</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Tên đăng nhập:</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            id="username"
            placeholder="Nhập username"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu:</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div class="form-check mb-3">
          <input
            v-model="remember"
            type="checkbox"
            class="form-check-input"
            id="remember"
          />
          <label class="form-check-label" for="remember"> Ghi nhớ đăng nhập </label>
        </div>

        <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>

        <div class="text-center mt-3">
          <a href="#" @click.prevent="openForgotEmailModal">Quên mật khẩu?</a>
        </div>
      </form>

      <div class="text-center mt-3">
        <router-link to="/register" class="text-decoration-none">
          Chưa có tài khoản? Đăng ký
        </router-link>
      </div>
    </div>

    <!-- Modal 1: Nhập Email -->
    <div
      v-if="showForgotEmailModal"
      class="modal-backdrop fade show"
      @click="closeForgotEmailModal"
    ></div>
    <div
      v-if="showForgotEmailModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgotEmailModalLabel"
      @click.stop
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="forgotEmailModalLabel">Nhập Email</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeForgotEmailModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Nhập email đăng ký của bạn để đặt lại mật khẩu.</p>
            <input
              type="email"
              v-model="forgotEmail"
              class="form-control"
              placeholder="Nhập email"
              required
              autocomplete="email"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeForgotEmailModal">Hủy</button>
            <button
              class="btn btn-primary"
              @click="sendOtp"
              :disabled="sendingOtp || !forgotEmail.trim()"
            >
              <span
                v-if="sendingOtp"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Gửi mã OTP
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nhập OTP -->
    <div
      v-if="showOtpModal"
      class="modal-backdrop fade show"
      @click="closeOtpModal"
    ></div>
    <div
      v-if="showOtpModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otpModalLabel"
      @click.stop
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="otpModalLabel">Nhập OTP</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeOtpModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Nhập mã OTP đã được gửi tới email của bạn.</p>
            <input
              type="text"
              v-model="otpInput"
              class="form-control"
              placeholder="Nhập mã OTP"
              maxlength="6"
              @input="onOtpInput"
              required
              autocomplete="one-time-code"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeOtpModal">Hủy</button>
            <button class="btn btn-primary" @click="verifyOtp">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>

    <!--Nhập mật khẩu mới -->
    <div
      v-if="showNewPasswordModal"
      class="modal-backdrop fade show"
      @click="closeNewPasswordModal"
    ></div>
    <div
      v-if="showNewPasswordModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newPasswordModalLabel"
      @click.stop
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="newPasswordModalLabel">Nhập mật khẩu mới</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeNewPasswordModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Nhập mật khẩu mới.</p>
            <input
              type="password"
              v-model="newPassword"
              class="form-control mb-2"
              placeholder="Mật khẩu mới"
              required
              autocomplete="new-password"
            />
            <p>Xác nhận mật khẩu mới.</p>
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              placeholder="Xác nhận mật khẩu"
              required
              autocomplete="new-password"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeNewPasswordModal">Hủy</button>
            <button class="btn btn-primary" @click="submitNewPassword">Xác nhận</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/Authstore";
import { toast } from "vue3-toastify";
const username = ref("");
const password = ref("");
const remember = ref(false);
const router = useRouter();
const auth = useAuthStore();

const showForgotEmailModal = ref(false);
const showOtpModal = ref(false);
const showNewPasswordModal = ref(false);

const forgotEmail = ref("");
const otpInput = ref("");
const otpSent = ref(null);
const newPassword = ref("");
const confirmPassword = ref("");

const sendingOtp = ref(false);

onMounted(() => auth.loadUser());

//Login
const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:3000/accounts");
    if (!res.ok) {
      toast.error("Không thể tải danh sách tài khoản", { autoClose: 3000 });
      return;
    }
    const accounts = await res.json();
    const user = accounts.find(
      (u) => u.username.trim() === username.value.trim() && u.password === password.value
    );

    if (!user) {
      toast.error("Sai tên đăng nhập hoặc mật khẩu!", { autoClose: 3000 });
      return;
    }

    const status = (user.status || "").toLowerCase().trim();
    if (status !== "active") {
      toast.error("Tài khoản này đã bị khóa hoặc chưa kích hoạt!", { autoClose: 3000 });
      return;
    }

    auth.user = user;

    if (remember.value) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.removeItem("currentUser");
    }
    toast.success("Đăng nhập thành công!", { autoClose: 500 });
    setTimeout(() => {
      if (user.role === "admin") {
        router.push("/admin/home");
      } else {
        router.push("/home");
      }
    }, 1000);
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Không thể kết nối tới máy chủ!");
  }
};

// --- Modal controls ---
const openForgotEmailModal = () => {
  resetEmailForm();
  showForgotEmailModal.value = true;
};

const closeForgotEmailModal = () => {
  showForgotEmailModal.value = false;
};

const openOtpModal = () => {
  resetOtpForm();
  showOtpModal.value = true;
};

const closeOtpModal = () => {
  showOtpModal.value = false;
  resetOtpForm();
};

const openNewPasswordModal = () => {
  resetNewPasswordForm();
  showNewPasswordModal.value = true;
};

const closeNewPasswordModal = () => {
  showNewPasswordModal.value = false;
  resetNewPasswordForm();
};

function resetEmailForm() {
  forgotEmail.value = "";
}

function resetOtpForm() {
  otpInput.value = "";
}

function resetNewPasswordForm() {
  newPassword.value = "";
  confirmPassword.value = "";
}

function resetAllForms() {
  resetEmailForm();
  resetOtpForm();
  resetNewPasswordForm();
  otpSent.value = null;
}

// --- OTP generation ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// --- Send OTP ---
const sendOtp = async () => {
  if (!forgotEmail.value.trim()) {
    alert("Vui lòng nhập email!");
    return;
  }

  sendingOtp.value = true;

  try {
    const resAccounts = await fetch("http://localhost:3000/accounts");
    if (!resAccounts.ok) {
      alert("Lỗi khi tải danh sách tài khoản");
      sendingOtp.value = false;
      return;
    }
    const accounts = await resAccounts.json();

    console.log("Email nhập:", forgotEmail.value);
    console.log("Danh sách accounts:", accounts);

    const user = accounts.find(
      (u) => u.email.trim().toLowerCase() === forgotEmail.value.trim().toLowerCase()
    );

    console.log("User tìm được:", user);

    if (!user) {
      alert("Email không tồn tại trong hệ thống!");
      sendingOtp.value = false;
      return;
    }

    const otp = generateOTP().toString();
    otpSent.value = otp;

    // Gửi email OTP - backend xử lý gửi mail
    const resSendMail = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotEmail.value,
        subject: "Mã xác thực đặt lại mật khẩu",
        html: `
            <p>Chào bạn,</p>
            <p>Mã xác thực đặt lại mật khẩu của bạn là: <strong>${otp}</strong></p>
            <p>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
          `,
      }),
    });

    if (!resSendMail.ok) {
      const errorData = await resSendMail.json();
      toast.error(`Lỗi khi gửi email: ${errorData.message || resSendMail.statusText}`);
      sendingOtp.value = false;
      return;
    }

    toast.success("Mã OTP đã được gửi tới email của bạn!");
    closeForgotEmailModal();
    openOtpModal();
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu đặt lại mật khẩu:", error);
    alert("Lỗi khi gửi yêu cầu đặt lại mật khẩu!");
  } finally {
    sendingOtp.value = false;
  }
};

//Xử lý nhập OTP
const onOtpInput = () => {
  otpInput.value = otpInput.value.replace(/\D/g, "");
};

//Xác nhận OTP
const verifyOtp = () => {
  console.log("OTP nhập vào:", `"${otpInput.value}"`);
  console.log("OTP gửi đi:", `"${otpSent.value}"`);
  if (otpInput.value.trim() !== String(otpSent.value)) {
    alert("Mã OTP không đúng!");
    return;
  }
  closeOtpModal();
  openNewPasswordModal();
};

const submitNewPassword = async () => {
  if (!newPassword.value.trim() || !confirmPassword.value.trim()) {
    alert("Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/accounts");
    if (!res.ok) {
      alert("Không thể tải danh sách tài khoản!");
      return;
    }

    const accounts = await res.json();
    const index = accounts.findIndex(
      (u) => u.email.trim().toLowerCase() === forgotEmail.value.trim().toLowerCase()
    );

    if (index === -1) {
      alert("Không tìm thấy tài khoản để cập nhật!");
      return;
    }
    accounts[index].password = newPassword.value;

    await Promise.all(
      accounts.map((acc) =>
        fetch(`http://localhost:3000/accounts/${acc.id}`, { method: "DELETE" })
      )
    );

    await Promise.all(
      accounts.map((acc) =>
        fetch("http://localhost:3000/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(acc),
        })
      )
    );

    toast.success("Cập nhật mật khẩu thành công!");
    closeNewPasswordModal();
    resetAllForms();
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    alert("Lỗi khi cập nhật mật khẩu!");
  }
};
</script>

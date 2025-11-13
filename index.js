import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Tạo transporter gửi mail, bật pool để tái sử dụng kết nối
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // email của bạn, ví dụ: abc@gmail.com
    pass: process.env.EMAIL_PASS, // mật khẩu ứng dụng (App Password) Gmail
  },
  pool: true,
});

app.post("/send-email", async (req, res) => {
  const { email, subject, html } = req.body;

  if (!email || !subject || !html) {
    return res.status(400).json({ error: "Thiếu thông tin gửi mail" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Gửi email thành công" });
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
    res.status(500).json({ error: "Gửi email thất bại" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});

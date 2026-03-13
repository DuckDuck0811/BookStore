import http from "http";
import https from "https";
import { URL } from "url";

const TARGET = "https://anvl.autumus.com:9881/api/v1/notification/list";

const server = http.createServer((req, res) => {
  // 1. Cấu hình CORS để Web Frontend gọi được vào đây
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 2. Xử lý Route /notifications
  if (req.method === "GET" && req.url.startsWith("/notifications")) {
    const url = new URL(TARGET);
    url.searchParams.set("page_size", "10");
    url.searchParams.set("page_no", "1");
    url.searchParams.set("action_status", "0");

    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      rejectUnauthorized: false // Quan trọng: Bỏ qua lỗi SSL nếu có
    };

    const proxyReq = https.request(url, options, (proxyRes) => {
      let data = "";
      proxyRes.on("data", (chunk) => (data += chunk));
      proxyRes.on("end", () => {
        res.writeHead(proxyRes.statusCode, { "Content-Type": "application/json" });
        res.end(data);
      });
    });

    proxyReq.on("error", (err) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.end();
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3000, () => {
  console.log("🚀 Proxy Server đang chạy tại http://localhost:3000");
});
const API_URL = "http://localhost:3000/api";
const form = document.getElementById("login-form");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  msg.style.color = "#333";
  msg.textContent = "Đang đăng nhập...";

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⭐ BẮT BUỘC để nhận cookie
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    msg.style.color = "green";
    msg.textContent = "Đăng nhập thành công!";

    // Redirect sau khi login
    setTimeout(() => {
      // 👉 ADMIN
      if (data.user?.role === "admin") {
        window.location.href = "admin-products.html";
        return;
      }

      // 👉 USER thường
      window.location.href = "index.html";
    }, 500);

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = err.message || "Không thể kết nối server";
  }
});

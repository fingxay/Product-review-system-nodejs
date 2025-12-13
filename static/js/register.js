const API_URL = "http://localhost:3000/api";
const form = document.getElementById("register-form");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    msg.style.color = "green";
    msg.textContent = "Đăng ký thành công! Chuyển sang đăng nhập.";
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = err.message || "Đăng ký thất bại";
  }
});

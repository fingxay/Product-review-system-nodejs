const API_URL = "http://localhost:3000/api";
const form = document.getElementById("login-form");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    msg.style.color = "green";
    msg.textContent = "Đăng nhập thành công!";
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = err.message || "Đăng nhập thất bại";
  }
});

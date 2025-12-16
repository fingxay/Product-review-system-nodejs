document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("app-header");
  if (!headerContainer) return;

  // 1️⃣ Load header HTML
  const html = await fetch("../templates/share/header.html").then(res =>
    res.text()
  );
  headerContainer.innerHTML = html;

  const nav = headerContainer.querySelector(".header-nav");

  // 2️⃣ Hàm render khi CHƯA login
  const renderGuest = () => {
    nav.innerHTML = `
      <a href="login.html">Đăng nhập</a>
      <a href="register.html">Đăng ký</a>
    `;
  };

// 3️⃣ Hàm render khi ĐÃ login
const renderUser = (user) => {
  nav.innerHTML = `
    <span class="username">👤 ${user.username}</span>
    <a href="#" id="logoutBtn">Đăng xuất</a>
  `;

  // ===== ADMIN LINK =====
  if (user.role === "admin") {
    const brand = headerContainer.querySelector(".brand");

    // tránh render trùng
    if (!document.querySelector(".admin-link")) {
      const adminLink = document.createElement("a");
      adminLink.href = "admin-products.html";
      adminLink.textContent = "Admin";
      adminLink.className = "admin-link";

      // 👉 chèn NGAY SAU TechReview
      brand.insertAdjacentElement("afterend", adminLink);
    }
  }


  document
    .getElementById("logoutBtn")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      location.reload(); // reload để clean UI
    });
};


  // 4️⃣ Kiểm tra trạng thái đăng nhập
  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
    });

    const data = await res.json();

    if (data.loggedIn) {
      renderUser(data.user);
    } else {
      renderGuest();
    }

  } catch (err) {
    console.error("Auth check failed", err);
    renderGuest();
  }
});

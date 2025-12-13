const API_BASE_URL = "http://localhost:3000/api";

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const products = await res.json();

    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      // Click card -> go detail
      card.addEventListener("click", () => viewProduct(product._id));
      // Enter/Space -> go detail (keyboard accessible)
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") viewProduct(product._id);
      });

      card.innerHTML = `
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />

        <h3>${product.name}</h3>
        <p class="category">${product.category || "Uncategorized"}</p>

        <div class="rating">
          <span class="star">⭐</span>
          <span class="value">${product.averageRating?.toFixed(1) || 0}</span>
        </div>

        <div class="actions">
          <button type="button" class="btn-view">View</button>
        </div>
      `;

      // Nút View vẫn hoạt động nhưng KHÔNG bị double-trigger do click card
      const btn = card.querySelector(".btn-view");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        viewProduct(product._id);
      });

      productList.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load products", error);
  }
}

function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

loadProducts();

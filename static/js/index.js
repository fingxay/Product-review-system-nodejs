const API_BASE_URL = "http://localhost:3000/api";
const PRODUCTS_PER_PAGE = 9;

let allProducts = [];
let currentPage = 1;

/**
 * Load products
 */
async function loadProducts(category) {
  try {
    const url = category
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`;

    const res = await fetch(url);
    allProducts = await res.json();

    ensureCategoryFilter(allProducts);
    currentPage = 1;

    renderProducts();
    renderPagination();
  } catch (error) {
    console.error("Failed to load products", error);
  }
}

/**
 * Render products (theo page)
 */
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;

  allProducts.slice(start, end).forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.onclick = () => viewProduct(product._id);

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
        <span class="value">${product.averageRating !== undefined
  ? product.averageRating.toFixed(1)
  : "0.0"}
</span>
      </div>

      <div class="actions">
        <button class="btn-view">View</button>
      </div>
    `;

    card.querySelector(".btn-view").onclick = (e) => {
      e.stopPropagation();
      viewProduct(product._id);
    };

    productList.appendChild(card);
  });
}

/**
 * Pagination (giống product detail)
 */
function renderPagination() {
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const container = document.getElementById("productPagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const createButton = (label, page, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;

    if (active) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = page;
      renderProducts();
      renderPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return btn;
  };

  /* ◀ Prev */
  if (currentPage > 1) {
    container.appendChild(createButton("‹", currentPage - 1));
  }

  const pages = [1];
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) pages.push(i);
  }
  pages.push(totalPages);

  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  let prev = 0;
  uniquePages.forEach((page) => {
    if (page - prev > 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      container.appendChild(dots);
    }

    container.appendChild(
      createButton(page, page, page === currentPage)
    );
    prev = page;
  });

  /* ▶ Next */
  if (currentPage < totalPages) {
    container.appendChild(createButton("›", currentPage + 1));
  }
}

/**
 * Category filter
 */
function ensureCategoryFilter(products) {
  if (document.getElementById("category-filter")) return;

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  if (!categories.length) return;

  const productList = document.getElementById("product-list");

  const wrapper = document.createElement("div");
  wrapper.className = "category-filter";

  const label = document.createElement("label");
  label.textContent = "Loại sản phẩm:";

  const select = document.createElement("select");
  select.id = "category-filter";

  select.innerHTML = `<option value="">Tất cả</option>`;
  categories.forEach(c => {
    select.innerHTML += `<option value="${c}">${c}</option>`;
  });

  select.onchange = () => loadProducts(select.value || undefined);

  wrapper.append(label, select);
  productList.parentElement.insertBefore(wrapper, productList);
}

function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

loadProducts();

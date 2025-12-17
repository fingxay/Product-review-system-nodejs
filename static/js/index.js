const API_BASE_URL = "http://localhost:3000/api";
const PRODUCTS_PER_PAGE = 9;

let allProducts = [];
let currentPage = 1;
let currentCategory;
let currentSort;


/**
 * Load products
 */
async function loadProducts(category, sort) {
  try {
    currentCategory = category;
    currentSort = sort;

    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    const url = `${API_BASE_URL}/products?${params.toString()}`;

    const res = await fetch(url);
    allProducts = await res.json();

    ensureCategoryAndSortFilter(allProducts);
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
function ensureCategoryAndSortFilter(products) {
  if (document.getElementById("category-filter")) return;

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  if (!categories.length) return;

  const productList = document.getElementById("product-list");

  const wrapper = document.createElement("div");
  wrapper.className = "category-filter";

  /* ===== CATEGORY ===== */
  const catLabel = document.createElement("label");
  catLabel.textContent = "Loại sản phẩm:";

  const catSelect = document.createElement("select");
  catSelect.id = "category-filter";
  catSelect.innerHTML = `<option value="">Tất cả</option>`;

  categories.forEach(c => {
    catSelect.innerHTML += `<option value="${c}">${c}</option>`;
  });

  catSelect.onchange = () =>
    loadProducts(catSelect.value || undefined, currentSort);

  /* ===== SORT ===== */
  const sortLabel = document.createElement("label");
  sortLabel.textContent = "Sắp xếp:";

  const sortSelect = document.createElement("select");
  sortSelect.id = "sort-filter";
  sortSelect.innerHTML = `
    <option value="">Mặc định</option>
    <option value="rating_asc">⭐ Thấp → Cao</option>
    <option value="rating_desc">⭐ Cao → Thấp</option>
  `;

  sortSelect.onchange = () =>
    loadProducts(currentCategory, sortSelect.value || undefined);

  wrapper.append(
    catLabel,
    catSelect,
    sortLabel,
    sortSelect
  );

  productList.parentElement.insertBefore(wrapper, productList);
}


function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

loadProducts();

const API_BASE_URL = "http://localhost:3000/api";
const REVIEWS_PER_PAGE = 4;

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let allReviews = [];
let currentPage = 1;

/* ================= Load product ================= */
async function loadProduct() {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`);
  const product = await res.json();

  document.getElementById("productImage").src = product.image;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productRating").textContent =
    product.averageRating?.toFixed(1) || 0;
  document.getElementById("productDescription").textContent =
    product.description || "";
}

/* ================= Load reviews ================= */
async function loadReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews/${productId}`);
  allReviews = await res.json();
  renderReviews();
  renderPagination();
}

function renderReviews() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";

  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const end = start + REVIEWS_PER_PAGE;

  allReviews.slice(start, end).forEach(r => {
    const div = document.createElement("div");
    div.className = "review-item";

    div.innerHTML = `
      <div class="review-user">${r.user.username}</div>
      <div class="review-rating">⭐ ${r.rating}</div>
      <div>${r.comment}</div>
    `;

    list.appendChild(div);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const container = document.getElementById("reviewPagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const createButton = (label, page, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;

    if (active) btn.classList.add("active");
    if (disabled) btn.disabled = true;

    btn.onclick = () => {
      if (!disabled) {
        currentPage = page;
        renderReviews();
        renderPagination();
      }
    };

    return btn;
  };

  /* ◀ Prev */
  if (currentPage > 1) {
    container.appendChild(createButton("‹", currentPage - 1));
  }

  const pages = [];
  pages.push(1);

  for (
    let i = currentPage - 2;
    i <= currentPage + 2;
    i++
  ) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  if (totalPages > 1) pages.push(totalPages);

  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  let prev = 0;
  uniquePages.forEach(page => {
    if (page - prev > 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.padding = "6px 8px";
      container.appendChild(dots);
    }

    container.appendChild(
      createButton(
        page,
        page,
        false,
        page === currentPage
      )
    );

    prev = page;
  });

  /* ▶ Next */
  if (currentPage < totalPages) {
    container.appendChild(createButton("›", currentPage + 1));
  }
}


/* ================= Init ================= */
loadProduct();
loadReviews();

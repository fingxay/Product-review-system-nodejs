const API_BASE_URL = "http://localhost:3000/api";
const REVIEWS_PER_PAGE = 4;

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let allReviews = [];
let currentPage = 1;
let currentRatingFilter = null;

let authState = {
  loggedIn: false,
  user: null,
};

let myReview = null;
let selectedRating = 0;

let pendingDeleteReviewId = null;

let editingReviewId = null;

/* ================= PRODUCT ================= */
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

/* ================= AUTH ================= */
async function loadAuthState() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();

    authState.loggedIn = !!data.loggedIn;
    authState.user = data.loggedIn ? data.user : null;
  } catch {
    authState.loggedIn = false;
    authState.user = null;
  }
}

/* ================= MY REVIEW ================= */
async function loadMyReview() {
  if (!authState.loggedIn) {
    myReview = null;
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/reviews/${productId}/my`,
      { credentials: "include" }
    );

    if (res.status === 401) {
      myReview = null;
      return;
    }

    myReview = await res.json();
  } catch {
    myReview = null;
  }
}

/* ================= REVIEWS ================= */
async function loadReviews() {
  let url = `${API_BASE_URL}/reviews/${productId}`;
  if (currentRatingFilter) url += `?rating=${currentRatingFilter}`;

  const res = await fetch(url);
  allReviews = await res.json();

  if (myReview && myReview._id) {
    allReviews = allReviews.filter(r => r._id !== myReview._id);
    allReviews.unshift(myReview);
  }

  currentPage = 1;
  renderReviews();
  renderPagination();
}

function renderReviews() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";

  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const end = start + REVIEWS_PER_PAGE;

  allReviews.slice(start, end).forEach(r => {
    const isMine =
      authState.loggedIn &&
      myReview &&
      r._id === myReview._id;

    const div = document.createElement("div");
    div.className = "review-item";

    div.innerHTML = `
      <div class="review-row">
        <div class="review-main">
          <div class="review-user">${r.user.username}</div>
          <div class="review-rating">⭐ ${r.rating}</div>
          <div class="review-comment">${r.comment}</div>
        </div>

        ${
          isMine
            ? `
            <div class="review-actions">
              <button class="btn-edit-review">Chỉnh sửa</button>
              <button class="btn-delete-review">Xóa</button>
            </div>
          `
            : ""
        }
      </div>
    `;

    list.appendChild(div);

    if (isMine) {
      // ===== DELETE =====
      const deleteBtn = div.querySelector(".btn-delete-review");
      deleteBtn.onclick = () => {
        pendingDeleteReviewId = r._id;
        document
          .getElementById("delete-review-modal")
          .classList.remove("hidden");
      };

      // ===== EDIT =====
      const editBtn = div.querySelector(".btn-edit-review");
      editBtn.onclick = () => {
        openEditReviewModal(r);
      };
    }

  });
}

/* ================= PAGINATION ================= */
function renderPagination() {
  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const container = document.getElementById("reviewPagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const btn = (label, page, active = false) => {
    const b = document.createElement("button");
    b.textContent = label;
    if (active) b.classList.add("active");
    b.onclick = () => {
      currentPage = page;
      renderReviews();
      renderPagination();
    };
    return b;
  };

  if (currentPage > 1)
    container.appendChild(btn("‹", currentPage - 1));

  for (let i = 1; i <= totalPages; i++) {
    container.appendChild(btn(i, i, i === currentPage));
  }

  if (currentPage < totalPages)
    container.appendChild(btn("›", currentPage + 1));
}

/* ================= FILTER ================= */
function setRatingFilter(rating) {
  currentRatingFilter = rating;
  loadReviews();
}

function bindRatingFilterEvents() {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      document
        .querySelectorAll(".filter")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      const value = btn.dataset.rating;
      setRatingFilter(value ? Number(value) : null);
    };
  });
}

/* ================= SUMMARY ================= */
async function loadReviewSummary() {
  const res = await fetch(
    `${API_BASE_URL}/reviews/${productId}/summary`
  );
  const data = await res.json();

  document.getElementById("avgScore").textContent =
    (data.average || 0).toFixed(1);

  renderAverageStars(data.average || 0);

  for (let i = 1; i <= 5; i++) {
    document.getElementById(`count-${i}`).textContent =
      data.stars?.[i] || 0;
  }

  // 🔥 QUAN TRỌNG: gắn lại event cho filter
  bindRatingFilterEvents();
}

function renderAverageStars(avg) {
  const el = document.getElementById("avgStars");
  el.innerHTML = "";

  const full = Math.floor(avg);
  for (let i = 1; i <= 5; i++) {
    el.innerHTML += i <= full ? "★" : "☆";
  }
}

/* ================= WRITE REVIEW BUTTON ================= */
function setupWriteReviewButton() {
  const btn = document.querySelector(".btn-write-review");

  btn.disabled = false;
  btn.textContent = "Viết đánh giá";
  btn.title = "";

  if (myReview && myReview._id) {
    btn.disabled = true;
    btn.textContent = "Bạn đã đánh giá";
    btn.title = "Bạn chỉ được đánh giá 1 lần";
    return;
  }

  btn.onclick = () => {
    if (!authState.loggedIn) {
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      window.location.href = `login.html?redirect=${redirect}`;
      return;
    }

    openCreateReviewModal();
  };
}

/* ================= MODAL ================= */
function openCreateReviewModal() {
  selectedRating = 0;
  document.getElementById("reviewComment").value = "";
  document.getElementById("reviewError").textContent = "";

  document
    .querySelectorAll("#starRating span")
    .forEach(s => s.classList.remove("active"));

  document
    .getElementById("review-modal")
    .classList.remove("hidden");
}

function openEditReviewModal(review) {
  editingReviewId = review._id;
  selectedRating = review.rating;

  // Title
  document.getElementById("reviewModalTitle").textContent =
    "Chỉnh sửa đánh giá";

  // Comment
  document.getElementById("reviewComment").value = review.comment;

  // Stars
  document.querySelectorAll("#starRating span").forEach(star => {
    star.classList.toggle(
      "active",
      Number(star.dataset.value) <= selectedRating
    );
  });

  // Clear error
  document.getElementById("reviewError").textContent = "";

  // Open modal
  document
    .getElementById("review-modal")
    .classList.remove("hidden");
}


document.getElementById("btnCancelReview").onclick = () => {
  document.getElementById("review-modal").classList.add("hidden");
};

document.getElementById("btnSubmitReview").onclick = async () => {
  const comment = document.getElementById("reviewComment").value;

  let url = `${API_BASE_URL}/reviews/${productId}`;
  let method = "POST";

  if (editingReviewId) {
    url = `${API_BASE_URL}/reviews/${editingReviewId}`;
    method = "PUT";
  }

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating: selectedRating,
      comment,
    }),
  });

  if (!res.ok) {
    let message = "Gửi đánh giá thất bại";

    try {
      const data = await res.json();
      if (data.error?.includes("rating"))
        message = "Vui lòng chọn số sao đánh giá";
      else if (data.error?.includes("comment"))
        message = "Nội dung đánh giá quá ngắn";
    } catch {}

    document.getElementById("reviewError").textContent = message;
    return;
  }

  // Reset state
  editingReviewId = null;

  // Close modal
  document.getElementById("review-modal").classList.add("hidden");

  await loadMyReview();
  await loadReviews();
  loadReviewSummary();
  setupWriteReviewButton();
};


document.querySelectorAll("#starRating span").forEach(star => {
  star.onclick = () => {
    selectedRating = Number(star.dataset.value);
    document.querySelectorAll("#starRating span").forEach(s =>
      s.classList.toggle(
        "active",
        Number(s.dataset.value) <= selectedRating
      )
    );
  };
});

// Hủy xóa
document.getElementById("btnCancelDelete").onclick = () => {
  pendingDeleteReviewId = null;
  document
    .getElementById("delete-review-modal")
    .classList.add("hidden");
};

// Xác nhận xóa
document.getElementById("btnConfirmDelete").onclick = async () => {
  if (!pendingDeleteReviewId) return;

  const res = await fetch(
    `${API_BASE_URL}/reviews/${pendingDeleteReviewId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    alert("Xóa đánh giá thất bại");
    return;
  }

  // Reset state
  pendingDeleteReviewId = null;
  myReview = null;

  // Đóng modal
  document
    .getElementById("delete-review-modal")
    .classList.add("hidden");

  // Reload UI
  await loadReviews();
  loadReviewSummary();
  setupWriteReviewButton();
};


/* ================= INIT ================= */
(async function init() {
  await loadAuthState();
  await loadMyReview();

  setupWriteReviewButton();

  loadProduct();
  await loadReviews();
  loadReviewSummary();
})();

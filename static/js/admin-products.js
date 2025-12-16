// static/js/admin-products.js
const API_BASE_URL = "http://localhost:3000/api";
const tableBody = document.getElementById("productTableBody");

let products = [];        // danh sách đang hiển thị (đã filter)
let allProducts = [];     // danh sách gốc từ API

let currentCategory = ""; // category đang lọc ("" = tất cả)

// ===== PAGINATION =====
const PAGE_SIZE = 7;
let currentPage = 1;



// ===== MODALS / FORM ELEMENTS =====
const btnOpenAdd = document.getElementById("btnOpenAddProduct");

const productModal = document.getElementById("product-modal");
const productModalTitle = document.getElementById("productModalTitle");

const productNameInput = document.getElementById("productNameInput");
const productCategoryInput = document.getElementById("productCategoryInput");
const productImageInput = document.getElementById("productImageInput");
const productDescInput = document.getElementById("productDescInput");
const productFormError = document.getElementById("productFormError");

const btnCancelProduct = document.getElementById("btnCancelProduct");
const btnSaveProduct = document.getElementById("btnSaveProduct");

const deleteModal = document.getElementById("delete-product-modal");
const btnCancelDeleteProduct = document.getElementById("btnCancelDeleteProduct");
const btnConfirmDeleteProduct = document.getElementById("btnConfirmDeleteProduct");

// ===== STATE =====
let editingProductId = null;
let pendingDeleteProductId = null;

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}
function ensureCategoryFilter(productsInput) {
  // nếu đã có dropdown rồi thì chỉ update options
  let select = document.getElementById("admin-category-filter");
  const categories = [...new Set((productsInput || [])
    .map(p => (p.category || "").trim())
    .filter(Boolean))];

  // nếu không có category nào thì thôi
  if (!categories.length) return;

  if (!select) {
    // tạo UI giống trang index (dùng lại CSS .category-filter trong style.css)
    const wrapper = document.createElement("div");
    wrapper.className = "category-filter";

    const label = document.createElement("label");
    label.textContent = "Loại sản phẩm:";

    select = document.createElement("select");
    select.id = "admin-category-filter";

    select.onchange = () => {
      currentCategory = select.value || "";
      applyCategoryFilter();
    };

    wrapper.append(label, select);

    // chèn ngay dưới header của admin
    const adminHeader = document.querySelector(".admin-header");
    if (adminHeader && adminHeader.parentElement) {
      adminHeader.parentElement.insertBefore(wrapper, adminHeader.nextSibling);
    } else {
      // fallback: chèn đầu main
      const main = document.querySelector("main.admin-container");
      if (main) main.insertBefore(wrapper, main.firstChild);
    }
  }

  // build options
  select.innerHTML = `<option value="">Tất cả</option>`;
  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });

  // giữ lại lựa chọn cũ nếu còn tồn tại
  select.value = currentCategory;
}

function applyCategoryFilter() {
  if (currentCategory) {
    products = allProducts.filter(p => (p.category || "").trim() === currentCategory);
  } else {
    products = [...allProducts];
  }

  currentPage = 1;
  renderProducts();
}

/* ===== LOAD PRODUCTS (REAL API) ===== */
function openAddModal() {
  editingProductId = null;
  productModalTitle.textContent = "Thêm sản phẩm";

  productNameInput.value = "";
  productCategoryInput.value = "";
  productImageInput.value = "";
  productDescInput.value = "";
  productFormError.textContent = "";

  productModal.classList.remove("hidden");
}

function openEditModal(product) {
  editingProductId = product._id;
  productModalTitle.textContent = "Chỉnh sửa sản phẩm";

  productNameInput.value = product.name || "";
  productCategoryInput.value = product.category || "";
  productImageInput.value = product.image || "";
  productDescInput.value = product.description || "";
  productFormError.textContent = "";

  productModal.classList.remove("hidden");
}

function closeProductModal() {
  productModal.classList.add("hidden");
  productFormError.textContent = "";
}

function openDeleteModal(productId) {
  pendingDeleteProductId = productId;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteProductId = null;
  deleteModal.classList.add("hidden");
}

function getFormDataOrError() {
  const name = productNameInput.value.trim();
  const category = productCategoryInput.value.trim();
  const image = productImageInput.value.trim();
  const description = productDescInput.value.trim();

  if (!name) return { error: "Vui lòng nhập tên sản phẩm" };
  if (!category) return { error: "Vui lòng nhập danh mục" };

  // image có thể trống theo yêu cầu của bạn
  // description có thể trống

  return {
    data: {
      name,
      category,
      image: image || "",
      description: description || "",
    },
  };
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      // credentials (gửi kèm cookie) - không bắt buộc cho GET hiện tại,
      // nhưng để sẵn vì admin thao tác CRUD sẽ cần cookie
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to load products: ${res.status}`);
    }

    allProducts = await res.json();

    // render dropdown (và update options)
    ensureCategoryFilter(allProducts);

    // áp filter hiện tại (nếu đang chọn category)
    applyCategoryFilter();


  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:16px;">
          Không tải được danh sách sản phẩm
        </td>
      </tr>
    `;
  }
}

/* ===== RENDER ===== */
function renderProducts() {
  tableBody.innerHTML = "";

  if (!products || products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:16px;">
          Chưa có sản phẩm nào
        </td>
      </tr>
    `;
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = products.slice(start, end);

  pageItems.forEach((p) => {
    const tr = document.createElement("tr");

    const imgUrl = p.image && String(p.image).trim() ? p.image : "";
    const rating =
      typeof p.averageRating === "number" ? p.averageRating : (p.rating ?? 0);

    tr.innerHTML = `
      <td>
        <img src="${imgUrl}" alt="${escapeHtml(p.name || "")}" />
      </td>
      <td>${escapeHtml(p.name || "")}</td>
      <td>${escapeHtml(p.category || "")}</td>
      <td>${escapeHtml(p.description || "")}</td>
      <td>⭐ ${Number(rating).toFixed(1)}</td>
      <td class="action-cell">
        <div class="action-buttons">
          <button class="btn-edit" data-id="${p._id}">Sửa</button>
          <button class="btn-delete" data-id="${p._id}">Xóa</button>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  renderPagination();
}


/* ===== HELPERS ===== */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===== DELETE PRODUCT (OPEN CONFIRM MODAL) ===== */
tableBody.addEventListener("click", (e) => {
  const btnDelete = e.target.closest(".btn-delete");
  if (!btnDelete) return;

  const productId = btnDelete.dataset.id;
  if (!productId) return;

  openDeleteModal(productId);
});


/* ===== EDIT PRODUCT (OPEN EDIT MODAL) ===== */
tableBody.addEventListener("click", (e) => {
  const btnEdit = e.target.closest(".btn-edit");
  if (!btnEdit) return;

  const productId = btnEdit.dataset.id;
  if (!productId) return;

 const product = allProducts.find((x) => x._id === productId);

  if (!product) return;

  openEditModal(product);
});

/* ===== ADD PRODUCT BUTTON ===== */
if (btnOpenAdd) {
  btnOpenAdd.addEventListener("click", () => {
    openAddModal();
  });
}

/* ===== MODAL: CANCEL ===== */
btnCancelProduct.addEventListener("click", () => {
  closeProductModal();
});

/* ===== MODAL: SAVE (CREATE/UPDATE) ===== */
btnSaveProduct.addEventListener("click", async () => {
  productFormError.textContent = "";

  const { data, error } = getFormDataOrError();
  if (error) {
    productFormError.textContent = error;
    return;
  }

  try {
    let url = `${API_BASE_URL}/products`;
    let method = "POST";

    if (editingProductId) {
      url = `${API_BASE_URL}/products/${editingProductId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // luôn đọc json để lấy message từ backend
  let result = null;
  try {
    result = await res.json();
  } catch {
    result = null;
  }

  if (!res.ok || !result?.success) {
    // message chỉ lấy từ backend
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  closeProductModal();
  showToast(result.message, "success");
  await loadProducts();

  } catch (err) {
    console.error(err);
    productFormError.textContent = err.message;  // message backend
    showToast(err.message, "error");

  }
});

/* ===== DELETE MODAL BUTTONS ===== */
btnCancelDeleteProduct.addEventListener("click", () => {
  closeDeleteModal();
});

btnConfirmDeleteProduct.addEventListener("click", async () => {
  if (!pendingDeleteProductId) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products/${pendingDeleteProductId}`, {
      method: "DELETE",
      credentials: "include",
    });

    let result = null;
    try {
      result = await res.json();
    } catch {
      result = null;
    }

    if (!res.ok || !result?.success) {
      throw new Error(result?.message || `Delete failed: ${res.status}`);
    }

    closeDeleteModal();
    showToast(result.message, "success");
    await loadProducts();

  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
});

function renderPagination() {
  let pagination = document.getElementById("admin-pagination");

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "admin-pagination";

    // dùng đúng style giống pagination ở trang review/shop (nếu CSS bạn đang dùng là .pagination)
    pagination.className = "pagination";

    tableBody.closest(".table-wrapper").after(pagination);
  }

  pagination.innerHTML = "";

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  if (totalPages <= 1) return;

  const makeBtn = (label, page, { active = false, disabled = false, isDots = false } = {}) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;

    if (active) b.classList.add("active");
    if (disabled) b.disabled = true;

    // dấu ... không click
    if (!disabled && !isDots) {
      b.onclick = () => {
        currentPage = page;
        renderProducts();
      };
    }
    return b;
  };

  // Prev
  pagination.appendChild(
    makeBtn("‹", currentPage - 1, { disabled: currentPage === 1 })
  );

  // window hiển thị số trang (giống kiểu shop)
  const windowSize = 2; // hiện 2 trang trước/sau trang hiện tại
  let start = Math.max(1, currentPage - windowSize);
  let end = Math.min(totalPages, currentPage + windowSize);

  // luôn hiện trang 1
  if (start > 1) {
    pagination.appendChild(makeBtn("1", 1, { active: currentPage === 1 }));
    if (start > 2) pagination.appendChild(makeBtn("...", null, { disabled: true, isDots: true }));
  }

  // các trang trong khoảng
  for (let i = start; i <= end; i++) {
    pagination.appendChild(makeBtn(String(i), i, { active: i === currentPage }));
  }

  // luôn hiện trang cuối
  if (end < totalPages) {
    if (end < totalPages - 1) pagination.appendChild(makeBtn("...", null, { disabled: true, isDots: true }));
    pagination.appendChild(makeBtn(String(totalPages), totalPages, { active: currentPage === totalPages }));
  }

  // Next
  pagination.appendChild(
    makeBtn("›", currentPage + 1, { disabled: currentPage === totalPages })
  );
}



/* ===== INIT ===== */
loadProducts();

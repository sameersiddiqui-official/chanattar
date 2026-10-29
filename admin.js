/**
 * CHAN ATTAR COLLECTION - ADMIN MANAGEMENT SCRIPT
 * Product catalog control, photo uploading, orders database, WhatsApp configuration & analytics
 */

const DEFAULT_PIN = "1234";

let adminOrders = [];
let adminProducts = [];
let adminFeedbacks = [];
let activeUploadedBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  checkSessionAuth();
});

// ==========================================================================
// AUTHENTICATION
// ==========================================================================
function checkSessionAuth() {
  const isAuth = sessionStorage.getItem("chan_attar_admin_auth");
  if (isAuth === "true") {
    showDashboard();
  } else {
    showLogin();
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const inputPin = document.getElementById("adminPinInput").value.trim();
  const savedPin = localStorage.getItem("chan_attar_admin_pin") || DEFAULT_PIN;

  if (inputPin === savedPin) {
    sessionStorage.setItem("chan_attar_admin_auth", "true");
    showDashboard();
    showAdminToast("Welcome to Chan Attar Admin Panel!");
  } else {
    alert("Incorrect PIN! The default PIN is 1234.");
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("chan_attar_admin_auth");
  showLogin();
}

function showLogin() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
}

function showDashboard() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("logoutBtn").style.display = "inline-flex";

  loadData();
  renderStats();
  renderOrders();
  renderProducts();
  renderFeedbacks();
  loadSettings();
}

// ==========================================================================
// DATA LOADING
// ==========================================================================
function loadData() {
  try {
    adminOrders = JSON.parse(localStorage.getItem("chan_attar_orders")) || [];
  } catch (e) {
    adminOrders = [];
  }

  try {
    adminProducts = JSON.parse(localStorage.getItem("chan_attar_products")) || [];
  } catch (e) {
    adminProducts = [];
  }

  try {
    adminFeedbacks = JSON.parse(localStorage.getItem("chan_attar_feedbacks")) || [];
  } catch (e) {
    adminFeedbacks = [];
  }
}

function renderStats() {
  const totalOrdersEl = document.getElementById("statTotalOrders");
  const revenueEl = document.getElementById("statRevenue");
  const productsCountEl = document.getElementById("statProducts");
  const feedbacksCountEl = document.getElementById("statFeedbacks");

  const totalRevenue = adminOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  if (totalOrdersEl) totalOrdersEl.textContent = adminOrders.length;
  if (revenueEl) revenueEl.textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  if (productsCountEl) productsCountEl.textContent = adminProducts.length;
  if (feedbacksCountEl) feedbacksCountEl.textContent = adminFeedbacks.length;
}

// ==========================================================================
// TAB SWITCHING
// ==========================================================================
function switchTab(tabId, btn) {
  document.querySelectorAll(".admin-panel-card").forEach(sec => sec.style.display = "none");
  document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));

  const target = document.getElementById(tabId);
  if (target) target.style.display = "block";
  if (btn) btn.classList.add("active");
}

// ==========================================================================
// ORDERS DATABASE (FULL DETAILS FOR ADMIN)
// ==========================================================================
function renderOrders() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  if (adminOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 8px;"></i>
          <p>No customer orders logged yet. As soon as a user clicks "Checkout via WhatsApp" on the website, their full details will appear here.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = adminOrders.map((order, idx) => {
    const cust = order.customer || {};
    const itemsList = (order.items || []).map(item => `
      <div style="font-size: 0.8rem; margin-bottom: 4px;">
        &bull; <strong>${item.name}</strong> (${item.size}) &times; ${item.qty} = ₹${item.price * item.qty}
      </div>
    `).join("");

    const custPhoneClean = (cust.phone || '').replace(/[^0-9]/g, '');
    const waChatMsg = encodeURIComponent(`Salam / Hello ${cust.name}! We have received your order #${order.orderId} for Chan Attar Collection. We are preparing it for express dispatch.`);

    return `
      <tr>
        <td><strong>#${order.orderId}</strong></td>
        <td><small style="color: var(--text-muted);">${order.timestamp}</small></td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${cust.name || 'Anonymous'}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fas fa-phone"></i> ${cust.phone || 'N/A'}</div>
        </td>
        <td>
          <div style="max-width: 220px; font-size: 0.82rem; line-height: 1.4;">
            ${cust.address || ''}<br>
            <strong>${cust.city || ''}</strong> - ${cust.pincode || ''}
          </div>
        </td>
        <td>
          <div style="max-height: 100px; overflow-y: auto;">
            ${itemsList}
          </div>
        </td>
        <td><strong style="color: var(--accent-chocolate); font-size: 1rem;">₹${order.total}</strong></td>
        <td><span style="font-size: 0.8rem; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px;">${order.paymentMethod || 'COD'}</span></td>
        <td>
          <select onchange="updateOrderStatus('${order.orderId}', this.value)" style="font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--accent-warm-beige);">
            <option value="Pending Confirmation" ${order.status === 'Pending Confirmation' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Packed & Shipped" ${order.status === 'Packed & Shipped' ? 'selected' : ''}>Packed & Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <a href="https://wa.me/${custPhoneClean}?text=${waChatMsg}" target="_blank" class="action-btn-sm action-btn-wa" title="Message Customer on WhatsApp">
              <i class="fab fa-whatsapp"></i> Chat
            </a>
            <button onclick="deleteSingleOrder('${order.orderId}')" class="action-btn-sm" style="background: #FFEBEE; color: #C62828;" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateOrderStatus(orderId, newStatus) {
  const order = adminOrders.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem("chan_attar_orders", JSON.stringify(adminOrders));
    showAdminToast(`Order #${orderId} marked as ${newStatus}`);
  }
}

function deleteSingleOrder(orderId) {
  if (confirm(`Are you sure you want to delete order #${orderId}?`)) {
    adminOrders = adminOrders.filter(o => o.orderId !== orderId);
    localStorage.setItem("chan_attar_orders", JSON.stringify(adminOrders));
    renderStats();
    renderOrders();
    showAdminToast("Order deleted successfully.");
  }
}

function clearAllOrders() {
  if (confirm("Are you sure you want to clear ALL logged orders? This action cannot be undone.")) {
    adminOrders = [];
    localStorage.setItem("chan_attar_orders", JSON.stringify([]));
    renderStats();
    renderOrders();
    showAdminToast("All orders cleared.");
  }
}

function exportOrdersCSV() {
  if (adminOrders.length === 0) {
    alert("No orders available to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Order ID,Date,Customer Name,Phone,Address,City,Pincode,Total Amount,Payment Mode,Status,Items\n";

  adminOrders.forEach(o => {
    const c = o.customer || {};
    const items = (o.items || []).map(i => `${i.name} (${i.size}) x${i.qty}`).join(" | ").replace(/,/g, ' ');
    const address = (c.address || '').replace(/,/g, ' ').replace(/\n/g, ' ');

    csvContent += `"${o.orderId}","${o.timestamp}","${c.name}","${c.phone}","${address}","${c.city}","${c.pincode}","₹${o.total}","${o.paymentMethod}","${o.status}","${items}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Chan_Attar_Orders_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// PRODUCT & INVENTORY MANAGEMENT
// ==========================================================================
function renderProducts() {
  const tbody = document.getElementById("adminProductsBody");
  if (!tbody) return;

  tbody.innerHTML = adminProducts.map(prod => `
    <tr>
      <td>
        <img src="${prod.image}" alt="${prod.name}" class="table-thumb" onerror="this.src='images/oudh.jpg'">
      </td>
      <td>
        <strong>${prod.name}</strong><br>
        <span style="font-size: 0.75rem; color: var(--accent-light-choc); text-transform: uppercase;">${prod.category}</span>
        ${prod.badge ? `<span style="font-size: 0.7rem; background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${prod.badge}</span>` : ''}
      </td>
      <td><div style="max-width: 260px; font-size: 0.8rem; color: var(--text-secondary);">${prod.notes}</div></td>
      <td>
        <strong>6ml:</strong> ₹${prod.price6ml}<br>
        <strong>12ml:</strong> ₹${prod.price12ml}
      </td>
      <td>
        <span class="badge-status ${prod.inStock ? 'delivered' : 'pending'}">
          ${prod.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td><strong>${prod.stockQty ?? 20}</strong> units</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button onclick="openEditProductModal(${prod.id})" class="action-btn-sm action-btn-edit">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button onclick="deleteProduct(${prod.id})" class="action-btn-sm" style="background: #FFEBEE; color: #C62828;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openAddProductModal() {
  activeUploadedBase64 = null;
  document.getElementById("modalProductTitle").textContent = "Add New Attar Creation";
  document.getElementById("productEditForm").reset();
  document.getElementById("editProdId").value = "";
  document.getElementById("editImagePreview").src = "images/oudh.jpg";
  document.getElementById("editImageUrl").value = "images/oudh.jpg";
  document.getElementById("productEditModal").classList.add("active");
}

function openEditProductModal(productId) {
  activeUploadedBase64 = null;
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById("modalProductTitle").textContent = `Edit Attar: ${prod.name}`;
  document.getElementById("editProdId").value = prod.id;
  document.getElementById("editProdName").value = prod.name;
  document.getElementById("editProdCategory").value = prod.category || 'oudh';
  document.getElementById("editProdBadge").value = prod.badge || '';
  document.getElementById("editProdNotes").value = prod.notes || '';
  document.getElementById("editProdPrice6ml").value = prod.price6ml || 999;
  document.getElementById("editProdPrice12ml").value = prod.price12ml || 1899;
  document.getElementById("editProdStockQty").value = prod.stockQty ?? 25;
  document.getElementById("editProdInStock").value = prod.inStock ? "true" : "false";
  document.getElementById("editImageUrl").value = prod.image || 'images/oudh.jpg';
  document.getElementById("editImagePreview").src = prod.image || 'images/oudh.jpg';
  document.getElementById("editProdDesc").value = prod.desc || '';

  document.getElementById("productEditModal").classList.add("active");
}

function closeProductModal() {
  document.getElementById("productEditModal").classList.remove("active");
  activeUploadedBase64 = null;
}

// Handle Image File Upload (Converts directly to Base64 so it stores in browser!)
function previewUploadedImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    activeUploadedBase64 = e.target.result;
    document.getElementById("editImagePreview").src = activeUploadedBase64;
    document.getElementById("editImageUrl").value = "[Uploaded Image File]";
  };
  reader.readAsDataURL(file);
}

function saveProductChanges(event) {
  event.preventDefault();

  const idVal = document.getElementById("editProdId").value;
  const name = document.getElementById("editProdName").value.trim();
  const category = document.getElementById("editProdCategory").value;
  const badge = document.getElementById("editProdBadge").value.trim();
  const notes = document.getElementById("editProdNotes").value.trim();
  const price6ml = Number(document.getElementById("editProdPrice6ml").value);
  const price12ml = Number(document.getElementById("editProdPrice12ml").value);
  const stockQty = Number(document.getElementById("editProdStockQty").value);
  const inStock = document.getElementById("editProdInStock").value === "true";
  const desc = document.getElementById("editProdDesc").value.trim();

  let finalImage = activeUploadedBase64;
  if (!finalImage) {
    finalImage = document.getElementById("editImageUrl").value.trim();
    if (finalImage === "[Uploaded Image File]" || !finalImage) {
      finalImage = "images/oudh.jpg";
    }
  }

  if (idVal) {
    // Edit existing product
    const prodId = Number(idVal);
    const index = adminProducts.findIndex(p => p.id === prodId);
    if (index > -1) {
      adminProducts[index] = {
        ...adminProducts[index],
        name,
        category,
        badge,
        notes,
        price6ml,
        price12ml,
        stockQty,
        inStock,
        desc,
        image: finalImage
      };
      showAdminToast(`Updated "${name}" successfully!`);
    }
  } else {
    // Add new product
    const newId = Date.now();
    adminProducts.push({
      id: newId,
      name,
      category,
      badge: badge || 'New Arrival',
      notes,
      price6ml,
      price12ml,
      stockQty,
      inStock,
      desc,
      image: finalImage
    });
    showAdminToast(`Added "${name}" to collection!`);
  }

  localStorage.setItem("chan_attar_products", JSON.stringify(adminProducts));
  closeProductModal();
  renderProducts();
  renderStats();
}

function deleteProduct(productId) {
  const prod = adminProducts.find(p => p.id === productId);
  if (!prod) return;

  if (confirm(`Are you sure you want to delete "${prod.name}" from your catalog?`)) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    localStorage.setItem("chan_attar_products", JSON.stringify(adminProducts));
    renderProducts();
    renderStats();
    showAdminToast(`Deleted "${prod.name}".`);
  }
}

function resetDefaultProducts() {
  if (confirm("Reset product list to initial 12 luxury attar defaults?")) {
    localStorage.removeItem("chan_attar_products");
    window.location.reload();
  }
}

// ==========================================================================
// FEEDBACK & REVIEWS
// ==========================================================================
function renderFeedbacks() {
  const container = document.getElementById("feedbackListContainer");
  if (!container) return;

  if (adminFeedbacks.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="far fa-smile" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>No feedback received yet. Form submissions will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = adminFeedbacks.map(fb => `
    <div style="background: var(--bg-secondary); border: 1px solid var(--accent-warm-beige); padding: 18px; border-radius: var(--radius-sm); margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <div>
          <strong style="font-size: 1rem; color: var(--text-primary);">${fb.name}</strong>
          <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 8px;"><i class="fas fa-phone"></i> ${fb.phone}</span>
        </div>
        <div style="color: #FFB800; font-size: 0.9rem;">
          ${'<i class="fas fa-star"></i>'.repeat(fb.rating || 5)}
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">${fb.date || ''}</span>
        </div>
      </div>
      <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0;">"${fb.message}"</p>
    </div>
  `).join("");
}

// ==========================================================================
// SETTINGS
// ==========================================================================
function loadSettings() {
  const savedNum = localStorage.getItem("chan_attar_whatsapp") || "919876543210";
  const numInput = document.getElementById("settingWhatsApp");
  if (numInput) numInput.value = savedNum;
}

function handleSettingsSave(event) {
  event.preventDefault();

  const numInput = document.getElementById("settingWhatsApp").value.trim().replace(/[^0-9]/g, '');
  const newPin = document.getElementById("settingNewPin").value.trim();

  if (numInput.length < 10) {
    alert("Please enter a valid WhatsApp number with country code (e.g. 919876543210).");
    return;
  }

  localStorage.setItem("chan_attar_whatsapp", numInput);

  if (newPin) {
    if (newPin.length < 4) {
      alert("PIN should be at least 4 digits.");
      return;
    }
    localStorage.setItem("chan_attar_admin_pin", newPin);
    showAdminToast("WhatsApp number & PIN updated successfully!");
  } else {
    showAdminToast("WhatsApp number updated successfully!");
  }

  document.getElementById("settingNewPin").value = "";
}

function showAdminToast(msg) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMsg");
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

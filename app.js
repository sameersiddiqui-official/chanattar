/**
 * CHAN ATTAR COLLECTION - CLIENT JAVASCRIPT
 * Real-time dynamic product rendering, cart state, WhatsApp order formulation & Admin database sync
 */

// Initial 12 Luxury Signature Products
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Royal Oudh Al-Maliki",
    category: "oudh",
    badge: "Royal Grade",
    notes: "Aged Cambodian Agarwood, Golden Amber & Mysore Sandal",
    desc: "A timeless masterpiece extracted through steam distillation of mature agarwood heartwood. Deep, balsamic, smoky with a smooth royal honeyed dry-down.",
    price6ml: 1299,
    price12ml: 2399,
    image: "images/oudh.jpg",
    inStock: true,
    stockQty: 45
  },
  {
    id: 2,
    name: "Rooh Gulab Khas (Pure Damascena)",
    category: "rose",
    badge: "Pure Extrait",
    notes: "Fresh Kannauj Damask Rose Petals & White Musk",
    desc: "Crafted by traditional hydro-distillation (Deg & Bhapka). It takes over 4,000 kg of fresh rose petals to extract 1 kg of this divine pure rose elixir.",
    price6ml: 999,
    price12ml: 1850,
    image: "images/rose.jpg",
    inStock: true,
    stockQty: 30
  },
  {
    id: 3,
    name: "Kasturi White Deer Musk",
    category: "musk",
    badge: "Bestseller",
    notes: "Clean White Musk, Soft Powdery Vanilla & Floral Amber",
    desc: "A cruelty-free botanical deer musk formulation. Radiates an ethereal clean aura that blends naturally with your body warmth to last beyond 24 hours.",
    price6ml: 850,
    price12ml: 1599,
    image: "images/musk.jpg",
    inStock: true,
    stockQty: 60
  },
  {
    id: 4,
    name: "Shamama-tul-Amber No. 1",
    category: "oudh",
    badge: "Heritage Blend",
    notes: "Over 40 Rare Herbs, Saffron, Spices & Aged Amber",
    desc: "An intricate traditional Indian formulation aged for months in leather kuppis. Earthy, rich, warming, and famously protective in winter seasons.",
    price6ml: 1100,
    price12ml: 2050,
    image: "images/oudh.jpg",
    inStock: true,
    stockQty: 25
  },
  {
    id: 5,
    name: "Mogra Royale (Arabian Jasmine)",
    category: "rose",
    badge: "Evening Special",
    notes: "Night Blooming Jasmine Sambac, Neroli & Green Tea",
    desc: "An enchanting white floral fragrance that evokes memories of royal courtyards under starry skies. Sweet, intoxicating, and uplifting.",
    price6ml: 799,
    price12ml: 1499,
    image: "images/rose.jpg",
    inStock: true,
    stockQty: 40
  },
  {
    id: 6,
    name: "Sandalwood Mysore Supreme",
    category: "oudh",
    badge: "Rare Heritage",
    notes: "Pure Santalum Album Heartwood & Warm Cream",
    desc: "Distilled from high-oil content mature sandalwood. Incredibly smooth, buttery, meditative, and historically used for spiritual grounding.",
    price6ml: 1499,
    price12ml: 2799,
    image: "images/oudh.jpg",
    inStock: true,
    stockQty: 18
  },
  {
    id: 7,
    name: "Ambergris Blanc (White Amber)",
    category: "musk",
    badge: "Oceanic Amber",
    notes: "Crisp Salty Sea Breeze, Grey Amber & Solar Notes",
    desc: "Captivating mineralic warmth blended with solar musks. Ethereal, modern, and leaves an unforgettable magnetic impression wherever you walk.",
    price6ml: 1199,
    price12ml: 2199,
    image: "images/musk.jpg",
    inStock: true,
    stockQty: 35
  },
  {
    id: 8,
    name: "Jannat-ul-Firdous Vintage",
    category: "fresh",
    badge: "Spiritual Classic",
    notes: "Bergamot, Mint, Cinnamon, Blue Lotus & Balsam",
    desc: "The celestial garden of paradise. A revitalizing green-oriental blend beloved across generations for festive gatherings and Friday prayers.",
    price6ml: 650,
    price12ml: 1199,
    image: "images/rose.jpg",
    inStock: true,
    stockQty: 75
  },
  {
    id: 9,
    name: "Taif Rose & Saffron Infusion",
    category: "rose",
    badge: "Luxury Special",
    notes: "High Mountain Taif Rose, Kashmiri Mongra Saffron & Honey",
    desc: "A regal combination of tart Taif roses and golden hand-picked saffron pistils. Bold, aromatic, and distinctly opulent.",
    price6ml: 1350,
    price12ml: 2499,
    image: "images/rose.jpg",
    inStock: true,
    stockQty: 22
  },
  {
    id: 10,
    name: "Mitti Attar (Petrichor / Pehle Baarish)",
    category: "fresh",
    badge: "Nature's Wonder",
    notes: "Baked Earth, River Clay & Mysore Sandalwood Base",
    desc: "The magical scent of first raindrops hitting sun-baked earth. Distilled from earthen clay pots, pure nostalgia in every droplet.",
    price6ml: 899,
    price12ml: 1699,
    image: "images/oudh.jpg",
    inStock: true,
    stockQty: 50
  },
  {
    id: 11,
    name: "Black Musk Al-Kashmiri",
    category: "musk",
    badge: "Potent & Heavy",
    notes: "Dark Animalic Musk, Patchouli, Leather & Smoke",
    desc: "Deep, intense, masculine and powerful. Designed for lovers of strong traditional attars that command attention across the room.",
    price6ml: 950,
    price12ml: 1799,
    image: "images/musk.jpg",
    inStock: true,
    stockQty: 38
  },
  {
    id: 12,
    name: "Blue Aqua & Cool Vetiver (Khus)",
    category: "fresh",
    badge: "Summer Essential",
    notes: "Wild Green Khus Root, Crisp Citrus, Sea Moss & Cedar",
    desc: "Naturally cooling wild vetiver distilled in copper stills. An exhilarating wave of green earth that instantly beats summer heat.",
    price6ml: 750,
    price12ml: 1399,
    image: "images/musk.jpg",
    inStock: true,
    stockQty: 55
  }
];

// App State
let products = [];
let cart = [];
let selectedSizes = {}; // { productId: '6ml' | '12ml' }
let directBuyProduct = null; // When buying single product via modal
let currentFilter = 'all';
let currentSlide = 0;
let userFeedbackRating = 5;

// WhatsApp Number Config
let adminWhatsAppNumber = "919876543210"; // Default, editable from admin panel

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadAdminSettings();
  loadProducts();
  loadCart();
  renderProducts();
  setupYear();
  setupCarousel();
});

function loadAdminSettings() {
  const savedNumber = localStorage.getItem("chan_attar_whatsapp");
  if (savedNumber) {
    adminWhatsAppNumber = savedNumber.replace(/[^0-9]/g, '');
    const displayEl = document.getElementById("displayWhatsApp");
    if (displayEl) {
      displayEl.textContent = `+${adminWhatsAppNumber} (24x7 Customer Support)`;
    }
  }
}

function loadProducts() {
  const saved = localStorage.getItem("chan_attar_products");
  if (saved) {
    try {
      products = JSON.parse(saved);
    } catch (e) {
      products = [...DEFAULT_PRODUCTS];
    }
  } else {
    products = [...DEFAULT_PRODUCTS];
    localStorage.setItem("chan_attar_products", JSON.stringify(products));
  }

  // Set default sizes to 6ml
  products.forEach(p => {
    if (!selectedSizes[p.id]) {
      selectedSizes[p.id] = '6ml';
    }
  });
}

function loadCart() {
  const saved = localStorage.getItem("chan_attar_cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("chan_attar_cart", JSON.stringify(cart));
  updateCartUI();
}

function setupYear() {
  const y = document.getElementById("currentYear");
  if (y) y.textContent = new Date().getFullYear();
}

// ==========================================================================
// PRODUCT RENDERING (Alternating Layout as specified in prompt)
// ==========================================================================
function renderProducts() {
  const container = document.getElementById("productGrid");
  if (!container) return;

  const filtered = products.filter(p => {
    if (currentFilter === 'all') return true;
    return p.category === currentFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <p>No attars found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((prod, index) => {
    // Alternating Left / Right design
    const isReverse = index % 2 !== 0 ? 'reverse' : '';
    const currentSize = selectedSizes[prod.id] || '6ml';
    const currentPrice = currentSize === '12ml' ? prod.price12ml : prod.price6ml;
    const oldPrice = Math.round(currentPrice * 1.35); // simulated MRP for discount appeal

    return `
      <article class="product-row ${isReverse}" id="product-${prod.id}">
        <!-- Media / Image -->
        <div class="product-media">
          <span class="product-badge">${prod.badge || 'Pure Attar'}</span>
          <img src="${prod.image}" alt="${prod.name}" loading="lazy" onerror="this.src='images/oudh.jpg'">
        </div>

        <!-- Details & Actions -->
        <div class="product-content">
          <span class="product-category-tag">${prod.category.toUpperCase()} EXTRACT</span>
          <h3 class="product-title">${prod.name}</h3>
          
          <div class="product-notes">
            <i class="fas fa-leaf" style="color: var(--accent-light-choc);"></i>
            <span><strong>Scent Notes:</strong> ${prod.notes}</span>
          </div>

          <p class="product-desc">${prod.desc}</p>

          <!-- Bottle Size & Price -->
          <div class="product-options-row">
            <div class="size-selector">
              <span style="font-size: 0.85rem; font-weight: 600; margin-right: 4px;">Size:</span>
              <button type="button" class="size-btn ${currentSize === '6ml' ? 'active' : ''}" 
                      onclick="changeSize(${prod.id}, '6ml')">6ml</button>
              <button type="button" class="size-btn ${currentSize === '12ml' ? 'active' : ''}" 
                      onclick="changeSize(${prod.id}, '12ml')">12ml</button>
            </div>

            <div class="product-price-box">
              <span class="current-price">₹${currentPrice}</span>
              <span class="old-price">₹${oldPrice}</span>
            </div>

            <div class="stock-status">
              ${prod.inStock ? `In Stock (${prod.stockQty || 20} available)` : '<span style="color:red">Out of stock</span>'}
            </div>
          </div>

          <!-- Buttons -->
          <div class="product-actions">
            <button class="btn-buy-whatsapp" onclick="directBuyWhatsApp(${prod.id})">
              <i class="fab fa-whatsapp"></i> Buy on WhatsApp
            </button>
            <button class="btn-add-cart" onclick="addToCart(${prod.id})">
              <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function changeSize(productId, size) {
  selectedSizes[productId] = size;
  renderProducts();
}

function filterProducts(category, btnElement) {
  currentFilter = category;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  renderProducts();
}

// ==========================================================================
// CART FUNCTIONALITY
// ==========================================================================
function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const size = selectedSizes[productId] || '6ml';
  const price = size === '12ml' ? prod.price12ml : prod.price6ml;
  const cartItemKey = `${productId}_${size}`;

  const existingIndex = cart.findIndex(item => item.key === cartItemKey);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      key: cartItemKey,
      id: prod.id,
      name: prod.name,
      size: size,
      price: price,
      image: prod.image,
      qty: 1
    });
  }

  saveCart();
  showToast(`Added ${prod.name} (${size}) to Cart!`);
  toggleCart(true);
}

function updateCartQty(key, delta) {
  const index = cart.findIndex(item => item.key === key);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeCartItem(key) {
  cart = cart.filter(item => item.key !== key);
  saveCart();
}

function toggleCart(isOpen) {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (isOpen) {
    drawer.classList.add("active");
    overlay.classList.add("active");
  } else {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const listContainer = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) badge.textContent = totalCount;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (totalEl) totalEl.textContent = `₹${subtotal}`;

  if (!listContainer) return;

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon"><i class="fas fa-shopping-bag"></i></div>
        <h4>Your Bag is Empty</h4>
        <p style="font-size: 0.85rem; margin-top: 6px;">Add a bottle from our signature collection to begin.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = cart.map(item => `
    <div class="cart-item-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-meta">Size: ${item.size} &bull; ₹${item.price} each</div>
        <div class="cart-item-price">Total: ₹${item.price * item.qty}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateCartQty('${item.key}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.key}', 1)">+</button>
          <button class="qty-btn" style="margin-left: auto; color: red;" onclick="removeCartItem('${item.key}')" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// WHATSAPP ORDER SUBMISSION & ADMIN DATABASE LOGGING
// ==========================================================================
function directBuyWhatsApp(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const size = selectedSizes[productId] || '6ml';
  const price = size === '12ml' ? prod.price12ml : prod.price6ml;

  directBuyProduct = {
    id: prod.id,
    name: prod.name,
    size: size,
    price: price,
    qty: 1
  };

  const modalPayable = document.getElementById("modalPayableAmount");
  if (modalPayable) {
    modalPayable.textContent = `₹${price} (${prod.name} - ${size})`;
  }

  openCheckoutModal();
}

function openCheckoutModal() {
  if (!directBuyProduct && cart.length === 0) {
    showToast("Your cart is empty! Please select an attar first.");
    return;
  }

  if (!directBuyProduct) {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const modalPayable = document.getElementById("modalPayableAmount");
    if (modalPayable) modalPayable.textContent = `₹${subtotal} (${cart.length} items)`;
  }

  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("active");
  toggleCart(false);
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("active");
  directBuyProduct = null;
}

function submitWhatsAppOrder(event) {
  event.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const pincode = document.getElementById("custPincode").value.trim();
  const payMode = document.getElementById("payMode").value;

  let orderItems = [];
  let totalAmount = 0;

  if (directBuyProduct) {
    orderItems = [directBuyProduct];
    totalAmount = directBuyProduct.price;
  } else {
    orderItems = [...cart];
    totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  const orderId = "CHA-" + Math.floor(100000 + Math.random() * 900000);
  const orderTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. SAVE TO ADMIN DATABASE (localStorage: chan_attar_orders)
  const newOrder = {
    orderId: orderId,
    timestamp: orderTime,
    customer: {
      name: name,
      phone: phone,
      address: address,
      city: city,
      pincode: pincode
    },
    paymentMethod: payMode,
    items: orderItems,
    total: totalAmount,
    status: "Pending Confirmation"
  };

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("chan_attar_orders")) || [];
  } catch (e) {
    orders = [];
  }
  orders.unshift(newOrder);
  localStorage.setItem("chan_attar_orders", JSON.stringify(orders));

  // 2. FORMULATE WHATSAPP MESSAGE
  let itemsText = orderItems.map((item, idx) => {
    return `${idx + 1}. *${item.name}* (${item.size}) x ${item.qty} = ₹${item.price * item.qty}`;
  }).join("\n");

  const waMessage = 
`👑 *NEW ORDER - CHAN ATTAR COLLECTION* 👑
-------------------------------------
*Order ID:* #${orderId}
*Date:* ${orderTime}

👤 *Customer Details:*
• Name: ${name}
• Phone: ${phone}
• Delivery Address: ${address}, ${city} - ${pincode}
• Payment Preference: ${payMode}

📦 *Items Ordered:*
${itemsText}

💰 *Grand Total Payable:* ₹${totalAmount}
🚚 *Shipping:* FREE (Standard Express)
-------------------------------------
Hello Admin, please confirm this order and dispatch details!`;

  // 3. Clear cart if cart checkout
  if (!directBuyProduct) {
    cart = [];
    saveCart();
  }
  directBuyProduct = null;
  closeCheckoutModal();
  document.getElementById("checkoutForm").reset();

  showToast("Order logged! Opening WhatsApp...");

  // Open WhatsApp
  const encodedMsg = encodeURIComponent(waMessage);
  const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMsg}`;
  window.open(waUrl, "_blank");
}

function openWhatsAppDirect() {
  const defaultText = encodeURIComponent("Salam / Hello! I would like to inquire about the Chan Attar Collection and recommend signature scents.");
  window.open(`https://wa.me/${adminWhatsAppNumber}?text=${defaultText}`, "_blank");
}

// ==========================================================================
// FEEDBACK & REVIEWS
// ==========================================================================
function setRating(rating) {
  userFeedbackRating = rating;
  const stars = document.querySelectorAll(".star-rate");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

function handleFeedbackSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("fbName").value.trim();
  const phone = document.getElementById("fbPhone").value.trim();
  const message = document.getElementById("fbMessage").value.trim();

  const feedbackObj = {
    id: Date.now(),
    name: name,
    phone: phone,
    rating: userFeedbackRating,
    message: message,
    date: new Date().toLocaleDateString()
  };

  let feedbacks = [];
  try {
    feedbacks = JSON.parse(localStorage.getItem("chan_attar_feedbacks")) || [];
  } catch (e) {
    feedbacks = [];
  }
  feedbacks.unshift(feedbackObj);
  localStorage.setItem("chan_attar_feedbacks", JSON.stringify(feedbacks));

  showToast("Thank you for your valuable feedback!");
  document.getElementById("feedbackForm").reset();
  setRating(5);
}

// ==========================================================================
// HERO CAROUSEL & TOASTS
// ==========================================================================
function setupCarousel() {
  setInterval(() => {
    currentSlide = (currentSlide + 1) % 3;
    goToSlide(currentSlide);
  }, 4500);
}

function goToSlide(index) {
  currentSlide = index;
  const slider = document.getElementById("heroSlider");
  if (slider) {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, idx) => {
    if (idx === index) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById("navLinks");
  if (menu) menu.classList.toggle("active");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toastMsg");
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

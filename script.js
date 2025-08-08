/*
 * script.js
 * Handles product data, cart functionality and page-specific rendering.
 */

// Define product catalogue
const products = [
  {
    id: 'advent',
    name: 'Bài giảng Mùa Vọng',
    description:
      'Bộ file trình chiếu cho Mùa Vọng, giúp cộng đoàn và lớp giáo lý sống tinh thần chuẩn bị và chờ đợi.',
    price: 0,
    image: 'images/advent.png',
    file: 'advent.pptx',
    category: 'Mùa Vọng',
  },
  {
    id: 'christmas',
    name: 'Bài giảng Giáng Sinh',
    description:
      'File trình chiếu mừng Chúa giáng trần, thích hợp cho thánh lễ và sinh hoạt Giáng Sinh.',
    price: 0,
    image: 'images/christmas.png',
    file: 'christmas.pptx',
    category: 'Giáng Sinh',
  },
  {
    id: 'lent',
    name: 'Bài giảng Mùa Chay',
    description:
      'Bộ slide về cầu nguyện, ăn chay và làm việc bác ái, giúp cộng đoàn sống Mùa Chay sâu sắc.',
    price: 10,
    image: 'images/lent.png',
    file: 'lent.pptx',
    category: 'Mùa Chay',
  },
  {
    id: 'easter',
    name: 'Bài giảng Phục Sinh',
    description:
      'Slide về mầu nhiệm Phục Sinh và niềm vui sống lại, dùng cho các buổi cử hành và học hỏi.',
    price: 15,
    image: 'images/easter.png',
    file: 'easter.pptx',
    category: 'Phục Sinh',
  },
];

// Utility functions for cart management
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : {};
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  let count = 0;
  for (const id in cart) {
    count += cart[id];
  }
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

function addToCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId] += 1;
  } else {
    cart[productId] = 1;
  }
  saveCart(cart);
  updateCartCount();
  alert('Đã thêm vào giỏ hàng!');
}

function removeFromCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    delete cart[productId];
    saveCart(cart);
    updateCartCount();
    renderCart();
  }
}

function changeQuantity(productId, quantity) {
  const cart = getCart();
  if (quantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = quantity;
  }
  saveCart(cart);
  updateCartCount();
  renderCart();
}

// Render products page
function renderProductsPage() {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Group products by category
  const categories = {};
  products.forEach((p) => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  // Build HTML for each category
  for (const categoryName in categories) {
    const section = document.createElement('section');
    section.id = categoryName;
    const heading = document.createElement('h2');
    heading.textContent = categoryName;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'categories';
    categories[categoryName].forEach((product) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <p class="card-text">${product.description}</p>
          <p class="price">
            ${product.price > 0 ? product.price.toFixed(2) + ' USD' : 'Miễn phí'}
          </p>
          <div>
            <a href="product.html?id=${product.id}" class="btn" style="margin-right:0.5rem;">Chi tiết</a>
            ${product.price > 0
              ? `<button onclick="addToCart('${product.id}')">Thêm vào giỏ</button>`
              : `<a href="${product.file}" download class="btn">Tải về</a>`}
          </div>
        </div>`;
      grid.appendChild(card);
    });
    section.appendChild(grid);
    container.appendChild(section);
  }
}

// Render product detail page
function renderProductDetail() {
  const detailContainer = document.getElementById('product-detail');
  if (!detailContainer) return;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const product = products.find((p) => p.id === id);
  if (!product) {
    detailContainer.textContent = 'Không tìm thấy sản phẩm.';
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'product-detail';
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  const info = document.createElement('div');
  info.className = 'product-info';
  info.innerHTML = `
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p class="price">${product.price > 0 ? product.price.toFixed(2) + ' USD' : 'Miễn phí'}</p>
    <div>
      ${product.price > 0
        ? `<button onclick="addToCart('${product.id}')">Thêm vào giỏ hàng</button>`
        : `<a href="${product.file}" download class="btn">Tải xuống miễn phí</a>`}
    </div>
  `;
  wrapper.appendChild(img);
  wrapper.appendChild(info);
  detailContainer.appendChild(wrapper);
}

// Render cart page
function renderCart() {
  const tableBody = document.getElementById('cart-table-body');
  const totalContainer = document.getElementById('cart-total');
  if (!tableBody || !totalContainer) return;

  const cart = getCart();
  tableBody.innerHTML = '';
  let total = 0;
  for (const id in cart) {
    const quantity = cart[id];
    const product = products.find((p) => p.id === id);
    if (!product) continue;
    const row = document.createElement('tr');
    const lineTotal = (product.price * quantity);
    total += lineTotal;
    row.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <img src="${product.image}" alt="${product.name}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;" />
          <span>${product.name}</span>
        </div>
      </td>
      <td>${product.price > 0 ? product.price.toFixed(2) + ' USD' : '0'}</td>
      <td>
        <input type="number" class="quantity-input" min="1" value="${quantity}" onchange="changeQuantity('${id}', parseInt(this.value))" />
      </td>
      <td>${lineTotal.toFixed(2)} USD</td>
      <td><button onclick="removeFromCart('${id}')">Xoá</button></td>
    `;
    tableBody.appendChild(row);
  }
  totalContainer.textContent = 'Tổng cộng: ' + total.toFixed(2) + ' USD';
}

// Render checkout page
function renderCheckout() {
  const tableBody = document.getElementById('checkout-table-body');
  const totalContainer = document.getElementById('checkout-total');
  const completeBtn = document.getElementById('complete-order');
  const message = document.getElementById('order-message');
  if (!tableBody || !totalContainer) return;
  const cart = getCart();
  tableBody.innerHTML = '';
  let total = 0;
  for (const id in cart) {
    const quantity = cart[id];
    const product = products.find((p) => p.id === id);
    if (!product) continue;
    const row = document.createElement('tr');
    const lineTotal = product.price * quantity;
    total += lineTotal;
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price > 0 ? product.price.toFixed(2) + ' USD' : '0'}</td>
      <td>${quantity}</td>
      <td>${lineTotal.toFixed(2)} USD</td>
    `;
    tableBody.appendChild(row);
  }
  totalContainer.textContent = 'Tổng cộng: ' + total.toFixed(2) + ' USD';
  if (completeBtn) {
    completeBtn.onclick = () => {
      // Clear cart and show thank you message
      saveCart({});
      updateCartCount();
      tableBody.innerHTML = '';
      totalContainer.textContent = '';
      message.textContent =
        'Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn để xác nhận.';
    };
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProductsPage();
  renderProductDetail();
  renderCart();
  renderCheckout();
});
let cart = []; 

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateHeaderCart() {
  const cartTotalElement = document.querySelector('.cart-total');
  if (cartTotalElement) {
    cartTotalElement.textContent = '$1290.00';
  }

  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? 'inline-block' : 'none';
  }
}

function renderCartOffcanvas() {
  const offcanvasBody = document.querySelector('#offcanvasCart .offcanvas-body .order-md-last');
  if (!offcanvasBody) return;

  let html = `
    <h4 class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-warning">Your cart</span>
      <span class="badge bg-warning rounded-pill">${cart.reduce((s, i) => s + i.quantity, 0)}</span>
    </h4>
    <ul class="list-group mb-3">
  `;

  if (cart.length === 0) {
    html += `
      <li class="list-group-item text-center text-muted py-4">
        Empty Cart
      </li>
    `;
  } else {
    cart.forEach(item => {
      html += `
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">${item.name}</h6>
            <small class="text-body-secondary">Qty: ${item.quantity}</small>
          </div>
          <span class="text-body-secondary">$${(item.price * item.quantity).toFixed(2)}</span>
        </li>
      `;
    });
  }

  html += `
      <li class="list-group-item d-flex justify-content-between">
        <span>Total (USD)</span>
        <strong>$${calculateTotal().toFixed(2)}</strong>
      </li>
    </ul>
    <button class="w-100 btn btn-warning btn-lg" type="submit">
      Continue to checkout
    </button>
  `;

  offcanvasBody.innerHTML = html;
}

function addToCart(productId, quantity = 1) {
  const product = allProducts.find(p => p.id === productId || p.id === Number(productId));
  if (!product) {
    console.warn(`Not found product with id: ${productId}`);
    return;
  }

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
    });
  }

  saveCart();
  updateHeaderCart();
  renderCartOffcanvas();
}

document.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('increment')) {
    const qtySpan = target.closest('.quantity-box').querySelector('.quantity');
    if (qtySpan) {
      let qty = parseInt(qtySpan.textContent) || 1;
      qtySpan.textContent = qty + 1;
    }
    return;
  }

  if (target.classList.contains('decrement')) {
    const qtySpan = target.closest('.quantity-box').querySelector('.quantity');
    if (qtySpan) {
      let qty = parseInt(qtySpan.textContent) || 1;
      if (qty > 1) {
        qtySpan.textContent = qty - 1;
      }
    }
    return;
  }

  if (target.classList.contains('add-to-cart')) {
    const qtySpan = target.closest('.product-card').querySelector('.quantity');
    const qty = qtySpan ? parseInt(qtySpan.textContent) || 1 : 1;

    const id = target.dataset.id;

    addToCart(id, qty);

    if (qtySpan) qtySpan.textContent = '1';
    return;
  }
});
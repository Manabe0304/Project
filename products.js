const PRODUCT_API = "https://698d3dc6b79d1c928ed4c872.mockapi.io/api/project/Products";

let allProducts = [];
let catIndex = 0;
let bestIndex = 0;

fetch(PRODUCT_API)
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    renderTrending(data, "All");
    renderBestSelling(data);
    setupFilter(data);
  });

function renderTrending(products, type = "All") {
  const container = document.getElementById("trending-list");

  let filtered = products;

  if (type !== "All") {
    filtered = products.filter(
      (p) => p.type?.trim().toLowerCase() === type.trim().toLowerCase(),
    );
  }

  const sorted = [...filtered]
    .sort((a, b) => b.soldYear - a.soldYear)
    .slice(0, 10);

  container.innerHTML = sorted
    .map(
      (p) => `
  <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
    <div class="product-card p-3">

      <div class="img-box position-relative">
        <span class="badge bg-success discount-badge">
          -${p.discount ?? 0}%
        </span>

        <span class="position-absolute top-0 end-0 m-2">
           <button 
              type="button" 
              class="btn btn-sm btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center wishlist-btn"
              style="width: 38px; height: 38px;"
              data-bs-toggle="tooltip" 
              title="Add to wishlist"
            >
            <i class="bi bi-heart fs-5 text-muted"></i>
          </button>
        </span>

        <img src="${p.image}" class="img-fluid product-img">
      </div>

      <h6 class="mt-3 product-name">${p.name}</h6>

      <div class="small text-muted d-flex align-items-center gap-2 mt-1">
        <span>1 UNIT</span>
        <span class="d-flex align-items-center gap-1">
          <i class="bi bi-star-fill text-warning"></i>
          <span class="fw-semibold text-warning">${p.rating ?? 4.5}</span>
        </span>
      </div>

      <div class="fw-bold fs-5 mt-1 text-success">
        $${Number(p.price).toFixed(2)}
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="quantity-box d-flex align-items-center border rounded">
          <button class="btn btn-sm decrement" data-id="${p.id}">-</button>
          <span class="quantity mx-3" data-id="${p.id}">1</span>
          <button class="btn btn-sm increment" data-id="${p.id}">+</button>
        </div>

        <button class="btn btn-outline-success btn-sm add-to-cart" data-id="${p.id}">
          Add to Cart
        </button>
      </div>

    </div>
  </div>
`,
    )
    .join("");
}

function setupFilter(products) {
  const tabs = document.querySelectorAll(".trending-filter a");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      tabs.forEach((t) => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");

      renderTrending(products, tab.textContent.trim());
    });
  });
}

function renderBestSelling(products) {
  const track = document.getElementById("best-track");

  const sorted = [...products]
    .sort((a, b) => b.soldMonth - a.soldMonth)
    .slice(0, 10);

  track.innerHTML = sorted
    .map(
      (p) => `
  <div class="best-item me-5">
    <div class="product-card text-center p-4 position-relative d-flex flex-column h-100">

      <div class="img-box position-relative">
        <span class="badge bg-success discount-badge position-absolute top-0 start-0 m-2">
          -${p.discount ?? 0}%
        </span>

        <span class="position-absolute top-0 end-0 p-2" aria-label="Add to wishlist">
           <button 
              type="button" 
              class="btn btn-sm btn-light rounded-circle shadow-sm wishlist-btn"
              data-bs-toggle="tooltip" 
              title="Add to wishlist"
           >
              <i class="bi bi-heart fs-5 text-muted"></i>
           </button>
        </span>

        <img src="${p.image}" class="img-fluid product-img mb-2">
      </div>

      <h6 class="mt-3 product-name">${p.name}</h6>

      <div class="small text-muted d-flex align-items-center gap-2 mt-1">
        <span>1 UNIT</span>
        <span class="d-flex align-items-center gap-1">
            <i class="bi bi-star-fill text-warning"></i>
            <span class="fw-semibold text-warning">${p.rating ?? 4.5}</span>
        </span>
      </div>

      <div class="fw-bold fs-5 mt-1 text-success">
        $${Number(p.price).toFixed(2)}
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="quantity-box d-flex align-items-center border rounded">
          <button class="btn btn-sm decrement" data-id="${p.id}">-</button>
          <span class="quantity mx-3" data-id="${p.id}">1</span>
          <button class="btn btn-sm increment" data-id="${p.id}">+</button>
        </div>

        <button class="btn btn-outline-success btn-sm add-to-cart" data-id="${p.id}">
          Add to Cart
        </button>
      </div>

    </div>
  </div>
`,
    )
    .join("");

  slideBest();
}

function slideBest() {
  const track = document.getElementById("best-track");
  const items = document.querySelectorAll(".best-item");

  document.getElementById("best-next").onclick = () => {
    bestIndex++;

    if (bestIndex > items.length - 5) {
      bestIndex = 0;
    }

    track.style.transform = `translateX(-${bestIndex * 230}px)`;
  };

  document.getElementById("best-prev").onclick = () => {
    bestIndex--;

    if (bestIndex < 0) {
      bestIndex = items.length - 5;
    }

    track.style.transform = `translateX(-${bestIndex * 230}px)`;
  };
}

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.wishlist-btn');
  if (!btn) return;

  const icon = btn.querySelector('i');
  if (!icon) return;

  btn.classList.toggle('active');

  if (btn.classList.contains('active')) {
    icon.className = 'bi bi-heart-fill fs-5 text-danger';
  } else {
    icon.className = 'bi bi-heart fs-5 text-muted';
  }
});

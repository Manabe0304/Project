const CATEGORY_API = "https://698d3dc6b79d1c928ed4c872.mockapi.io/api/project/Categories";

let currentIndex = 0;
let categories = [];

fetch(CATEGORY_API)
  .then(res => res.json())
  .then(data => {

    categories = data;

    const track = document.getElementById("category-track");

    track.innerHTML = categories.map(cat => `
      <div class="category-item me-3">
        <div class="circle-bg circle-sm mx-auto mb-2">
          <img src="${cat.icon}" class="cat-img" />
        </div>
        <p class="fw-semibold">${cat.name}</p>
      </div>
    `).join("");

    setupSlide();
  })
  .catch(err => console.error(err));


function setupSlide() {
  const track = document.getElementById("category-track");
  const total = categories.length;

  document.getElementById("cat-next").onclick = () => {

    currentIndex++;

    if (currentIndex >= total - 4) {
      currentIndex = 0;
    }

    track.style.transform = `translateX(-${currentIndex * 220}px)`;
  };

  document.getElementById("cat-prev").onclick = () => {

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = total - 5;
    }

    track.style.transform = `translateX(-${currentIndex * 220}px)`;
  };
}

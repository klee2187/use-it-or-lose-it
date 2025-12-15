import {
  initNavbarToggle,
  initAlertDismiss,
  loadRecipes,
  getFavorites,
  toggleFavorite,
  showToast,
  initBackToTop
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbarToggle();
  initAlertDismiss();
  initBackToTop();

  const gallery = document.querySelector(".recipe-gallery");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");

  let recipes = await loadRecipes();
  let filtered = [...recipes];

  const render = () => {
    const favs = getFavorites();
    gallery.innerHTML = "";
    filtered.forEach(r => {
      gallery.appendChild(renderCard(r, favs.includes(r.id)));
    });
  };

  const applyFilters = () => {
    const term = (searchInput?.value || "").toLowerCase().trim();
    const type = typeFilter?.value || "";

    filtered = recipes.filter(r => {
      const nameMatch = r.name.toLowerCase().includes(term);
      const ingredientsMatch = Array.isArray(r.ingredients)
        ? r.ingredients.some(i => i.toLowerCase().includes(term))
        : false;
      const typeMatch = type ? (r.course === type) : true;
      return (nameMatch || ingredientsMatch) && typeMatch;
    });
    render();
  };

  render();
  searchInput?.addEventListener("input", applyFilters);
  typeFilter?.addEventListener("change", applyFilters);
  clearFiltersBtn?.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    filtered = [...recipes];
    render();
  });

  gallery.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();

    const id = parseInt(btn.dataset.id, 10);
    const result = toggleFavorite(id);
    btn.classList.toggle("active", result.active);
    btn.setAttribute("aria-label", result.active ? "Remove from favorites" : "Add to favorites");
    btn.setAttribute("aria-pressed", result.active ? "true" : "false");

    showToast(result.active ? "Added to favorites ❤️" : "Removed from favorites 💔");
  });
});

function renderCard(recipe, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;

  const card = document.createElement("a");
  card.href = `recipe-detail.html?id=${id}`;
  card.className = "recipe-card fade-in";

  const img = document.createElement("img");
  img.src = image || "images/placeholder.jpg";
  img.alt = name;
  img.loading = "lazy";

  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h3");
  title.className = "recipe-title";
  title.textContent = `🍴 ${name}`;

  const type = document.createElement("p");
  type.className = "recipe-type";
  type.innerHTML = `<strong>Type:</strong> ${course || "Uncategorized"}`;

  const ing = document.createElement("p");
  ing.className = "ingredients";
  ing.innerHTML = `<strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}`;

  const favBtn = document.createElement("button");
  favBtn.className = `fav-btn ${isFav ? "active" : ""}`;
  favBtn.dataset.id = id;
  favBtn.setAttribute("aria-label", isFav ? "Remove from favorites" : "Add to favorites");
  favBtn.setAttribute("aria-pressed", isFav ? "true" : "false");
  favBtn.innerHTML = `<span class="heart-icon">♥</span>`;

  info.appendChild(title);
  info.appendChild(type);
  info.appendChild(ing);
  info.appendChild(favBtn);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}
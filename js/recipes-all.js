import {
  initNavbarToggle,
  initAlertDismiss,
  loadRecipes,
  getFavorites,
  isFavorite,
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
    gallery.innerHTML = filtered.map(r => renderCard(r, favs.includes(r.id))).join("");
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

    showToast(result.active ? "Added to favorites ❤️" : "Removed from favorites 💔");
  });
});

function renderCard(recipe, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;
  return `
    <a href="recipe-detail.html?id=${id}" class="recipe-card fade-in">
      <img src="${image || 'images/placeholder.jpg'}" alt="${name}" loading="lazy" />
      <div class="info">
        <h3>🍴 ${name}</h3>
        <p>Type: ${course || 'Uncategorized'}</p>
        <p class="ingredients">Key Ingredients: ${ingredients.slice(0,5).join(", ")}</p>
        <button class="fav-btn ${isFav ? "active" : ""}" data-id="${id}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </a>
  `;
}
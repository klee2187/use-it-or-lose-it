import {
  initNavbarToggle,
  loadRecipes,
  getFavorites,
  toggleFavorite,
  showToast,
  initBackToTop
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbarToggle();
  initBackToTop();

  const gallery = document.querySelector(".favorites-grid");
  const recipes = await loadRecipes();
  let favorites = getFavorites();

  if (!favorites.length) {
    gallery.innerHTML = '<p>You have no favorite recipes yet.</p>';
    return;
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  if (!favoriteRecipes.length) {
    gallery.innerHTML = '<p>No matching recipes found in favorites.</p>';
    return;
  }

  gallery.innerHTML = favoriteRecipes.map(r => renderCard(r, true)).join("");

  // Toggle/remove favorites
  gallery.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();

    const id = parseInt(btn.dataset.id, 10);
    const result = toggleFavorite(id);

    btn.classList.toggle("active", result.active);
    btn.setAttribute("aria-label", result.active ? "Remove from favorites" : "Add to favorites");

    const card = btn.closest(".recipe-card");
    if (!result.active && card) {
      card.classList.add("fade-out");
      setTimeout(() => {
        card.remove();
        if (!gallery.children.length) {
          gallery.innerHTML = '<p>You have no favorite recipes yet.</p>';
        }
      }, 300);
      showToast("Removed from favorites 💔");
    } else {
      showToast("Added to favorites ❤️");
    }
  });
});

function renderCard(recipe, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;
  return `
    <a href="recipe-detail.html?id=${id}" class="recipe-card fade-in">
      <img src="${image || 'images/placeholder.jpg'}" alt="${name}" loading="lazy" />
      <div class="info">
        <h3 class="recipe-title">${name}</h3>
        <p class="recipe-type"><strong>Type:</strong> ${course || 'Uncategorized'}</p>
        <p class="ingredients"><strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}</p>
        <button class="fav-btn ${isFav ? "active" : ""}" data-id="${id}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </a>
  `;
}
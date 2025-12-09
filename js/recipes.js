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

  const featuredSection = document.querySelector(".featured-recipe-content");
  const gallery = document.querySelector(".recipe-gallery");

  const recipes = await loadRecipes();
  const favorites = getFavorites();

  // Shuffle recipes
  const shuffled = [...recipes].sort(() => 0.5 - Math.random());

  // Featured recipe
  const featuredRecipe = shuffled[0];
  if (featuredRecipe && featuredSection) {
    featuredSection.innerHTML = renderCard(featuredRecipe, true, isFavorite(featuredRecipe.id));
  }

  // 3 random curated recipes
  const curated = shuffled.slice(1, 4);
  gallery.innerHTML = curated.map(r => renderCard(r, false, favorites.includes(r.id))).join("");

  // Heart toggle delegation
  document.getElementById("main").addEventListener("click", e => {
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

function renderCard(recipe, isFeatured, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;
  const heartClass = isFav ? "active" : "";

function renderCard(recipe, isFeatured, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;
  const sectionClass = isFeatured ? "featured-card" : "recipe-card";
  const heartClass = isFav ? "active" : "";

  // Build card HTML
  const cardHTML = `
    <a href="recipe-detail.html?id=${id}" class="${sectionClass} fade-in">
      <img src="${image || 'images/placeholder.jpg'}" alt="${name}" loading="lazy" />
      <div class="info">
        <h3 class="recipe-title">${name}</h3>
        <p class="recipe-type"><strong>Type:</strong> ${course || 'Uncategorized'}</p>
        <p class="ingredients"><strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}</p>
        ${isFeatured ? `<a href="recipe-detail.html?id=${id}" class="view-recipe-btn">View Recipe</a>` : ""}
        <button class="fav-btn ${heartClass}" data-id="${id}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </a>
  `;

  // Temporary wrapper
  const wrapper = document.createElement("div");
  wrapper.innerHTML = cardHTML.trim();
  const card = wrapper.firstChild;

  // Find the image and remove shimmer once loaded
  const img = card.querySelector("img");
  if (img) {
    img.addEventListener("load", () => {
      img.style.background = "none";
      img.style.animation = "none";
    });
    img.addEventListener("error", () => {
      // fallback if image fails
      img.style.background = "none";
      img.style.animation = "none";
      img.src = "images/placeholder.jpg";
    });
  }

  return card.outerHTML;
}

  // Curated card fallback
  return `
    <a href="recipe-detail.html?id=${id}" class="recipe-card fade-in">
      <img src="${image || 'images/placeholder.jpg'}" alt="${name}" loading="lazy" />
      <div class="info">
        <h3 class="recipe-title">${name}</h3>
        <p class="recipe-type"><strong>Type:</strong> ${course || 'Uncategorized'}</p>
        <p class="ingredients"><strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}</p>
        <button class="fav-btn ${heartClass}" data-id="${id}" aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </a>
  `;
}
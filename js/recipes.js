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
  
  const shuffled = [...recipes].sort(() => 0.5 - Math.random());
  
  const featuredRecipe = shuffled[0];
  if (featuredRecipe && featuredSection) {
    featuredSection.innerHTML = "";
    featuredSection.appendChild(renderCard(featuredRecipe, true, isFavorite(featuredRecipe.id)));
  }
  
  const curated = shuffled.slice(1, 4);
  gallery.innerHTML = "";
  curated.forEach(r => {
    gallery.appendChild(renderCard(r, false, favorites.includes(r.id)));
  });
  
  document.getElementById("main").addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = parseInt(btn.dataset.id, 10);
    const result = toggleFavorite(id);
    btn.classList.toggle("active", result.active);
    btn.setAttribute("aria-label", result.active ? "Remove from favorites" : "Add to favorites");
    btn.setAttribute("aria-pressed", result.active ? "true" : "false");

    showToast(result.active ? "Added to favorites ❤️" : "Removed from favorites 💔");
  });
});
  
function renderCard(recipe, isFeatured, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;
  const sectionClass = isFeatured ? "featured-card" : "recipe-card";

  const card = document.createElement("a");
  card.href = `recipe-detail.html?id=${id}`;
  card.className = `${sectionClass} fade-in`;

  const img = document.createElement("img");
  img.src = image || "images/placeholder.jpg";
  img.alt = name;
  img.loading = "lazy";

  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h3");
  title.className = "recipe-title";
  title.textContent = name;

  const type = document.createElement("p");
  type.className = "recipe-type";
  type.innerHTML = `<strong>Type:</strong> ${course || "Uncategorized"}`;

  const ing = document.createElement("p");
  ing.className = "ingredients";
  ing.innerHTML = `<strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}`;

  // Create favorite button
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
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
  
  gallery.innerHTML = "";
  favoriteRecipes.forEach(r => {
    const card = renderCard(r, true);
    gallery.appendChild(card);
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

    const card = btn.closest(".recipe-card");
    if (!result.active && card) {
      card.classList.add("fade-out");
      setTimeout(() => {
        card.remove();
        if (!gallery.children.length) {
          gallery.innerHTML = '<p>You have no favorite recipes yet.</p>';
        }
      }, 400);
      showToast("Removed from favorites 💔");
    } else {
      showToast("Added to favorites ❤️");
    }
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
  title.textContent = name;

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
  favBtn.innerHTML = `<span class="heart-icon">❤️</span>`;

  info.appendChild(title);
  info.appendChild(type);
  info.appendChild(ing);
  info.appendChild(favBtn);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}
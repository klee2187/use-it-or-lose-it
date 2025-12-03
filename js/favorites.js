import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const gallery = document.querySelector(".favorites-grid");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.map(favId => parseInt(favId, 10));

  if (!favorites || favorites.length === 0) {
    gallery.innerHTML = "<p>You have no favorite recipes yet.</p>";
    return;
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(parseInt(r.id, 10)));

  if (favoriteRecipes.length === 0) {
    gallery.innerHTML = "<p>No matching recipes found in favorites.</p>";
    return;
  }

  favoriteRecipes.forEach((recipe, index) => {
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string"
        ? recipe.ingredients.split(",").map(i => i.trim())
        : [];

    const card = document.createElement("a");
    card.href = `recipe-detail.html?id=${recipe.id}`;
    card.classList.add("recipe-card", "fade-in");
    card.style.animationDelay = `${index * 0.15}s`;

    const isFavorite = favorites.includes(parseInt(recipe.id, 10));

    card.innerHTML = `
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" loading="lazy" />
      <div class="info">
        <h3>🍴 ${recipe.name}</h3>
        <p>Type: ${recipe.course || "Uncategorized"}</p>
        <p class="ingredients">Key Ingredients: ${ingredients.slice(0,5).join(', ')}${ingredients.length > 5 ? '...' : ''}</p>
        <button class="fav-btn ${isFavorite ? "active" : ""}" data-id="${recipe.id}" onclick="event.preventDefault(); event.stopPropagation();">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    `;
    gallery.appendChild(card);
  });

  // Toggle favorites with fade-out on removal
  gallery.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.map(favId => parseInt(favId, 10));

    const card = btn.closest(".recipe-card");

    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
      btn.classList.remove("active");
      card.classList.add("fade-out");
      setTimeout(() => {
        card.remove();
        if (gallery.children.length === 0) {
          gallery.innerHTML = "<p>You have no favorite recipes yet.</p>";
        }
      }, 600);
    } else {
      favorites.push(id);
      btn.classList.add("active");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
});

// Back to Top button logic
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.setAttribute("aria-hidden", "false");
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.setAttribute("aria-hidden", "true");
    backToTopBtn.classList.remove("visible");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
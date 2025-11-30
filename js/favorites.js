import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const gallery = document.querySelector(".favorites-grid");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites || favorites.length === 0) {
    gallery.innerHTML = "<p>You have no favorite recipes yet.</p>";
    return;
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

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

    card.innerHTML = `
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" loading="lazy" />
      <div class="info">
        <h3>🍴 ${recipe.name}</h3>
        <p>Type: ${recipe.course || "Uncategorized"}</p>
        <p class="ingredients">Key Ingredients: ${ingredients.slice(0,5).join(', ')}${ingredients.length > 5 ? '...' : ''}</p>
        <button class="remove-fav-btn" data-id="${recipe.id}" onclick="event.preventDefault(); event.stopPropagation();">💔 Remove</button>
      </div>
    `;
    gallery.appendChild(card);
  });

  // Remove favorites
  gallery.addEventListener("click", e => {
    if (e.target.classList.contains("remove-fav-btn")) {
      const id = parseInt(e.target.dataset.id, 10);
      let updated = favorites.filter(favId => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      location.reload();
    }
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
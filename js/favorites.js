import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const gallery = document.getElementById("favoritesGallery");
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

  favoriteRecipes.forEach(recipe => {
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string"
        ? recipe.ingredients.split(",").map(i => i.trim())
        : [];

    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" />
      <div class="info">
        <h3>${recipe.name}</h3>
        <p>Type: ${recipe.course || "Uncategorized"}</p>
        <p class="ingredients">Ingredients: ${ingredients.join(', ')}</p>
        <button class="remove-fav-btn" data-id="${recipe.id}">💔 Remove</button>
      </div>
    `;
    gallery.appendChild(card);
  });

  // Remove favorites
  gallery.addEventListener("click", e => {
    if (e.target.classList.contains("remove-fav-btn")) {
      const id = parseInt(e.target.dataset.id, 10);
      const updated = favorites.filter(favId => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      location.reload();
    }
  });
});
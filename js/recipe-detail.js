import {
  initNavbarToggle,
  initAlertDismiss,
  loadRecipes,
  isFavorite,
  toggleFavorite,
  showToast,
  initBackToTop
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbarToggle();
  initAlertDismiss();
  initBackToTop();

  const detailSection = document.getElementById("recipeDetailContainer");
  const params = new URLSearchParams(window.location.search);
  const recipeId = parseInt(params.get("id"), 10);

  const recipes = await loadRecipes();
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    detailSection.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  detailSection.innerHTML = `
    <article class="recipe-detail">
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" class="recipe-image" />
      <h2 class="recipe-name">${recipe.name}</h2>

      <div class="metadata">
        <span><strong>Course:</strong> ${recipe.course || "Uncategorized"}</span> | 
        <span><strong>Cuisine:</strong> ${recipe.cuisine || "N/A"}</span> | 
        <span><strong>Servings:</strong> ${recipe.servings || "N/A"}</span>
      </div>

      <button class="fav-btn ${isFavorite(recipe.id) ? "active" : ""}" 
              data-id="${recipe.id}" 
              aria-label="${isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}">
        <span class="heart-icon">❤️</span>
      </button>

      <h3>Ingredients</h3>
      <ul class="ingredients-list">
        ${ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <ol class="instructions-list">
        ${instructions.map(step => `<li>${step.replace(/^\d+\.\s*/, "")}</li>`).join("")}
      </ol>
    </article>
  `;

  // Heart toggle
  detailSection.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const result = toggleFavorite(recipeId);
    btn.classList.toggle("active", result.active);
    btn.setAttribute("aria-label", result.active ? "Remove from favorites" : "Add to favorites");

    showToast(result.active ? "Added to favorites ❤️" : "Removed from favorites 💔");
  });
});
import { initNavbarToggle, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss(); 

  const detailSection = document.getElementById("recipeDetailContainer"); 
  const params = new URLSearchParams(window.location.search);
  const recipeId = parseInt(params.get("id"), 10);

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    detailSection.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  detailSection.innerHTML = `
    <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" class="recipe-image" />
    <h2 class="recipe-name">${recipe.name}</h2>

    <div class="metadata">
      <span>Course: <strong>${recipe.course || "Uncategorized"}</strong></span> | 
      <span>Cuisine: <strong>${recipe.cuisine || "N/A"}</strong></span> | 
      <span>Servings: <strong>${recipe.servings || "N/A"}</strong></span>
    </div>

    <!-- Heart button -->
    <button class="fav-btn ${favorites.includes(recipe.id) ? "active" : ""}" data-id="${recipe.id}" aria-label="Toggle favorite">
      <span class="heart-icon">❤️</span>
    </button>

    <h3>Ingredients:</h3>
    <ul class="ingredients-list">
      ${ingredients.map(i => `<li>${i}</li>`).join("")}
    </ul>

    <h3>Instructions:</h3>
    <ol class="instructions-list">
      ${instructions.map(step => `<li>${step}</li>`).join("")}
    </ol>
  `;

  // Event listener
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    
    const id = parseInt(btn.dataset.id, 10);
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // normalize to integers
  favorites = favorites.map(favId => parseInt(favId, 10));

  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    btn.classList.remove("active");
  } else {
    favorites.push(id);
    btn.classList.add("active");
  }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
  
});
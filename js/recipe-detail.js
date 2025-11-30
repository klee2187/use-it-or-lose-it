import { initNavbarToggle, initAlertDismiss, showAlert } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss(); 

  const detailSection = document.getElementById("recipeDetailContainer"); 

  // Get recipe ID from URL
  const params = new URLSearchParams(window.location.search);
  const recipeId = parseInt(params.get("id"), 10);

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const inventory = JSON.parse(localStorage.getItem("inventory")) || []; 

  const recipe = recipes.find(r => r.id === recipeId);

  if(!recipe) {
    detailSection.innerHTML = "<p>Recipe not found. Please go back to the recipe list.</p>";
    return;
  }

  // Process ingredients and instructions
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
      ? recipe.ingredients.split(",").map(i => i.trim())
      : [];

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [];
  
  // Check inventory to see what's missing
  const missingIngredients = ingredients.filter(i => {
    return !inventory.some(item => i.toLowerCase().includes(item.name.toLowerCase()));
  });
  
  // Render Detail Page 
  detailSection.innerHTML = `
    <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" class="recipe-image" />
    <h2 class="recipe-name">${recipe.name}</h2>
    
    <div class="metadata">
      <span>Course: <strong>${recipe.course || "Uncategorized"}</strong></span> | 
      <span>Cuisine: <strong>${recipe.cuisine || "N/A"}</strong></span> | 
      <span>Servings: <strong>${recipe.servings || "N/A"}</strong></span>
    </div>

    <h3>Ingredients: <span class="missing-count">(${missingIngredients.length} missing)</span></h3>
    <ul class="ingredients-list">
      ${ingredients.map(i => {
        const isMissing = missingIngredients.includes(i);
        return `<li class="${isMissing ? 'missing-item' : 'in-stock'}">${i} ${isMissing ? '❌' : '✅'}</li>`;
      }).join('')}
    </ul>
    
    <h3>Instructions:</h3>
    <ol class="instructions-list">
      ${instructions.map(step => `<li>${step}</li>`).join("")} 
    </ol>
    
    ${recipe.substitutions ? `
      <h3>Substitutions</h3>
      <ul class="substitutions-list">${recipe.substitutions.map(s => `<li>${s}</li>`).join("")}</ul>
    ` : ""}
    
    <p class="creator-note"><em>Recipe by ${recipe.creator || "Unknown"}</em></p>

    <button id="addIngredientsToShoppingList" class="action-btn" ${missingIngredients.length === 0 ? 'disabled aria-disabled="true"' : ''}>
      ${missingIngredients.length > 0 ? 'Add Missing Ingredients to Shopping List' : 'All ingredients are in stock! 🎉'}
    </button>
  `;

  const updatedAddToListBtn = document.getElementById("addIngredientsToShoppingList");

  if (updatedAddToListBtn && missingIngredients.length > 0) {
    updatedAddToListBtn.addEventListener('click', () => {
      let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
      
      missingIngredients.forEach(item => {
        const itemName = item.split(',')[0].trim();
        const exists = shoppingList.some(s => s.name.toLowerCase().includes(itemName.toLowerCase()));

        if (!exists) {
          shoppingList.push({ name: item, dateAdded: new Date().toISOString() });
        }
      });
      
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
      showAlert(`${missingIngredients.length} item(s) checked and added to your shopping list!`, "safe");
      updatedAddToListBtn.disabled = true;
      updatedAddToListBtn.setAttribute("aria-disabled", "true");
      updatedAddToListBtn.textContent = "Added to Shopping List! (Refresh to re-enable)";
    });
  }

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
});
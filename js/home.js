import { initNavbarToggle, checkInventoryAlerts, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize global UI elements
  initNavbarToggle();
  initAlertDismiss();

  // Load Data
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Run Alert Check
  checkInventoryAlerts(inventory);

  // DOM Elements
  const recipeHighlightBox = document.querySelector(".recipe-highlight");
  const suggestedBox = document.getElementById("suggestedRecipes");
  const tipContent = document.getElementById("tipContent");

  // Random Recipe Highlight
  if (recipes.length > 0 && recipeHighlightBox) {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    recipeHighlightBox.innerHTML = `
      <h3>🍲 Recipe Highlight</h3>
      <p><strong>${randomRecipe.name}</strong></p>
      <p>Type: ${randomRecipe.type}</p>
      <a href="recipes.html">Check out the full recipe on the Recipes page!</a>
    `;
  } else if (recipeHighlightBox) {
    recipeHighlightBox.innerHTML = `<p>Add recipes to see a highlight here!</p>`;
  }

  // Suggested Recipes Logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringNames = inventory
    .filter(item => {
      if (!item.expiration) return false;
      const expDate = new Date(item.expiration);
      if (isNaN(expDate)) return false;
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    })
    .map(item => item.name.toLowerCase());

  const suggested = recipes.filter(recipe => {
    let ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string"
        ? recipe.ingredients.split(",").map(i => i.trim())
        : [];
    return ingredients.some(ing =>
      expiringNames.some(name => ing.toLowerCase().includes(name))
    );
  });

  if (suggestedBox) {
    if (suggested.length > 0) {
      suggestedBox.innerHTML = "<h3>🧑‍🍳 Suggested Recipes (Use up your ingredients!)</h3>";
      const grid = document.createElement("div");
      grid.classList.add("recipe-grid");
      suggested.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.innerHTML = `
          <p><strong>${recipe.name}</strong></p>
          <p>Type: ${recipe.type}</p>
        `;
        grid.appendChild(card);
      });
      suggestedBox.appendChild(grid);
    } else {
      suggestedBox.innerHTML =
        "<h3>🧑‍🍳 Suggested Recipes</h3><p>No suggested recipes based on expiring items right now.</p>";
    }
  }

  // Tip of the Day
  if (tipContent) {
    const tips = [
      "💡 Store herbs in damp paper towels to keep them fresh longer.",
      "💡 Use clear containers so you can see what you have.",
      "💡 Freeze leftovers in labeled portions for easy reuse.",
      "💡 Plan meals around what’s already in your fridge.",
      "💡 Check expiration dates weekly to avoid waste.",
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const pTag = tipContent.querySelector("p");
    if (pTag) pTag.textContent = tip;
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    const visible = window.scrollY > 300;
    backToTopBtn.classList.toggle("visible", visible);
    backToTopBtn.setAttribute("aria-hidden", !visible);
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
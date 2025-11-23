import { initNavbarToggle, checkInventoryAlerts } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const recipeHighlightBox = document.querySelector(".recipe-highlight");
  const suggestedBox = document.getElementById("suggestedRecipes");
  const tipContent = document.getElementById("tipContent");

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  // Random Recipe Highlight
  if (recipes.length > 0) {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    recipeHighlightBox.innerHTML = `
      <h3>🍲 Recipe Highlight</h3>
      <p><strong>${randomRecipe.name}</strong></p>
      <p>Type: ${randomRecipe.type}</p>
      <a href="recipes.html">Check out the full recipe on the Recipes page!</a>
    `;
  }

  // Suggested Recipes Based on Expiring Inventory
  const today = new Date();
  const expiringNames = inventory
    .filter(item => {
      const expDate = new Date(item.expiration);
      const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 5;
    })
    .map(item => item.name.toLowerCase());

  const suggested = recipes.filter(recipe => {
    let ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string"
      ? recipe.ingredients.split(",").map(i => i.trim())
      : [];

    return ingredients.some(ing => expiringNames.includes(ing.toLowerCase()));
  });

  if (suggested.length > 0) {
    suggestedBox.innerHTML = "<h3>🧑‍🍳 Suggested Recipes</h3>";
    suggested.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.innerHTML = `
        <p><strong>${recipe.name}</strong></p>
        <p>Type: ${recipe.type}</p>
      `;
      suggestedBox.appendChild(card);
    });
  } else {
    suggestedBox.innerHTML =
      "<p>No suggested recipes based on expiring items.</p>";
  }

  // Tip of the Day
  const tips = [
    "Store herbs in damp paper towels to keep them fresh longer.",
    "Use clear containers so you can see what you have.",
    "Freeze leftovers in labeled portions for easy reuse.",
    "Plan meals around what’s already in your fridge.",
    "Check expiration dates weekly to avoid waste.",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  tipContent.querySelector("p").textContent = tip;

  // Alerts
  checkInventoryAlerts(inventory);
});
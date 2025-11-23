import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const featuredSection = document.querySelector(".featured-recipe");
  const gallery = document.querySelector(".recipe-gallery");

  let recipes = JSON.parse(localStorage.getItem("recipes"));

  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("recipes", JSON.stringify(data));
        renderRecipes(data);
      })
      .catch(err => {
        featuredSection.innerHTML = "<p>Error loading recipes.</p>";
        console.error("Fetch error:", err);
      });
  } else {
    renderRecipes(recipes);
  }

  function renderRecipes(recipes) {
    if (recipes.length === 0) {
      featuredSection.innerHTML = "<p>No recipes found. Add some in your inventory!</p>";
      return;
    }

    const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    const featuredIngredients = Array.isArray(featuredRecipe.ingredients)
      ? featuredRecipe.ingredients
      : typeof featuredRecipe.ingredients === "string"
        ? featuredRecipe.ingredients.split(",").map(i => i.trim())
        : [];

    featuredSection.innerHTML = `
      <div class="featured-card">
        <img src="${featuredRecipe.image || 'images/placeholder.jpg'}" alt="${featuredRecipe.name}" />
        <div class="info">
          <h2>${featuredRecipe.name}</h2>
          <p>Type: ${featuredRecipe.type || "Uncategorized"}</p>
          <p class="ingredients">Ingredients: ${featuredIngredients.join(', ')}</p>
        </div>
      </div>
    `;

    const galleryRecipes = recipes.filter(r => r !== featuredRecipe).slice(0, 3);
    gallery.innerHTML = "";

    galleryRecipes.forEach(recipe => {
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
          <p>Type: ${recipe.type || "Uncategorized"}</p>
          <p class="ingredients">Ingredients: ${ingredients.join(', ')}</p>
        </div>
      `;
      gallery.appendChild(card);
    });
  }
});
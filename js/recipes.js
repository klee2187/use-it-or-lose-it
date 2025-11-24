import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const featuredSection = document.querySelector(".featured-recipe");
  const gallery = document.querySelector(".recipe-gallery");

  let recipes = JSON.parse(localStorage.getItem("recipes"));
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
      .then(res => res.json())
      .then(data => {
        const recipesArray = data.recipes || [];
        localStorage.setItem("recipes", JSON.stringify(recipesArray));
        recipes = recipesArray;
        renderRecipes(recipes);
      })
      .catch(err => {
        featuredSection.innerHTML = "<p>Error loading recipes.</p>";
        console.error("Fetch error:", err);
      });
  } else {
    renderRecipes(recipes);
  }

  function renderRecipes(recipes) {
    if (!Array.isArray(recipes) || recipes.length === 0) {
      featuredSection.innerHTML = "<p>No recipes found. Add some in your inventory!</p>";
      return;
    }

    const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!featuredRecipe) return;

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
          <p>Type: ${featuredRecipe.course || "Uncategorized"}</p>
          <p class="ingredients">Ingredients: ${featuredIngredients.join(', ')}</p>
          <button class="fav-btn" data-id="${featuredRecipe.id}">
            ${favorites.includes(featuredRecipe.id) ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
          </button>
        </div>
      </div>
    `;

    const galleryRecipes = recipes.filter(r => r !== featuredRecipe).slice(0, 3);
    gallery.innerHTML = "";

    galleryRecipes.forEach(recipe => {
      if (!recipe) return;
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
          <button class="fav-btn" data-id="${recipe.id}">
            ${favorites.includes(recipe.id) ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
          </button>
        </div>
      `;
      gallery.appendChild(card);
    });
  }

  // Favorites toggle
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("fav-btn")) {
      const id = parseInt(e.target.dataset.id, 10);
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        e.target.textContent = "❤️ Add to Favorites";
      } else {
        favorites.push(id);
        e.target.textContent = "💔 Remove Favorite";
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  });
});
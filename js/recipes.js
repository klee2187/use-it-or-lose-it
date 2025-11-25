import { initNavbarToggle, initAlertDismiss } from "./utils.js";
document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss(); 
  
  const featuredSection = document.querySelector(".featured-recipe");
  const gallery = document.querySelector(".recipe-gallery");
  
  let recipes = JSON.parse(localStorage.getItem("recipes"));
  // Data Loading Logic
  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
    .then(res => res.json())
    .then(data => {
      const recipesArray = data.recipes || [];
      recipesArray.forEach(r => r.id = parseInt(r.id, 10)); 
      localStorage.setItem("recipes", JSON.stringify(recipesArray));
      renderRecipes(recipesArray);
    })
    .catch(err => {
      featuredSection.innerHTML = "<p>Error loading recipes. Please check 'data/recipes.json'.</p>";
      console.error("Fetch error:", err);
    });
  } else {
    renderRecipes(recipes);
  }
  
  
  function renderRecipes(recipes) {
    if (!Array.isArray(recipes) || recipes.length === 0) {
      featuredSection.innerHTML = "<p>No recipes found. Try adding ingredients to your inventory!</p>";
      return;
    }
    
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; 
    // Featured Recipe
    const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!featuredRecipe) return;
    
    featuredSection.innerHTML = createFeaturedCard(featuredRecipe, favorites);
    
    // Gallery Recipes
    const galleryRecipes = recipes.filter(r => r.id !== featuredRecipe.id).slice(0, 3);
    gallery.innerHTML = "";
    
    galleryRecipes.forEach(recipe => {
      const cardHTML = createRecipeCard(recipe, favorites);
      gallery.insertAdjacentHTML('beforeend', cardHTML);
    });
  }
  
  // Helper functions for rendering
  function formatIngredients(ingredients) {
    if (Array.isArray(ingredients)) {
      return ingredients.slice(0, 5).join(', ') + (ingredients.length > 5 ? '...' : '');
    }
    return ingredients;
  }
  
  function createFeaturedCard(recipe, favorites) {
    const ingredientsText = formatIngredients(recipe.ingredients);
    const isFavorite = favorites.includes(recipe.id);
    
    return `
    <div class="featured-card recipe-card"> 
    <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" class="featured-image" fetchpriority="high" />
    <div class="info">
    <h2>${recipe.name}</h2>
    <p>Type: ${recipe.course || "Uncategorized"}</p>
    <p class="ingredients">Key Ingredients: ${ingredientsText}</p>
    <a href="recipe-detail.html?id=${recipe.id}" class="view-recipe-btn view-all-btn">View Recipe</a>
    <button class="fav-btn" data-id="${recipe.id}">
    ${isFavorite ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
    </button>
    </div>
    </div>
    `;
  }

    function createRecipeCard(recipe, favorites) {
      const ingredientsText = formatIngredients(recipe.ingredients);
      const isFavorite = favorites.includes(recipe.id);
      
      return `
      <a href="recipe-detail.html?id=${recipe.id}" class="recipe-card">
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" loading="lazy" />
      <div class="info">
      <h3>${recipe.name}</h3>
      <p>Type: ${recipe.course || "Uncategorized"}</p>
      <p class="ingredients">Key Ingredients: ${ingredientsText}</p>
      <button class="fav-btn" data-id="${recipe.id}" aria-label="Toggle favorite status for ${recipe.name}" onclick="event.preventDefault(); event.stopPropagation();">
      ${isFavorite ? "💔" : "❤️"}
      </button>
      </div>
      </a>
      `;
    }

    // Favorites toggle 
    document.body.addEventListener("click", e => {
      if (e.target.classList.contains("fav-btn")) {
        const id = parseInt(e.target.dataset.id, 10);
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        
        if (favorites.includes(id)) {
          favorites = favorites.filter(favId => favId !== id);
          e.target.textContent = (e.target.closest('.featured-card')) ? "❤️ Add to Favorites" : "❤️";
        } else {
          favorites.push(id);
          e.target.textContent = (e.target.closest('.featured-card')) ? "💔 Remove Favorite" : "💔";
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    });
});
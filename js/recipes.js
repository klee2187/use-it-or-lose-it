import { initNavbarToggle, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss(); 
  
  const featuredSection = document.querySelector(".featured-recipe");
  const gallery = document.querySelector(".recipe-gallery");
  
  let recipes = JSON.parse(localStorage.getItem("recipes"));
  
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

    
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; 
    const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!featuredRecipe) return;
    
    featuredSection.innerHTML = createFeaturedCard(featuredRecipe, favorites);
    
    const galleryRecipes = recipes.filter(r => r.id !== featuredRecipe.id).slice(0, 3);
    gallery.innerHTML = "";
    
    galleryRecipes.forEach((recipe, index) => {
      const cardHTML = createRecipeCard(recipe, favorites, index);
      gallery.insertAdjacentHTML('beforeend', cardHTML);
    });
  }
  
  function formatIngredients(ingredients) {
    if (Array.isArray(ingredients)) {
      return ingredients.slice(0, 5).join(', ') + (ingredients.length > 5 ? '...' : '');
    }
    return ingredients;
  }
  
  function createFeaturedCard(recipe, favorites) {

    const isFavorite = favorites.includes(recipe.id);

    return `
    <div class="featured-card recipe-card fade-in"> 
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" class="featured-image" />
      <div class="info">
        <h2>🍴 ${recipe.name}</h2>
        <p>Type: ${recipe.course || "Uncategorized"}</p>
        <p class="ingredients">Key Ingredients: ${formatIngredients(recipe.ingredients)}</p>
        <a href="recipe-detail.html?id=${recipe.id}" class="view-recipe-btn view-all-btn">View Recipe</a>
        <button class="fav-btn ${isFavorite ? "active" : ""}" data-id="${recipe.id}">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </div>
    `;
  }

  function createRecipeCard(recipe, favorites, index = 0) {

    const isFavorite = favorites.includes(recipe.id);

    return `
    <a href="recipe-detail.html?id=${recipe.id}" class="recipe-card fade-in" style="animation-delay:${index * 0.15}s">
      <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" loading="lazy" />
      <div class="info">
        <h3>🍴 ${recipe.name}</h3>
        <p>Type: ${recipe.course || "Uncategorized"}</p>
        <p class="ingredients">Key Ingredients: ${formatIngredients(recipe.ingredients)}</p>
        <button class="fav-btn ${isFavorite ? "active" : ""}" data-id="${recipe.id}" onclick="event.preventDefault(); event.stopPropagation();">
          <span class="heart-icon">❤️</span>
        </button>
      </div>
    </a>
    `;
  }

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
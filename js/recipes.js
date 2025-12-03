import { initNavbarToggle, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

  const featuredSection = document.querySelector(".featured-recipe-content");
  const gallery = document.querySelector(".recipe-gallery");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const backToTopBtn = document.getElementById("backToTop");

  let recipes = JSON.parse(localStorage.getItem("recipes"));

  // --- Load Recipes ---
  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
      .then(res => res.json())
      .then(data => {
        const recipesArray = data.recipes || [];
        recipesArray.forEach(r => r.id = parseInt(r.id, 10));
        localStorage.setItem("recipes", JSON.stringify(recipesArray));
        recipes = recipesArray;
        renderFeatured(recipes);
        renderRecipes(recipes);
      })
      .catch(err => {
        gallery.innerHTML = "<p>Error loading recipes. Please check 'data/recipes.json'.</p>";
        console.error("Fetch error:", err);
      });
  } else {
    renderFeatured(recipes);
    renderRecipes(recipes);
  }

  // --- Featured Recipe ---
  function renderFeatured(recipes) {
    if (!featuredSection) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.map(favId => parseInt(favId, 10));

    const featuredRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!featuredRecipe) return;

    const isFavorite = favorites.includes(parseInt(featuredRecipe.id, 10));
    
    featuredSection.innerHTML = `
      <div class="featured-card recipe-card fade-in">
        <img src="${featuredRecipe.image || 'images/placeholder.jpg'}" alt="${featuredRecipe.name}" class="featured-image" fetchpriority="high" />
        <div class="info">
          <h2>🍴 ${featuredRecipe.name}</h2>
          <p>Type: ${featuredRecipe.course || "Uncategorized"}</p>
          <p class="ingredients">Key Ingredients: ${Array.isArray(featuredRecipe.ingredients) ? featuredRecipe.ingredients.slice(0,5).join(", ") : ""}</p>
          <a href="recipe-detail.html?id=${featuredRecipe.id}" class="view-recipe-btn">View Recipe</a>
          <button class="fav-btn ${isFavorite ? "active" : ""}" data-id="${featuredRecipe.id}">
            <span class="heart-icon">❤️</span>
          </button>
        </div>
      </div>
    `;
  }

  // --- Filter & Search ---
  function filterAndRender() {
    const searchText = searchInput?.value.toLowerCase() || "";
    const filterType = typeFilter?.value || "";

    const filteredRecipes = recipes.filter(recipe => {
      const nameMatch = recipe.name.toLowerCase().includes(searchText);
      const ingredientsMatch = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.some(ing => ing.toLowerCase().includes(searchText))
        : false;

      const matchesSearch = nameMatch || ingredientsMatch;
      const matchesType = !filterType || recipe.course === filterType;

      return matchesSearch && matchesType;
    });

    renderRecipes(filteredRecipes);
  }

  searchInput?.addEventListener("input", filterAndRender);
  typeFilter?.addEventListener("change", filterAndRender);
  clearFiltersBtn?.addEventListener("click", () => {
    if (!searchInput || !typeFilter) return;
    searchInput.value = "";
    typeFilter.value = "";
    renderRecipes(recipes);
  });

  // --- Render Recipes ---
  function renderRecipes(recipesToRender) {
    if (!gallery) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.map(favId => parseInt(favId, 10));
    gallery.innerHTML = "";

    if (recipesToRender.length === 0) {
      gallery.innerHTML = "<p>No recipes match your search criteria.</p>";
      return;
    }

    recipesToRender.forEach((recipe, index) => {
      const isFavorite = favorites.includes(parseInt(recipe.id, 10));
      const cardHTML = `
        <a href="recipe-detail.html?id=${recipe.id}" class="recipe-card fade-in" style="animation-delay:${index * 0.1}s">
          <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" loading="lazy" />
          <div class="info">
            <h3>🍴 ${recipe.name}</h3>
            <p>Type: ${recipe.course || "Uncategorized"}</p>
            <p class="ingredients">Key Ingredients: ${Array.isArray(recipe.ingredients) ? recipe.ingredients.slice(0,5).join(", ") : ""}</p>
            <button class="fav-btn ${isFavorite ? "active" : ""}" data-id="${recipe.id}" onclick="event.preventDefault(); event.stopPropagation();">
              <span class="heart-icon">❤️</span>
            </button>
          </div>
        </a>
      `;
      gallery.insertAdjacentHTML("beforeend", cardHTML);
    });

    // Debugging fallback
    console.log("Rendered recipes:", recipesToRender);
  }

  // --- Heart Toggle ---
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const id = parseInt(btn.dataset.id, 10);
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.map(favId => parseInt(favId, 10));
     if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
      btn.classList.remove("active");
      showToast("Removed from favorites");
    } else {
      favorites.push(id);
      btn.classList.add("active");
      showToast("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  });

  // --- Toast Notification ---
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // --- Back to Top ---
  if (backToTopBtn) {
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
  }
});
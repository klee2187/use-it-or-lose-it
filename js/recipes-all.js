import { initNavbarToggle, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

  const gallery = document.querySelector(".recipe-gallery");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const clearFiltersBtn = document.getElementById("clearFilters");

  let recipes = JSON.parse(localStorage.getItem("recipes"));

  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
      .then(res => res.json())
      .then(data => {
        const recipesArray = data.recipes || [];
        recipesArray.forEach(r => r.id = parseInt(r.id, 10));
        localStorage.setItem("recipes", JSON.stringify(recipesArray));
        recipes = recipesArray;
        renderRecipes(recipes);
      })
      .catch(err => {
        gallery.innerHTML = "<p>Error loading recipes. Please check 'data/recipes.json'.</p>";
        console.error("Fetch error:", err);
      });
  } else {
    renderRecipes(recipes);
  }

  function filterAndRender() {
    const searchText = searchInput.value.toLowerCase();
    const filterType = typeFilter.value;

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

  searchInput.addEventListener("input", filterAndRender);
  typeFilter.addEventListener("change", filterAndRender);
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    renderRecipes(recipes);
  });

  function renderRecipes(recipesToRender) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    gallery.innerHTML = "";

    if (recipesToRender.length === 0) {
      gallery.innerHTML = "<p>No recipes match your search criteria.</p>";
      return;
    }

    recipesToRender.forEach((recipe, index) => {
      const isFavorite = favorites.includes(recipe.id);
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

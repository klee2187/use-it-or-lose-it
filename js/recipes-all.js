import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const gallery = document.querySelector(".recipe-gallery");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const clearBtn = document.getElementById("clearFilters");

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
        gallery.innerHTML = "<p>Error loading recipes.</p>";
        console.error("Fetch error:", err);
      });
  } else {
    renderRecipes(recipes);
  }

  function renderRecipes(list) {
    gallery.innerHTML = "";
    if (!Array.isArray(list) || list.length === 0) {
      gallery.innerHTML = "<p>No recipes match your search.</p>";
      return;
    }

    list.forEach(recipe => {
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

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    const filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm);
      const matchesType = selectedType ? recipe.course === selectedType : true;
      return matchesSearch && matchesType;
    });

    renderRecipes(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "";
    renderRecipes(recipes);
  });

  // Favorites toggle
  gallery.addEventListener("click", e => {
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
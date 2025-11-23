import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const gallery = document.querySelector(".recipe-gallery");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const clearBtn = document.getElementById("clearFilters");

  let recipes = JSON.parse(localStorage.getItem("recipes"));

  if (!recipes || recipes.length === 0) {
    fetch("data/recipes.json")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("recipes", JSON.stringify(data));
        recipes = data;
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
    if (list.length === 0) {
      gallery.innerHTML = "<p>No recipes match your search.</p>";
      return;
    }

    list.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : typeof recipe.ingredients === "string"
          ? recipe.ingredients.split(",").map(i => i.trim())
          : [];

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

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    const filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm);
      const matchesType = selectedType ? recipe.type === selectedType : true;
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
});
import { initNavbarToggle, initAlertDismiss } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    initNavbarToggle();
    initAlertDismiss();

    const gallery = document.querySelector(".recipe-gallery");
    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const clearFiltersBtn = document.getElementById("clearFilters");

    let recipes = JSON.parse(localStorage.getItem("recipes"));

    // Data Loading Logic
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

    // Filtering and Search Logic
    function filterAndRender() {
        if (!recipes) return;

        const searchText = searchInput.value.toLowerCase();
        const filterType = typeFilter.value;

        const filteredRecipes = recipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchText);
            const ingredientsMatch = recipe.ingredients && Array.isArray(recipe.ingredients) 
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

    // Rendering Function
    function renderRecipes(recipesToRender) {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        gallery.innerHTML = "";

        if (recipesToRender.length === 0) {
            gallery.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; margin-top: 20px;'>No recipes match your search criteria. Try clearing the filters.</p>";
            return;
        }

        recipesToRender.forEach(recipe => {
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
                e.target.textContent = "❤️"; 
            } else {
                favorites.push(id);
                e.target.textContent = "💔";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    });
});
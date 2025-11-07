document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipesList');
    const favoritesContainer = document.getElementById('favoriteRecipes');
    const searchInput = document.getElementById('searchInput');
    const newRandomBtn = document.getElementById('newRandomBtn');
    const randomRecipeDiv = document.getElementById('randomRecipe');
    const typeFilter = document.getElementById('typeFilter');

    let allRecipes = [];

    // Initialize 
    fetchRecipes();
    loadFavorites();

    // Event Listeners
    searchInput.addEventListener('input', filterAndRenderRecipes);
    typeFilter.addEventListener('change', filterAndRenderRecipes);
    newRandomBtn.addEventListener('click', displayRandomRecipe);

    // Core Data Functions

    function fetchRecipes() {
        fetch('data/recipes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allRecipes = data.recipes;
                populateFilterOptions(data.recipes);
                filterAndRenderRecipes();
                displayRandomRecipe();
            })
            .catch(error => console.error('Error loading recipes:', error));
    }

    function populateFilterOptions(recipes) {
        const types = [...new Set(recipes.map(recipe => recipe.type))];
        typeFilter.innerHTML = '<option value="all">All Types</option>';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    // Rendering Functions

    function filterAndRenderRecipes() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = typeFilter.value;

        const filteredRecipes = allRecipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) || 
                                 recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm));
            
            const matchesType = filterType === 'all' || recipe.type === filterType;
            
            return matchesSearch && matchesType;
        });

        renderRecipes(filteredRecipes, recipesContainer, false);
    }

    function renderRecipes(recipes, container, isFavoriteSection) {
        container.innerHTML = '';
        if (recipes.length === 0) {
            container.innerHTML = `<p>No recipes found matching your criteria.</p>`;
            return;
        }

        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

        recipes.forEach(recipe => {
            const isFav = favorites.includes(recipe.id);
            const card = document.createElement('div');
            card.classList.add('recipe-card');
            if (isFav) {
                card.classList.add('favorite');
            }

            const ingredientList = recipe.ingredients.map(ing => `<li>${ing.quantity} ${ing.unit} ${ing.name}</li>`).join('');

            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><strong>Type:</strong> ${recipe.type}</p>
                <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                
                <h4>Ingredients:</h4>
                <ul>${ingredientList}</ul>
                
                ${isFavoriteSection 
                    ? `<button class="remove-fav" data-id="${recipe.id}">Remove Favorite</button>`
                    : `<button class="fav-btn" data-id="${recipe.id}">${isFav ? 'Remove Favorite' : 'Add to Favorites'}</button>`
                }
            `;
            
            container.appendChild(card);
        });

        // Re-attach event listeners
        attachFavoriteListeners();
    }

    function displayRandomRecipe() {
        if (allRecipes.length === 0) return;
        const randomIndex = Math.floor(Math.random() * allRecipes.length);
        const randomRecipe = allRecipes[randomIndex];
        
        // Use a temporary array to render just the one recipe
        renderRecipes([randomRecipe], randomRecipeDiv, false);
    }

    // Favorites

    function attachFavoriteListeners() {
        document.querySelectorAll('.fav-btn').forEach(button => {
            button.onclick = (e) => toggleFavorite(e.target.dataset.id);
        });
        document.querySelectorAll('.remove-fav').forEach(button => {
            button.onclick = (e) => toggleFavorite(e.target.dataset.id);
        });
    }

    function toggleFavorite(recipeId) {
        let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        recipeId = parseInt(recipeId);

        const index = favorites.indexOf(recipeId);

        if (index > -1) {
            favorites.splice(index, 1); // Remove
        } else {
            favorites.push(recipeId); // Add
        }

        localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
        
        // Re-render
        filterAndRenderRecipes();
        loadFavorites();
    }

    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
        const favoriteRecipesData = allRecipes.filter(recipe => favorites.includes(recipe.id));
        
        renderRecipes(favoriteRecipesData, favoritesContainer, true);
    }
});
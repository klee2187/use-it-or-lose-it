async function loadRecipesFeature() {
    const response = await fetch("data/recipes.json");
    const recipes = await response.json();

    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>Recipe Guide</h2>
        <p>Search through your food storage recipes.</p>
        <input type="text" id="recipeSearch" placeholder="Search by ingredient or recipe name..." />
        <div id="recipeList" class="recipe-list"></div>
    `;

    const searchInput = document.getElementById("recipeSearch");
    const recipeList = document.getElementById("recipeList");

    // Display recipes initially
    renderRecipes(recipes);

    // Filter recipes as the user types
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
        );
        renderRecipes(filtered);
    });

    function renderRecipes(list) {
        recipeList.innerHTML = "";

        if (list.length === 0) {
            recipeList.innerHTML = <p>No recipes found.</p>;
            return;
        }

        list.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><strong><Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                <p><strong><Instructions:</strong> ${recipe.instructions}</p>
            `;
            recipeList.appendChild(card);
        });
    }
}
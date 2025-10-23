async function loadRecipesFeature() {
    const response = await fetch("data/recipes.json");
    const recipes = await response.json();

    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>Recipe Guide</h2>
        <input type="text" id="recipeSearch" placeholder="Search recipes...." />
        <div id="recipeList" class="recipe-list"></div>
    `;

    const searchInput = document.getElementById("recipeSearh");
    const recipeList = document.getElementById("recipeList");

    const storedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
    if (storageInventory.length > 0) {
        const storedNames = storedInventory.map(item => item.name.toLowerCase());
        const suggested = recipes.filter(recipes =>
            recipe.ingredients.some(ing => storedNames.includes(ing.toLowerCase()))
        );

        if (suggested.length > 0) {
            const suggestedSection = document.createElement("div");
            suggestedSection.innerHTML = `
            <h3>Suggested Recipes Based on Your Inventory</h3>
            <div class="recipe-list"></div>
            `;
            content.prepend(suggestionSection);
            const suggestionList = suggestionSection.querySelector(".recipe-list");
            renderRecipes(suggested, suggestionList);    
        }
    }

    renderRecipes(recipes);

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = recipes.filter(r =>
            r.name.toLowerCase().includes(query) ||
            r.ingredients.some(i = i.toLowerCase().includes(query))
        );
        renderRecipes(filtered);
    });

    function renderRecipes(list, container = recipeList) {
        container.innerHTML = "";
        if (list.length === 0) {
            container.innerHTML = "<p>No recipes found.</p>";
            return;
        }
    }
}
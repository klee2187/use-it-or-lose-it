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
}
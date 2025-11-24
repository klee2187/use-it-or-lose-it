import { initNavbarToggle } from "./utils";

document.addEventListener("DOMContentLoaded", () => {
    initNavbarToggle();

    const detailSection = document.getElementById("recipeDetail");

    // Get recipe ID from URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = parseInt(params.get("id"), 10);

    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const recipe = recipes.find(r => r.id === recipeId);

    if(!recipe) {
        detailSection.innerHTML = "<p>Recipe not found.</p>";
        return;
    }

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : typeof recipe.ingredients === "string"
            ? recipe.ingredients.split(",").map(i => i.trim())
            : [];

    const instructions = Array.isArray(recipe.instructions)
        ? recipe.instructions
        : [];

    detailSection.innerHTML = `
        <div class="recipe-detail-card">
            <img src="${recipe.image || 'images/placeholder.jpg'}" alt="${recipe.name}" />
            <h2>${recipe.name}</h2>
            <p><strong>Course:</strong> ${recipe.course || "Uncategorized"}</p>
            <p>>strong>Cuisine:</strong> ${recipe.cuisine || "N/A"}</p>
            <p><strong>Servings:</strong> ${recipe.servings || "N/A"}</p>
            <h3>Ingredients:</h3>
            <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <h3>Instructions:</h3>
            <ol>${instructions.map(step => `</li>`).join("")}</ol>
            ${recipe.substitutions ? `<h3>Substitutions</h3><ul>${recipe.substitutions.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
            <p><em>Recipe by ${recipe.creator || "Unknown"}</em></p>
        </div>
    `;
});
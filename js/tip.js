document.addEventListener('DOMContentLoaded', () => {
    const tipContent = document.getElementById('tipContent');

    // Fetch the inventory and then the recipes
    Promise.all([
        fetch('data/recipes.json').then(res => res.json()),
        Promise.resolve(JSON.parse(localStorage.getItem('inventoryItems')) || [])
    ])
    .then(([recipeData, inventoryItems]) => {
        const recipes = recipeData.recipes;
        let recipeHighlight = null;

        // Try to find a recipe using an item expiring in the next week
        const expiringItemNames = inventoryItems
            .filter(item => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expDate = new Date(item.expiration);
                expDate.setDate(expDate.getDate() + 1); // Adjust
                const timeDiff = expDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return daysRemaining > 0 && daysRemaining <= 7;
            })
            .map(item => item.name.toLowerCase());

        // Find a recipe using one of those expiring ingredients
        for (const recipe of recipes) {
            const usesExpiringItem = recipe.ingredients.some(ing => 
                expiringItemNames.includes(ing.name.toLowerCase())
            );
            if (usesExpiringItem) {
                recipeHighlight = recipe;
                break; 
            }
        }

        // If no expiring recipes, just pick a random one
        if (!recipeHighlight && recipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * recipes.length);
            recipeHighlight = recipes[randomIndex];
        }

        // Render the highlight
        if (recipeHighlight) {
            tipContent.innerHTML = `
                <h3>${recipeHighlight.name}</h3>
                <p><strong>Type:</strong> ${recipeHighlight.type}</p>
                <p>Check out the full recipe on the <a href="recipes.html">Recipes page</a>!</p>
            `;
        } else {
            tipContent.innerHTML = `<p>No recipes available or inventory is empty. Start adding items to get personalized tips!</p>`;
        }
    })
    .catch(error => {
        console.error('Error loading recipe highlight:', error);
        tipContent.innerHTML = `<p>Error loading recipe highlight.</p>`;
    });
});
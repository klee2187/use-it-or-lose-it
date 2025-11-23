document.addEventListener('DOMContentLoaded', () => {
  const tipContent = document.getElementById('tipContent');
  if (!tipContent) return;

  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

  if (recipes.length === 0 || inventoryItems.length === 0) {
    tipContent.textContent = "No recipes or inventory items available.";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find items expiring within 7 days
  const expiringSoon = inventoryItems.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    expDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  if (expiringSoon.length > 0) {
    const ingredient = (expiringSoon[0].name || '').toLowerCase();

    // Find a recipe that uses the expiring ingredient
    const suggestion = recipes.find(r =>
      Array.isArray(r.ingredients) &&
      r.ingredients.some(i =>
        typeof i === 'string'
          ? i.toLowerCase().includes(ingredient)
          : (i.name || '').toLowerCase().includes(ingredient)
      )
    );

    if (suggestion) {
      tipContent.innerHTML = `
        <h3>${suggestion.name}</h3>
        <p><strong>Uses:</strong> ${ingredient}</p>
        <p>${suggestion.description || 'Try this recipe to use it up!'}</p>
      `;
    } else {
      tipContent.textContent = `No recipe found for ${ingredient}.`;
    }
  } else {
    tipContent.textContent = "No expiring items right now.";
  }
});
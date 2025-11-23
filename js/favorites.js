import { getExpirationStatus } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const favoritesList = document.getElementById('favoritesList');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<li>No favorites yet.</li>';
    return;
  }

  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.textContent = fav.name;

    // Highlight if recipe uses expiring inventory items
    const expiringIngredient = inventoryItems.find(item => {
      if (!item.expiration) return false;
      const status = getExpirationStatus(item.expiration);

      const matches = fav.ingredients.some(i =>
        typeof i === 'string'
          ? i.toLowerCase().includes(item.name.toLowerCase())
          : (i.name || '').toLowerCase().includes(item.name.toLowerCase())
      );

      if (!matches) return false;

      li.classList.add(status);
      return true;
    });

    favoritesList.appendChild(li);
  });
});
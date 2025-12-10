import {
  initNavbarToggle,
  loadRecipes,
  getFavorites,
  toggleFavorite,
  showToast,
  initBackToTop
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbarToggle();
  initBackToTop();

  const gallery = document.querySelector(".favorites-grid");
  const recipes = await loadRecipes();
  let favorites = getFavorites();

  if (!favorites.length) {
    gallery.innerHTML = '<p>You have no favorite recipes yet.</p>';
    return;
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  if (!favoriteRecipes.length) {
    gallery.innerHTML = '<p>No matching recipes found in favorites.</p>';
    return;
  }

  // Render cards
  gallery.innerHTML = "";
  favoriteRecipes.forEach(r => {
    const card = renderCard(r, true);
    gallery.appendChild(card);
  });

  // Toggle/remove favorites
  gallery.addEventListener("click", e => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();

    const id = parseInt(btn.dataset.id, 10);
    const result = toggleFavorite(id);

    btn.classList.toggle("active", result.active);
    btn.setAttribute("aria-label", result.active ? "Remove from favorites" : "Add to favorites");

    const card = btn.closest(".recipe-card");
    if (!result.active && card) {
      card.classList.add("fade-out");
      setTimeout(() => {
        card.remove();
        if (!gallery.children.length) {
          gallery.innerHTML = '<p>You have no favorite recipes yet.</p>';
        }
      }, 400);
      showToast("Removed from favorites 💔");
    } else {
      showToast("Added to favorites ❤️");
    }
  });

  // Filter + Sort logic
  const searchInput = document.getElementById("favSearch");
  const typeSelect = document.getElementById("favType");
  const sortSelect = document.getElementById("favSort");
  const clearBtn = document.getElementById("clearFavFilters");

  function applyFiltersAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = typeSelect.value;

    let cards = Array.from(gallery.querySelectorAll(".recipe-card"));

    // Filter
    cards.forEach(card => {
      const title = card.querySelector(".recipe-title").textContent.toLowerCase();
      const type = card.querySelector(".recipe-type").textContent;
      const matchesSearch = title.includes(searchTerm);
      const matchesType = !typeFilter || type.includes(typeFilter);
      card.style.display = (matchesSearch && matchesType) ? "" : "none";
    });

    // Sort
    let visibleCards = cards.filter(card => card.style.display !== "none");
    if (sortSelect.value === "alpha") {
      visibleCards.sort((a, b) => {
        const titleA = a.querySelector(".recipe-title").textContent.toLowerCase();
        const titleB = b.querySelector(".recipe-title").textContent.toLowerCase();
        return titleA.localeCompare(titleB);
      });
    } else if (sortSelect.value === "newest") {
      visibleCards.sort((a, b) => {
        return parseInt(b.querySelector(".fav-btn").dataset.id, 10) -
               parseInt(a.querySelector(".fav-btn").dataset.id, 10);
      });
    } else if (sortSelect.value === "oldest") {
      visibleCards.sort((a, b) => {
        return parseInt(a.querySelector(".fav-btn").dataset.id, 10) -
               parseInt(b.querySelector(".fav-btn").dataset.id, 10);
      });
    }

    // Re-append sorted cards
    visibleCards.forEach(card => gallery.appendChild(card));
  }

  if (searchInput && typeSelect && sortSelect && clearBtn) {
    searchInput.addEventListener("input", applyFiltersAndSort);
    typeSelect.addEventListener("change", applyFiltersAndSort);
    sortSelect.addEventListener("change", applyFiltersAndSort);
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      typeSelect.value = "";
      sortSelect.value = "alpha"; // reset to default
      applyFiltersAndSort();
    });
  }
});

function renderCard(recipe, isFav) {
  const { id, name, image, course, ingredients = [] } = recipe;

  // Build card DOM
  const card = document.createElement("a");
  card.href = `recipe-detail.html?id=${id}`;
  card.className = "recipe-card fade-in";

  const img = document.createElement("img");
  img.src = image || "images/placeholder.jpg";
  img.alt = name;
  img.loading = "lazy";

  // shimmer removal
  img.addEventListener("load", () => {
    img.classList.add("loaded");
  });
  img.addEventListener("error", () => {
    img.classList.add("loaded");
    img.src = "images/placeholder.jpg";
  });

  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h3");
  title.className = "recipe-title";
  title.textContent = name;

  const type = document.createElement("p");
  type.className = "recipe-type";
  type.innerHTML = `<strong>Type:</strong> ${course || "Uncategorized"}`;

  const ing = document.createElement("p");
  ing.className = "ingredients";
  ing.innerHTML = `<strong>Key Ingredients:</strong> ${ingredients.slice(0,5).join(", ")}`;

  const favBtn = document.createElement("button");
  favBtn.className = `fav-btn ${isFav ? "active" : ""}`;
  favBtn.dataset.id = id;
  favBtn.setAttribute("aria-label", isFav ? "Remove from favorites" : "Add to favorites");
  favBtn.innerHTML = `<span class="heart-icon">❤️</span>`;

  info.appendChild(title);
  info.appendChild(type);
  info.appendChild(ing);
  info.appendChild(favBtn);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}
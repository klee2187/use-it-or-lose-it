// Initialize Navbar Toggle
export function initNavbarToggle() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!toggleBtn || !navMenu) {
    console.warn("Navbar toggle or menu not found.");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("nav-open");
    toggleBtn.classList.toggle("open");
  });
}

// Alert System Display
export function showAlert(message, type = "safe") {
  const alertSection = document.getElementById("alertSection");
  const alertMessage = document.getElementById("alertMessage");
  
  if (!alertSection || !alertMessage) return;

  let emoji = "ℹ️";
  if (type === "safe") emoji = "✅";
  if (type === "warning") emoji = "⚠️";
  if (type === "error") emoji = "❌";
  if (type === "info") emoji = "ℹ️";

  alertMessage.textContent = `${emoji} ${message}`;
  
  alertSection.classList.remove("hidden", "safe", "warning", "error", "info");
  alertSection.classList.add(type);
  alertSection.setAttribute("aria-hidden", "false");
}

// Initialize Alert Dismissal
export function initAlertDismiss() {
  const alertDismissBtn = document.getElementById("alertDismissBtn");
  const alertSection = document.getElementById("alertSection");

  if (alertDismissBtn && alertSection) {
    alertDismissBtn.addEventListener("click", () => {
      alertSection.classList.add("hidden");
      alertSection.setAttribute("aria-hidden", "true");
    });
  }
}

// Check Inventory for Expirations (thresholds: expired, ≤3 days, ≤7 days)
export function checkInventoryAlerts(inventory) {
  if (!Array.isArray(inventory) || inventory.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const criticalItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  });

  const warningItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 3 && diffDays <= 7;
  });

  const expiredItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    return expDate < today;
  });

  if (expiredItems.length > 0) {
    const names = expiredItems.map(item => item.name).join(", ");
    showAlert(`These ${expiredItems.length} items have EXPIRED: ${names}`, "error");
  } else if (criticalItems.length > 0) {
    const names = criticalItems.map(item => item.name).join(", ");
    showAlert(`These ${criticalItems.length} items are expiring within 3 days: ${names}`, "error");
  } else if (warningItems.length > 0) {
    const names = warningItems.map(item => item.name).join(", ");
    showAlert(`These ${warningItems.length} items are expiring within 7 days: ${names}`, "warning");
  }
}

/* FAVORITES + TOAST HELPERS */

// Load recipes.json and cache in localStorage
export async function loadRecipes() {
  try {
    const cached = JSON.parse(localStorage.getItem("recipes"));
    if (Array.isArray(cached) && cached.length) return cached;

    const res = await fetch("data/recipes.json");
    const data = await res.json();
    const recipes = Array.isArray(data.recipes) ? data.recipes : [];
    localStorage.setItem("recipes", JSON.stringify(recipes));
    return recipes;
  } catch {
    return [];
  }
}

// Favorites helpers
export function getFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  return favs.map(id => parseInt(id, 10)).filter(Number.isFinite);
}

export function setFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

export function toggleFavorite(id) {
  const recipeId = parseInt(id, 10);
  let favs = getFavorites();

  if (favs.includes(recipeId)) {
    favs = favs.filter(f => f !== recipeId);
    setFavorites(favs);
    return { active: false };
  } else {
    favs.push(recipeId);
    setFavorites(favs);
    return { active: true };
  }
}

export function isFavorite(id) {
  return getFavorites().includes(parseInt(id, 10));
}

// Toast notifications
export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  toast.setAttribute("aria-live", "polite");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Back to Top button
export function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggle = () => {
    const visible = window.scrollY > 300;
    btn.setAttribute("aria-hidden", String(!visible));
    btn.classList.toggle("visible", visible);
  };

  window.addEventListener("scroll", toggle);
  toggle();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
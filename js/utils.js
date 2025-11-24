// Navbar toggle
export function initNavbarToggle() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !expanded);
      navMenu.classList.toggle("nav-open"); // ✅ matches CSS
    });
  }
}

// Alert system
export function showAlert(message, type = "safe") {
  const alertSection = document.getElementById("alertSection");
  const alertMessage = document.getElementById("alertMessage");
  const alertDismissBtn = document.getElementById("alertDismissBtn");

  if (!alertSection || !alertMessage || !alertDismissBtn) return;

  let emoji = "ℹ️";
  if (type === "safe") emoji = "✅";
  if (type === "warning") emoji = "⚠️";
  if (type === "error") emoji = "❌";

  alertMessage.textContent = `${emoji} ${message}`;
  alertSection.classList.remove("hidden", "safe", "warning", "error");
  alertSection.classList.add(type);

  alertDismissBtn.addEventListener("click", () => {
    alertSection.classList.add("hidden");
  });
}

// Expiring/Expired items alert
export function checkInventoryAlerts(inventory) {
  const today = new Date();

  const expiringItems = inventory.filter(item => {
    const expDate = new Date(item.expiration);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 5;
  });

  const expiredItems = inventory.filter(item => {
    const expDate = new Date(item.expiration);
    return expDate < today;
  });

  if (expiredItems.length > 0) {
    const names = expiredItems.map(item => item.name).join(", ");
    showAlert(`These items have expired: ${names}`, "error");
  } else if (expiringItems.length > 0) {
    const names = expiringItems.map(item => item.name).join(", ");
    showAlert(`These items are expiring soon: ${names}`, "warning");
  } else {
    showAlert("No items expiring in the next 5 days.", "safe");
  }
}
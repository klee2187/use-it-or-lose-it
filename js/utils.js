// Navbar toggle
export function initNavbarToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("nav-open");
      navMenu.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(!isOpen));
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
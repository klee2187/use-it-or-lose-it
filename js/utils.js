// Initialize Navbar Toggle
export function initNavbarToggle() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !expanded);
      navMenu.classList.toggle("nav-open");
    });
  }
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

  alertMessage.textContent = `${emoji} ${message}`;
  
  alertSection.classList.remove("hidden", "safe", "warning", "error");
  alertSection.classList.add(type);
}

// Initialize Alert Dismissal
export function initAlertDismiss() {
    const alertDismissBtn = document.getElementById("alertDismissBtn");
    const alertSection = document.getElementById("alertSection");

    if (alertDismissBtn && alertSection) {
        alertDismissBtn.addEventListener("click", () => {
            alertSection.classList.add("hidden");
        });
    }
}

// Check Inventory for Expirations
export function checkInventoryAlerts(inventory) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const expiringItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 5;
  });

  const expiredItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    return expDate < today;
  });

  // Prioritize showing the most critical alert
  if (expiredItems.length > 0) {
    const names = expiredItems.map(item => item.name).join(", ");
    showAlert(`These ${expiredItems.length} items have EXPIRED: ${names}`, "error");
  } else if (expiringItems.length > 0) {
    const names = expiringItems.map(item => item.name).join(", ");
    showAlert(`These ${expiringItems.length} items are expiring soon: ${names}`, "warning");
  }
}
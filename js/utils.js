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
    toggleBtn.setAttribute("aria-expanded", !expanded);
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

  alertMessage.textContent = `${emoji} ${message}`;
  
  alertSection.classList.remove("hidden", "safe", "warning", "error");
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

// Check Inventory for Expirations
export function checkInventoryAlerts(inventory = []) {
  if (!Array.isArray(inventory) || inventory.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const expiringItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 5;
  });

  const expiredItems = inventory.filter(item => {
    if (!item.expiration) return false;
    const expDate = new Date(item.expiration);
    return expDate < today;
  });

  if (expiredItems.length > 0) {
    const names = expiredItems.map(item => item.name).join(", ");
    showAlert(`These ${expiredItems.length} items have EXPIRED: ${names}`, "error");
  } else if (expiringItems.length > 0) {
    const names = expiringItems.map(item => item.name).join(", ");
    showAlert(`These ${expiringItems.length} items are expiring soon: ${names}`, "warning");
  }
}
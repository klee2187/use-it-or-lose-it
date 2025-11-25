import { initNavbarToggle, checkInventoryAlerts, initAlertDismiss, showAlert } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize global UI elements
  initNavbarToggle();
  initAlertDismiss(); 

  const inventoryForm = document.getElementById("inventoryForm");
  const inventoryBody = document.getElementById("inventoryBody");

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  
  // Initial checks
  loadInventory();
  checkInventoryAlerts(inventory);

  if (inventoryForm) {
    inventoryForm.addEventListener("submit", handleAddItem);
  }

  if (inventoryBody) {
      inventoryBody.addEventListener("click", handleDeleteItem);
  }
});

// RENDER INVENTORY 
function loadInventory() {
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  const tableBody = document.getElementById("inventoryBody");

  tableBody.innerHTML = "";

  if (inventory.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No items in inventory. Add one above!</td></tr>";
    return;
  }

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    
    // Calculate Status (Safe, Expiring, Expired)
    const statusClass = getExpirationStatus(item.expiration);
    row.classList.add(statusClass);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatDate(item.expiration)}</td>
      <td>
        <button class="delete-btn action-btn" data-index="${index}">❌ Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ADD ITEM 
function handleAddItem(e) {
  e.preventDefault();

  const nameInput = document.getElementById("itemName");
  const qtyInput = document.getElementById("itemQuantity");
  const expInput = document.getElementById("itemExpiration");

  const name = nameInput.value.trim();
  const quantity = qtyInput.value.trim();
  const expiration = expInput.value;

  if (!name || !quantity || !expiration) {
    showAlert("Please fill out all fields.", "warning");
    return;
  }
  
  // Get current list, add new item, save back to storage
  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  inventory.push({ name, quantity, expiration });
  localStorage.setItem("inventory", JSON.stringify(inventory));

  showAlert(`${name} added to inventory!`, "safe");

  // Reset form and reload table/alerts
  e.target.reset();
  loadInventory();
  checkInventoryAlerts(inventory);
}

// DELETE ITEM
function handleDeleteItem(e) {
    if (e.target.classList.contains("delete-btn")) {
        const index = e.target.getAttribute("data-index");
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        
        // Remove item at that index
        const removedItem = inventory.splice(index, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        
        showAlert(`${removedItem[0].name} removed.`, "warning");
        
        // Reload table/alerts
        loadInventory();
        checkInventoryAlerts(inventory);
    }
}

// HELPER: Check Expiration Status 
function getExpirationStatus(dateString) {
  if (!dateString) return "status-safe";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(dateString);
  
  // Calculate difference in days (1000ms * 60s * 60min * 24hr)
  const diffTime = expDate - today; 
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "status-expired";  // Already passed
  if (diffDays <= 3) return "status-expiring"; // Coming up in 3 days
  return "status-safe";
}

// HELPER: Format Dates 
function formatDate(dateString) {
  if (!dateString) return "N/A";
  // The input is YYYY-MM-DD
  return new Date(dateString).toLocaleDateString();
}
import { initNavbarToggle, checkInventoryAlerts, initAlertDismiss, showAlert } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

  const inventoryForm = document.getElementById("inventoryForm");
  const inventoryBody = document.getElementById("inventoryBody");

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  loadInventory();
  checkInventoryAlerts(inventory);

  if (inventoryForm) {
    inventoryForm.addEventListener("submit", handleAddOrEditItem);
  }

  if (inventoryBody) {
    inventoryBody.addEventListener("click", handleTableActions);
  }
});

// RENDER INVENTORY
function loadInventory() {
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  const tableBody = document.getElementById("inventoryBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (inventory.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No items in inventory. Add one above!</td></tr>";
    return;
  }

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    const statusClass = getExpirationStatus(item.expiration);
    row.classList.add(statusClass);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity} ${item.unit || ""}</td>
      <td>${formatDate(item.expiration)}</td>
      <td>
        <button class="edit-btn action-btn" data-index="${index}">✏️ Edit</button>
        <button class="delete-btn action-btn" data-index="${index}">❌ Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// ADD OR EDIT ITEM
function handleAddOrEditItem(e) {
  e.preventDefault();

  const nameInput = document.getElementById("itemName");
  const qtyInput = document.getElementById("itemQuantity");
  const unitSelect = document.getElementById("itemUnit");
  const expInput = document.getElementById("itemExpiration");
  const editIndexInput = document.getElementById("editIndex");

  const name = nameInput?.value.trim();
  const quantity = qtyInput?.value.trim();
  const unit = unitSelect?.value;
  const expiration = expInput?.value;

  if (!name || !quantity || !unit || !expiration) {
    showAlert("Please fill out all fields.", "warning");
    return;
  }

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  if (editIndexInput.value !== "") {
    // Editing existing item
    const idx = parseInt(editIndexInput.value, 10);
    inventory[idx] = { name, quantity, unit, expiration };
    showAlert(`${name} updated successfully!`, "safe");
  } else {
    // Adding new item
    inventory.push({ name, quantity, unit, expiration });
    showAlert(`${name} (${quantity} ${unit}) added to inventory!`, "safe");
  }

  localStorage.setItem("inventory", JSON.stringify(inventory));

  e.target.reset();
  editIndexInput.value = ""; // clear edit mode
  loadInventory();
  checkInventoryAlerts(inventory);
}

// DELETE OR EDIT ACTIONS
function handleTableActions(e) {
  const index = e.target.getAttribute("data-index");
  if (e.target.classList.contains("delete-btn")) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const removedItem = inventory.splice(index, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    if (removedItem[0]) {
      showAlert(`${removedItem[0].name} removed.`, "warning");
    }

    loadInventory();
    checkInventoryAlerts(inventory);
  }

  if (e.target.classList.contains("edit-btn")) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory[index];
    if (!item) return;

    // Populate form with item values
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemQuantity").value = item.quantity;
    document.getElementById("itemUnit").value = item.unit;
    document.getElementById("itemExpiration").value = item.expiration;

    document.getElementById("editIndex").value = index;
    showAlert(`Editing ${item.name}...`, "info");
  }
}

// HELPER: Check Expiration Status
function getExpirationStatus(dateString) {
  if (!dateString) return "status-safe";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(dateString);
  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "status-expired";
  if (diffDays <= 3) return "status-expiring";
  return "status-safe";
}

// HELPER: Format Dates
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}
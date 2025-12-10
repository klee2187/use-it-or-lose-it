import { initNavbarToggle, checkInventoryAlerts, initAlertDismiss, showAlert } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

  const inventoryForm = document.getElementById("inventoryForm");
  const inventoryBody = document.getElementById("inventoryBody");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  loadInventory();
  checkInventoryAlerts(inventory);

  if (inventoryForm) {
    inventoryForm.addEventListener("submit", handleAddOrEditItem);
  }

  if (inventoryBody) {
    inventoryBody.addEventListener("click", handleTableActions);
  }
  
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", cancelEditMode);
  }

  // Toast setup
  const toast = document.getElementById("toast");
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Show monthly inventory health summary
  showMonthlySummaryToast(inventory, showToast);
});

// RENDER INVENTORY
function loadInventory() {
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  const tableBody = document.getElementById("inventoryBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (inventory.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No items in inventory. Add one above!</td></tr>";
    return;
  }

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    const statusClass = getExpirationStatus(item.expiration);
    row.classList.add(statusClass);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}${item.unit ? " " + item.unit : ""}</td>
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
  const submitBtn = document.querySelector("#inventoryForm button[type='submit']");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  const name = nameInput?.value.trim();
  const quantity = parseInt(qtyInput?.value.trim(), 10);
  const unit = unitSelect?.value || "";
  const expiration = expInput?.value;

  if (!name || !quantity || !expiration) {
    showAlert("Please fill out all required fields.", "warning");
    return;
  }

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  if (editIndexInput.value !== "") {
    const idx = parseInt(editIndexInput.value, 10);
    inventory[idx] = { name, quantity, unit, expiration };
    showAlert(`${name} updated successfully!`, "safe");
    showToast(`✏️ ${name} updated`);
  } else {
    inventory.push({ name, quantity, unit, expiration });
    showAlert(`${name} ${unit ? `(${quantity} ${unit})` : `(${quantity})`} added to inventory!`, "safe");
    showToast(`✅ ${name} added`);
  }

  localStorage.setItem("inventory", JSON.stringify(inventory));

  e.target.reset();
  editIndexInput.value = "";
  submitBtn.textContent = "Add Item";
  cancelEditBtn.classList.add("hidden");

  document.querySelectorAll(".inventory-table tr").forEach(tr => tr.classList.remove("editing"));

  loadInventory();
  checkInventoryAlerts(inventory);
  showMonthlySummaryToast(inventory, showToast);
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
      showToast(`🗑️ ${removedItem[0].name} deleted`);
    }

    loadInventory();
    checkInventoryAlerts(inventory);
    showMonthlySummaryToast(inventory, showToast);
  }

  if (e.target.classList.contains("edit-btn")) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = inventory[index];
    if (!item) return;

    document.getElementById("itemName").value = item.name;
    document.getElementById("itemQuantity").value = item.quantity;
    document.getElementById("itemUnit").value = item.unit;
    document.getElementById("itemExpiration").value = item.expiration;

    document.getElementById("editIndex").value = index;

    const submitBtn = document.querySelector("#inventoryForm button[type='submit']");
    submitBtn.textContent = "Update Item";

    const cancelEditBtn = document.getElementById("cancelEditBtn");
    cancelEditBtn.classList.remove("hidden");

    document.querySelectorAll(".inventory-table tr").forEach(tr => tr.classList.remove("editing"));
    e.target.closest("tr").classList.add("editing");

    showAlert(`Editing ${item.name}...`, "info");
    showToast(`✏️ Editing ${item.name}`);
  }
}

// CANCEL EDIT MODE
function cancelEditMode() {
  const inventoryForm = document.getElementById("inventoryForm");
  const editIndexInput = document.getElementById("editIndex");
  const submitBtn = document.querySelector("#inventoryForm button[type='submit']");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  inventoryForm.reset();
  editIndexInput.value = "";
  submitBtn.textContent = "Add Item";
  cancelEditBtn.classList.add("hidden");

  document.querySelectorAll(".inventory-table tr").forEach(tr => tr.classList.remove("editing"));

  showAlert("Edit cancelled.", "warning");
  showToast("❌ Edit cancelled");
}

// Check Expiration Status
function getExpirationStatus(dateString) {
  if (!dateString) return "status-safe";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(dateString);
  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "status-expired";
  if (diffDays <= 3) return "status-critical";
  if (diffDays <= 7) return "status-warning";
  return "status-safe";
}

// Format Dates
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}

// Monthly Summary Toast
function showMonthlySummaryToast(inventory, showToast) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let expiringCount = 0;
  let criticalCount = 0;
  let expiredCount = 0;

  inventory.forEach(item => {
    if (!item.expiration) return;
    const expDate = new Date(item.expiration);
    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
      const status = getExpirationStatus(item.expiration);
      if (status === "status-warning") expiringCount++;
      if (status === "status-critical") criticalCount++;
      if (status === "status-expired") expiredCount++;
    }
  });

  if (expiringCount || criticalCount || expiredCount) {
    showToast(`📊 This month: ${expiredCount} expired, ${criticalCount} critical, ${expiringCount} expiring soon`);
  }
}
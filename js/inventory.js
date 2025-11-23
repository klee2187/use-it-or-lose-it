import { initNavbarToggle, checkInventoryAlerts } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();

  const inventoryForm = document.getElementById("inventoryForm");
  const inventoryBody = document.getElementById("inventoryBody");

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  // Render Inventory Table
  function renderInventory() {
    inventoryBody.innerHTML = "";

    if (inventory.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No items in inventory.</td>`;
      inventoryBody.appendChild(row);
      return;
    }

    inventory.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.expiration}</td>
        <td><button class="delete-btn" data-index="${index}">❌</button></td>
      `;
      inventoryBody.appendChild(row);
    });

    // Attach delete handlers
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.getAttribute("data-index");
        inventory.splice(idx, 1);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
        checkInventoryAlerts(inventory); 
      });
    });
  }

  // Add Item
  inventoryForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const quantity = document.getElementById("itemQuantity").value.trim();
    const expiration = document.getElementById("itemExpiration").value;

    if (!name || !quantity || !expiration) {
      alert("Please fill out all fields.");
      return;
    }

    inventory.push({ name, quantity, expiration });
    localStorage.setItem("inventory", JSON.stringify(inventory));

    inventoryForm.reset();
    renderInventory();
    checkInventoryAlerts(inventory); 
  });

  // Initial render
  renderInventory();

  // Alerts
  checkInventoryAlerts(inventory);
});
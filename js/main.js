// Handle nav from dropdown
const navDropdown = document.getElementById("navDropdown");
const content = document.getElementById("content");

navDropdown.addEventListener("change", (event) => {
    const selection = event.target.value;

    switch (selection) {
        case "inventory":
            content.innerHTML = `
            <h2>Inventory Tracker</h2>
            <form id="inventoryForm">
            <input type="text" id="itemName" placeholder="Item name" required>
            <input type="number" id="itemQty" placeholder="Quantity" min="1" required>
            <input type="date" id="itemExp" required>
            <button type="submit">Add Item</button>
        </form>
        <h3>Stored Items</h3>
        <table id="inventoryTable">
        <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Expiration Date</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody id="inventoryList"></tbody>
        </table>
      `;
      loadInventoryFeature();
      break;

        case "recipes":
            loadRecipesFeature();
            break;

        case "budget":
            content.innerHTML = `
            <h2>Budget Calculator</h2>
            <p>Plan your shopping based on your food storage budget. Coming soon!</p>
            `;
            break;

        case "goals":
            content.innerHTML = `
            <h2>Food Storage Goals</h2>
            <p>Set and track your goals for building food storage. Coming soon!</p>
            `;
            break;

        case "calendar":
            content.innerHTML = `
            <h2>Calendar</h2>
            <p>View expiration reminders and food rotation schedules. Coming Soon</p>
            `;
            break;
            
        default:
            content.innerHTML = `<p>Select a feature from the dropdown above to get started.</p>`;
    }
});
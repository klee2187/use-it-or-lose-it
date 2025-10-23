function loadInventoryFeature() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>Inventory</h2>
        <form id="inventoryForm">
            <input type="text" id="itemName" placeholder="Item name" required />
            <input type="number" id="itemQty" placeholder="Quantity" min="1" required />
            <button type="submit">Add Item</button>
        </form>
        <ul id="inventoryList" class="inventory-list"></ul>
    `;

    const form = document.getElementById("inventoryForm");
    const list = document.getElementById("inventoryList");
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    function renderList() {
        list.innerHTML = "";
        if (inventory.length === 0) {
            list.innerHTML = "<li>No items in storage.</li>";
            return;
        }

        inventory.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.quantity}`;
            list.appendChild(li);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("itemName").value.trim();
        const qty = parseInt(document.getElementById("itemQty").value);
        if (!name || isNaN(qty)) return;

        inventory.push({ name, quantity: qty });
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderList();
        form.rest();
    });

    renderList();
}
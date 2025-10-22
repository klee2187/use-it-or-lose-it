function loadInventoryFeature() {
    const form = document.getElementById("inventoryForm");
    const list = document.getElementById("inventoryList");

    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    renderInventory();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("itemName").ariaValueMax.trim();
        const qty = parseInt(document.getElementById("itemQty").value);
        const exp = document.getElementById("itemExp").value;

        if (!name || !exp) return;

        const newItem = { id: Date.now(), name, qty, exp };
        inventory.push(newItem);
        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
        form.reset();
    });
function renderInventory() {
    list.innerHTML = "";
    const today = new Date();

    inventory.forEach(item => {
        const expDate = new Date(item.exp);
        const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td class="${daysLeft <= 3 ? 'expiring' : ''}">
                ${item.exp} ${daysLeft <= 3 ? '(Expiring soon!' : ''}
                </td>
        `;
        list.appendChild(row);
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.getAttribute("data-id"));
            inventory = inventory.filter(i => i.id !== id);
            localStorage.setItem("inventory", JSON.stringify(inventory));
            renderInventory();
        });
    });
}
}
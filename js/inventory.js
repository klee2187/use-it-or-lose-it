document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inventoryForm');
    const inventoryList = document.getElementById('inventoryList');

    // Load items from localStorage
    loadInventory();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });

    // Load and display inventory
    function loadInventory() {
        const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        inventoryList.innerHTML = ''; 

        // Sort items by expiration date
        items.sort((a, b) => new Date(a.expiration) - new Date(b.expiration));

        items.forEach((item, index) => {
            displayItem(item, index);
        });

        // Save sorted list back to storage
        localStorage.setItem('inventoryItems', JSON.stringify(items));
    }

    // Add a new item
    function addItem() {
        const name = document.getElementById('itemName').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const expiration = document.getElementById('expiration').value;
        const type = document.getElementById('itemType').value;

        const newItem = {
            name,
            quantity,
            expiration,
            type
        };

        const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        items.push(newItem);
        localStorage.setItem('inventoryItems', JSON.stringify(items));
        
        form.reset();
        loadInventory();
    }

    // Function to render an item to DOM
    function displayItem(item, index) {
        const li = document.createElement('li');
        
        // Calculate days remaining
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expDate = new Date(item.expiration);
        expDate.setDate(expDate.getDate() + 1); 
        const timeDiff = expDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let statusClass = 'safe';
        let statusText = `${daysRemaining} days remaining`;

        if (daysRemaining <= 0) {
            statusClass = 'danger';
            statusText = 'EXPIRED!';
        } else if (daysRemaining <= 3) {
            statusClass = 'warning';
            statusText = `Expires in ${daysRemaining} days!`;
        }

        li.classList.add('inventory-item', statusClass);
        li.dataset.index = index;

        li.innerHTML = `
            <div>
                <strong>${item.name}</strong> (${item.type})
                <span class="quantity">Qty: ${item.quantity}</span>
            </div>
            <div class="expiration-info">
                Expires: ${item.expiration} 
                <span class="status-badge">(${statusText})</span>
            </div>
            <button class="btn-delete">Use/Delete</button>
        `;

        // Attach delete/use event listener
        li.querySelector('.btn-delete').addEventListener('click', () => {
            deleteItem(index);
        });

        inventoryList.appendChild(li);
    }

    // Function to delete/use an item
    function deleteItem(index) {
        let items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        
        items.splice(index, 1);
        
        localStorage.setItem('inventoryItems', JSON.stringify(items));
        loadInventory(); // Reload list
    }

    window.loadInventory = loadInventory; 
});
document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budgetForm');
    const budgetTableBody = document.querySelector('#budgetTable tbody');
    const grandTotalElement = document.getElementById('grandTotal');

    // Load from localStorage
    loadExpenses();

    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addExpense();
    });

    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem('foodExpenses')) || [];
        budgetTableBody.innerHTML = ''; 
        let grandTotal = 0;

        expenses.forEach((expense, index) => {
            const row = budgetTableBody.insertRow();
            const total = expense.price * expense.quantity;
            grandTotal += total;

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.price.toFixed(2)}</td>
                <td>${expense.quantity}</td>
                <td>$${total.toFixed(2)}</td>
                <td><button class="btn-delete" data-index="${index}">Delete</button></td>
            `;

            row.querySelector('.btn-delete').addEventListener('click', function() {
                deleteExpense(this.dataset.index);
            });
        });

        grandTotalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    }

    function addExpense() {
        const name = document.getElementById('itemName').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const quantity = parseInt(document.getElementById('itemQuantity').value);

        if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            alert('Please enter valid price and quantity.');
            return;
        }

        const newExpense = {
            name,
            price,
            quantity
        };

        const expenses = JSON.parse(localStorage.getItem('foodExpenses')) || [];
        expenses.push(newExpense);
        localStorage.setItem('foodExpenses', JSON.stringify(expenses));
        
        budgetForm.reset();
        loadExpenses();
    }

    function deleteExpense(index) {
        let expenses = JSON.parse(localStorage.getItem('foodExpenses')) || [];
        
        expenses.splice(index, 1);
        
        localStorage.setItem('foodExpenses', JSON.stringify(expenses));
        loadExpenses(); 
    }
});
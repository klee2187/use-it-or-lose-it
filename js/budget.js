import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize shared components
    initNavbarToggle();

    // DOM Element References
    const setBudgetForm = document.getElementById("setBudgetForm");
    const budgetForm = document.getElementById("budgetForm");
    const budgetAmountInput = document.getElementById("budgetAmount");
    
    const totalBudgetEl = document.getElementById("totalBudget");
    const totalSpentEl = document.getElementById("totalSpent");
    const remainingBudgetEl = document.getElementById("remainingBudget");
    const expenseList = document.getElementById("expenseList");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = progressBar.parentElement;
    const monthlySummaryList = document.getElementById("monthlySummaryList");

    // State Initialization
    // Use Number() for parsing to ensure '0' or null results in 0
    let budget = Number(localStorage.getItem("budget")) || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    // Set input value on load
    budgetAmountInput.value = budget.toFixed(2);


    // Data Management
    const saveData = () => {
        localStorage.setItem("budget", budget);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    };


    // Rendering Functions

    const renderSummary = () => {
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const remaining = budget - totalSpent;

        totalBudgetEl.textContent = budget.toFixed(2);
        totalSpentEl.textContent = totalSpent.toFixed(2);
        remainingBudgetEl.textContent = remaining.toFixed(2);
        
        // Conditional styling for remaining budget
        remainingBudgetEl.style.color = remaining < 0 ? "#c62828" : "var(--dark-green)";
        remainingBudgetEl.style.fontWeight = remaining !== 0 ? "bold" : "normal";

        // Progress Bar Logic
        let percent = budget > 0 ? (totalSpent / budget) * 100 : 0;
        let clampedPercent = Math.min(percent, 100);
        
        // Ensure percent is at least 1% for visibility if spent > 0
        if (totalSpent > 0 && budget === 0) {
            clampedPercent = 100; 
            percent = 100;
        }

        progressBar.style.width = `${clampedPercent}%`;
        progressBar.textContent = `${Math.round(percent)}%`;

        // Update ARIA attributes
        progressContainer.setAttribute("aria-valuenow", Math.round(percent));
        progressContainer.setAttribute("aria-label", `Budget usage: ${Math.round(percent)} percent spent`);

        // Change progress bar color if over budget
        if (percent >= 100) {
            progressBar.style.backgroundColor = "#c62828"; // Red when over budget
            remainingBudgetEl.classList.add("over-budget");
        } else {
            progressBar.style.backgroundColor = "var(--accent-orange)";
            remainingBudgetEl.classList.remove("over-budget");
        }
    };

    const renderExpenses = () => {
        expenseList.innerHTML = "";
        if (expenses.length === 0) {
            expenseList.innerHTML = "<li>No expenses recorded yet.</li>";
            return;
        }
        
        // Reverse array to show most recent expenses at the top
        expenses.slice().reverse().forEach((expense, index) => {
            // Calculate original index to ensure deletion works correctly
            const originalIndex = expenses.length - 1 - index; 

            const li = document.createElement("li");
            
            // Format date for display
            const date = new Date(expense.date);
            const dateString = date.toLocaleDateString();

            li.innerHTML = `
                <span>${expense.name} — $${expense.amount.toFixed(2)} <em>(${dateString})</em></span>
                <button class="delete-expense" aria-label="Delete expense: ${expense.name}">Delete</button>
            `;
            
            li.querySelector(".delete-expense").addEventListener("click", () => {
                expenses.splice(originalIndex, 1);
                saveData();
                renderAll();
            });
            expenseList.appendChild(li);
        });
    };

    const renderMonthlySummary = () => {
        monthlySummaryList.innerHTML = "";
        if (expenses.length === 0) {
            monthlySummaryList.innerHTML = "<li>No expenses recorded yet.</li>";
            return;
        }

        const monthlyTotals = {};
        expenses.forEach(expense => {
            const date = expense.date ? new Date(expense.date) : new Date();
            // YYYY-MM key for grouping
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; 
            
            if (!monthlyTotals[key]) monthlyTotals[key] = 0;
            monthlyTotals[key] += expense.amount;
        });
        
        // Sort keys descending (most recent month first)
        const sortedKeys = Object.keys(monthlyTotals).sort().reverse();

        sortedKeys.forEach(monthKey => {
            const total = monthlyTotals[monthKey];
            const [year, month] = monthKey.split("-");
            
            // Get Month Name (e.g., 'November 2025')
            const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" });
            
            const li = document.createElement("li");
            li.textContent = `${monthName}: $${total.toFixed(2)}`;
            monthlySummaryList.appendChild(li);
        });
    };
    
    // Consolidated render function
    const renderAll = () => {
        renderSummary();
        renderExpenses();
        renderMonthlySummary();
    }


    // Event Listeners

    setBudgetForm.addEventListener("submit", e => {
        e.preventDefault();
        budget = parseFloat(budgetAmountInput.value); 
        saveData();
        renderSummary();
    });

    budgetForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("expenseName").value.trim();
        const amount = parseFloat(document.getElementById("expenseAmount").value);
        
        if (!name || isNaN(amount) || amount <= 0) return;
        
        // Add new expense with current date
        expenses.push({ 
            name, 
            amount, 
            date: new Date().toISOString() 
        });
        
        saveData();
        renderAll();
        budgetForm.reset();
    });

    // Initial load call
    renderAll();
});
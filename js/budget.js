import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Initialize hamburger menu
  initNavbarToggle();

  const setBudgetForm = document.getElementById("setBudgetForm");
  const budgetForm = document.getElementById("budgetForm");
  const totalBudgetEl = document.getElementById("totalBudget");
  const totalSpentEl = document.getElementById("totalSpent");
  const remainingBudgetEl = document.getElementById("remainingBudget");
  const expenseList = document.getElementById("expenseList");
  const progressBar = document.getElementById("progressBar");
  const progressContainer = progressBar.parentElement;

  // Monthly summary section
  const monthlySummaryContainer = document.createElement("section");
  monthlySummaryContainer.classList.add("monthly-summary");
  monthlySummaryContainer.innerHTML = `
    <h3>Monthly Summary</h3>
    <ul id="monthlySummaryList"></ul>
  `;
  document.querySelector(".budget-box").appendChild(monthlySummaryContainer);
  const monthlySummaryList = document.getElementById("monthlySummaryList");

  let budget = parseFloat(localStorage.getItem("budget")) || 0;
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const saveData = () => {
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  };

  const renderSummary = () => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget - totalSpent;

    totalBudgetEl.textContent = budget.toFixed(2);
    totalSpentEl.textContent = totalSpent.toFixed(2);
    remainingBudgetEl.textContent = remaining.toFixed(2);

    const percent = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const clampedPercent = Math.min(percent, 100);

    progressBar.style.width = `${clampedPercent}%`;
    progressBar.textContent = `${Math.round(clampedPercent)}%`;

    progressContainer.setAttribute("aria-valuenow", Math.round(clampedPercent));
    progressContainer.setAttribute("aria-valuemin", "0");
    progressContainer.setAttribute("aria-valuemax", "100");
    progressContainer.setAttribute("aria-label", "Budget usage");

    if (percent >= 100) {
      progressBar.style.backgroundColor = "#c62828"; // red when over budget
      remainingBudgetEl.classList.add("over-budget");
    } else {
      progressBar.style.backgroundColor = "var(--accent-orange)";
      remainingBudgetEl.classList.remove("over-budget");
    }
  };

  const renderExpenses = () => {
    expenseList.innerHTML = "";
    if (expenses.length === 0) {
      expenseList.innerHTML = "<li>No expenses yet.</li>";
      return;
    }
    expenses.forEach((expense, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.name} — $${expense.amount.toFixed(2)}</span>
        <button class="delete-expense" aria-label="Delete ${expense.name}">Delete</button>
      `;
      li.querySelector(".delete-expense").addEventListener("click", () => {
        expenses.splice(index, 1);
        saveData();
        renderSummary();
        renderExpenses();
        renderMonthlySummary();
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
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyTotals[key]) monthlyTotals[key] = 0;
      monthlyTotals[key] += expense.amount;
    });

    Object.entries(monthlyTotals).forEach(([monthKey, total]) => {
      const [year, month] = monthKey.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });
      const li = document.createElement("li");
      li.textContent = `${monthName} ${year}: $${total.toFixed(2)}`;
      monthlySummaryList.appendChild(li);
    });
  };

  setBudgetForm.addEventListener("submit", e => {
    e.preventDefault();
    budget = parseFloat(document.getElementById("budgetAmount").value);
    saveData();
    renderSummary();
  });

  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("expenseName").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    if (!name || isNaN(amount)) return;
    expenses.push({ name, amount, date: new Date().toISOString() });
    saveData();
    renderSummary();
    renderExpenses();
    renderMonthlySummary();
    budgetForm.reset();
  });

  // Initial render
  renderSummary();
  renderExpenses();
  renderMonthlySummary();
});
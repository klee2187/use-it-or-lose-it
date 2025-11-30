import { initNavbarToggle, initAlertDismiss, showAlert } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

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

  let budget = Number(localStorage.getItem("budget")) || 0;
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  budgetAmountInput.value = budget.toFixed(2);

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

    remainingBudgetEl.style.color = remaining < 0 ? "#c62828" : "var(--dark-green)";
    remainingBudgetEl.style.fontWeight = remaining !== 0 ? "bold" : "normal";

    let percent = budget > 0 ? (totalSpent / budget) * 100 : 0;
    let clampedPercent = Math.min(percent, 100);

    if (totalSpent > 0 && budget === 0) {
      clampedPercent = 100; 
      percent = 100;
    }

    progressBar.style.width = `${clampedPercent}%`;
    progressBar.textContent = `${Math.round(percent)}%`;

    progressContainer.setAttribute("aria-valuenow", Math.round(percent));
    progressContainer.setAttribute("aria-label", `Budget usage: ${Math.round(percent)} percent spent`);

    if (percent >= 100) {
      progressBar.style.backgroundColor = "#c62828";
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

    expenses.slice().reverse().forEach((expense, index) => {
      const originalIndex = expenses.length - 1 - index; 
      const li = document.createElement("li");
      li.classList.add("fade-in");
      li.style.animationDelay = `${index * 0.1}s`;

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
        showAlert(`Deleted expense: ${expense.name}`, "safe");
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

    const sortedKeys = Object.keys(monthlyTotals).sort().reverse();
    sortedKeys.forEach((monthKey, index) => {
      const total = monthlyTotals[monthKey];
      const [year, month] = monthKey.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" });

      const li = document.createElement("li");
      li.classList.add("fade-in");
      li.style.animationDelay = `${index * 0.1}s`;
      li.textContent = `${monthName}: $${total.toFixed(2)}`;
      monthlySummaryList.appendChild(li);
    });
  };

  const renderAll = () => {
    renderSummary();
    renderExpenses();
    renderMonthlySummary();
  };

  // Event Listeners
  setBudgetForm.addEventListener("submit", e => {
    e.preventDefault();
    budget = parseFloat(budgetAmountInput.value); 
    saveData();
    renderSummary();
    showAlert(`Budget set to $${budget.toFixed(2)}`, "safe");
  });

  budgetForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("expenseName").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (!name || isNaN(amount) || amount <= 0) return;

    expenses.push({ name, amount, date: new Date().toISOString() });
    saveData();
    renderAll();
    budgetForm.reset();
    showAlert(`Added expense: ${name} ($${amount.toFixed(2)})`, "safe");
  });

  // Initial load
  renderAll();

  // Back to Top button logic
  const backToTopBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.setAttribute("aria-hidden", "false");
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.setAttribute("aria-hidden", "true");
      backToTopBtn.classList.remove("visible");
    }
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
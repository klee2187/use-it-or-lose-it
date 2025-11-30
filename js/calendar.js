import { initNavbarToggle, initAlertDismiss, checkInventoryAlerts } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initAlertDismiss();

  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
  checkInventoryAlerts(inventory);

  const calendarHeader = document.getElementById("calendarHeader");
  const calendarGrid = document.getElementById("calendarGrid");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");
  const todayBtn = document.getElementById("todayBtn");
  const monthlySummaryGrid = document.getElementById("monthlySummaryGrid");

  let currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);

  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  const getItemSeverity = (items) => {
    let severity = "none";
    items.forEach((item) => {
      if (!item.expiration) return;
      const expDate = new Date(item.expiration);
      expDate.setHours(0, 0, 0, 0);
      const diffTime = expDate.getTime() - TODAY.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let currentSeverity = "safe";

      if (diffDays <= 0) currentSeverity = "expired";
      else if (diffDays <= 3) currentSeverity = "critical";
      else if (diffDays <= 7) currentSeverity = "warning";

      if (currentSeverity === "expired") severity = "expired";
      else if (currentSeverity === "critical" && severity !== "expired") severity = "critical";
      else if (currentSeverity === "warning" && severity !== "expired" && severity !== "critical") severity = "warning";
      else if (currentSeverity === "safe" && severity === "none") severity = "safe";
    });
    return severity;
  };

  const renderCalendar = () => {
    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayIndex = firstDay.getDay();

    calendarHeader.textContent = `${firstDay.toLocaleString("default", { month: "long" })} ${year}`;

    // Empty cells before the first day
    for (let i = 0; i < startDayIndex; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-cell", "empty");
      emptyCell.setAttribute("role", "gridcell");
      calendarGrid.appendChild(emptyCell);
    }

    // Fill days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const cell = document.createElement("div");
      cell.classList.add("calendar-cell");
      cell.setAttribute("role", "gridcell");

      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      if (cellDate.getTime() === TODAY.getTime()) {
        cell.classList.add("today");
      }

      const expiringItems = inventory.filter((item) => {
        if (!item.expiration) return false;
        const expDate = new Date(item.expiration);
        expDate.setHours(0, 0, 0, 0);
        return expDate.getTime() === cellDate.getTime();
      });

      cell.innerHTML = `<div class="date">${day}</div>`;

      if (expiringItems.length > 0) {
        const severity = getItemSeverity(expiringItems);
        if (severity !== "none") cell.classList.add(severity);

        const countEl = document.createElement("div");
        countEl.classList.add("item-count");
        countEl.textContent = `${expiringItems.length} item(s) expiring`;
        cell.appendChild(countEl);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.textContent = `Expiring: ${expiringItems.map(i => i.name).join(", ")}`;
        tooltip.setAttribute("aria-label", tooltip.textContent);
        cell.appendChild(tooltip);
      }

      calendarGrid.appendChild(cell);
    }

    renderMonthlySummary(year, month);
  };

  const renderMonthlySummary = (year, month) => {
    monthlySummaryGrid.innerHTML = "";

    const monthlyItems = [];
    inventory.forEach((item) => {
      if (!item.expiration) return;
      const expDate = new Date(item.expiration);

      if (expDate.getFullYear() === year && expDate.getMonth() === month) {
        const severity = getItemSeverity([item]);
        monthlyItems.push({
          date: expDate.toISOString().split("T")[0],
          name: item.name,
          severity: severity,
        });
      }
    });

    if (monthlyItems.length === 0) {
      monthlySummaryGrid.innerHTML = "<p>No expiring items this month.</p>";
      return;
    }

    monthlyItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    monthlyItems.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("summary-card", "fade-in");
      card.style.animationDelay = `${index * 0.1}s`;

      const formattedDate = new Date(item.date).toLocaleDateString();

      let emoji = "✅";
      let colorClass = "safe-text";
      let borderColor = "#388E3C";

      if (item.severity === "warning") {
        emoji = "⚠️";
        colorClass = "warning-text";
        borderColor = "#FF9800";
      } else if (item.severity === "critical") {
        emoji = "❗";
        colorClass = "critical-text";
        borderColor = "#dc3545";
      } else if (item.severity === "expired") {
        emoji = "❌";
        colorClass = "expired-text";
        borderColor = "#C62828";
      }

      card.style.borderLeftColor = borderColor;
      card.innerHTML = `
        <div class="date-label ${colorClass}">${emoji} ${formattedDate}</div>
        <div class="item-name">${item.name}</div>
      `;
      monthlySummaryGrid.appendChild(card);
    });
  };

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDate.setDate(1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    renderCalendar();
  });
  todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    currentDate.setDate(1);
    renderCalendar();
  });

  renderCalendar();

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
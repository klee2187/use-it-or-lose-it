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
    const priority = {
      "expired": 0,
      "critical": 1,
      "warning": 2,
      "safe": 3,
      "none": 4
    };

    let maxSeverity = "none";

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

        if (priority[currentSeverity] < priority[maxSeverity]) {
            maxSeverity = currentSeverity;
        }
    });
    return maxSeverity;
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

        const tooltipText = `Expiring: ${expiringItems.map(i => i.name).join(", ")}`;
        cell.setAttribute("title", tooltipText); 
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

    // Create the UL container
    const listContainer = document.createElement("ul");
    listContainer.classList.add("summary-list");

    monthlyItems.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("summary-list-item", "fade-in");
      listItem.style.animationDelay = `${index * 0.05}s`; 

      const formattedDate = new Date(item.date).toLocaleDateString();

      let emoji = "✅";
      let colorClass = "safe-text";
      let listMarkerClass = "safe-marker";

      if (item.severity === "warning") {
        emoji = "⚠️";
        colorClass = "warning-text";
        listMarkerClass = "warning-marker";
      } else if (item.severity === "critical") {
        emoji = "❗";
        colorClass = "critical-text";
        listMarkerClass = "critical-marker";
      } else if (item.severity === "expired") {
        emoji = "❌";
        colorClass = "expired-text";
        listMarkerClass = "expired-marker";
      }

      listItem.innerHTML = `
      <span class="list-marker ${listMarkerClass}"></span>
      <div class="list-content">
      <span class="date-label ${colorClass}">${emoji} ${formattedDate}</span>
      <span class="item-name">${item.name}</span>
      </div>
      `;
      listContainer.appendChild(listItem);
    });
    
    monthlySummaryGrid.appendChild(listContainer);
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
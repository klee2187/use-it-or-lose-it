import { initNavbarToggle, initAlertDismiss, checkInventoryAlerts } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    initNavbarToggle();
    // Assuming initAlertDismiss exists in utils.js to handle the alert section
    // initAlertDismiss(); 

    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    checkInventoryAlerts(inventory); // Check for global expiration alerts

    const calendarHeader = document.getElementById("calendarHeader");
    const calendarGrid = document.getElementById("calendarGrid");
    const prevMonthBtn = document.getElementById("prevMonthBtn");
    const nextMonthBtn = document.getElementById("nextMonthBtn");
    const todayBtn = document.getElementById("todayBtn");
    const monthlySummaryList = document.getElementById("monthlySummaryList");

    let currentDate = new Date();
    currentDate.setDate(1); 
    currentDate.setHours(0, 0, 0, 0);

    const TODAY = new Date();
    TODAY.setHours(0, 0, 0, 0);

    const getItemSeverity = (items) => {
        let severity = 'none'; // Default state
        items.forEach(item => {
            if (!item.expiration) return;
            const expDate = new Date(item.expiration);
            expDate.setHours(0, 0, 0, 0);
            const diffTime = expDate.getTime() - TODAY.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let currentSeverity = 'safe';
            
            if (diffDays <= 0) {
                currentSeverity = 'expired';
            } else if (diffDays <= 3) {
                currentSeverity = 'warning';
            }

            if (currentSeverity === 'expired') {
                severity = 'expired';
            } else if (currentSeverity === 'warning' && severity !== 'expired') {
                severity = 'warning';
            } else if (currentSeverity === 'safe' && severity === 'none') {
                severity = 'safe';
            }
        });
        return severity;
    };

    const renderCalendar = () => {
        calendarGrid.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDayIndex = firstDay.getDay(); // 0=Sunday

        calendarHeader.textContent = `${firstDay.toLocaleString("default", {
            month: "long",
        })} ${year}`;

        let currentRow = document.createElement("div");
        currentRow.setAttribute("role", "row");
        calendarGrid.appendChild(currentRow);

        // Empty cells before the first day
        for (let i = 0; i < startDayIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-cell", "empty");
            emptyCell.setAttribute("role", "gridcell"); 
            currentRow.appendChild(emptyCell);
        }

        // Fill days
        for (let day = 1; day <= lastDay.getDate(); day++) {

            if ((startDayIndex + day - 1) % 7 === 0) {
                // If it's not the very first day, create a new row
                if (day !== 1) { 
                    currentRow = document.createElement("div");
                    currentRow.setAttribute("role", "row");
                    calendarGrid.appendChild(currentRow);
                }
            }
            
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
                const severity = getItemSeverity(expiringItems, cellDate);
                if (severity !== 'none') {
                    cell.classList.add(severity);
                }

                const countEl = document.createElement("div");
                countEl.classList.add("item-count");
                countEl.textContent = `${expiringItems.length} item(s) expiring`;
                cell.appendChild(countEl);

                const tooltip = document.createElement("div");
                tooltip.classList.add("tooltip");
                const itemNames = expiringItems.map((i) => i.name).join(", ");
                tooltip.textContent = `Expiring: ${itemNames}`;
                tooltip.setAttribute("aria-label", tooltip.textContent);
                cell.appendChild(tooltip);
            }

            currentRow.appendChild(cell); 
        }
        
        // Fill the rest of the last row with empty cells 
        const totalCells = startDayIndex + lastDay.getDate();
        const cellsInLastRow = totalCells % 7;
        const remainingCells = cellsInLastRow === 0 ? 0 : 7 - cellsInLastRow;

        for (let i = 0; i < remainingCells; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-cell", "empty");
            emptyCell.setAttribute("role", "gridcell");
            currentRow.appendChild(emptyCell);
        }


        renderMonthlySummary(year, month);
    };

    // Render Monthly Summary and event listeners
    const renderMonthlySummary = (year, month) => {
        monthlySummaryList.innerHTML = "";

        const monthlyItems = [];
        inventory.forEach((item) => {
            if (!item.expiration) return;
            const expDate = new Date(item.expiration);
            
            if (expDate.getFullYear() === year && expDate.getMonth() === month) {
                const severity = getItemSeverity([item]);
                monthlyItems.push({ 
                    date: expDate.toISOString().split("T")[0], 
                    name: item.name,
                    severity: severity
                });
            }
        });

        if (monthlyItems.length === 0) {
            monthlySummaryList.innerHTML = "<li>No expiring items this month.</li>";
            return;
        }

        monthlyItems.sort((a, b) => new Date(a.date) - new Date(b.date));

        monthlyItems.forEach((item) => {
            const li = document.createElement("li");
            const formattedDate = new Date(item.date).toLocaleDateString();
            
            let emoji = '✅';
            let colorClass = 'safe-text'; 
            let borderColor = '#388E3C'; 
            
            if (item.severity === 'warning') {
                emoji = '⚠️';
                colorClass = 'warning-text';
                borderColor = '#FF9800'; 
            } else if (item.severity === 'expired') {
                emoji = '❌';
                colorClass = 'expired-text';
                borderColor = '#C62828'; 
            }

            li.innerHTML = `
                <span class="date-label ${colorClass}">${emoji} ${formattedDate}</span>
                <span>${item.name}</span>
            `;
            li.style.borderLeftColor = borderColor;
            
            monthlySummaryList.appendChild(li);
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
});
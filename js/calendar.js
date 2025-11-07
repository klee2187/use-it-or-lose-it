document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');

    // Function to render the current month's
    function renderCalendar() {
        const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        calendarElement.innerHTML = '';
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); 

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday

        // placeholders for days before the 1st
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell', 'empty');
            calendarElement.appendChild(emptyCell);
        }

        // Render each day
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.textContent = day;
            
            const fullDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cell.dataset.date = fullDateString;

            // Check inventory for expiring items
            const expiringItems = items.filter(item => item.expiration === fullDateString);

            if (expiringItems.length > 0) {
                cell.classList.add('expiring');
                cell.tabIndex = 0; 

                // Tooltip content
                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                
                let tooltipContent = `**${expiringItems.length} item(s) expiring:**<ul>`;
                expiringItems.forEach(item => {
                    tooltipContent += `<li>${item.name} (${item.quantity})</li>`;
                });
                tooltipContent += `</ul>`;
                
                tooltip.innerHTML = tooltipContent;
                cell.appendChild(tooltip);
            }
            
            calendarElement.appendChild(cell);
        }
    }

    renderCalendar();
});
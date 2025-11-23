document.addEventListener('DOMContentLoaded', () => {
  const calendarHeader = document.getElementById('calendarHeader');
  const calendarGrid = document.getElementById('calendarGrid');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');

  let currentDate = new Date();
  const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

  const renderCalendar = () => {
    calendarGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    calendarHeader.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

    // Empty cells before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('calendar-cell');
      calendarGrid.appendChild(emptyCell);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Fill days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const cell = document.createElement('div');
      cell.classList.add('calendar-cell');
      cell.innerHTML = `<div class="date">${day}</div>`;

      const cellDate = new Date(year, month, day);
      cellDate.setHours(0,0,0,0);

      const expiringItems = inventoryItems.filter(item => {
        if (!item.expiration) return false;
        const expDate = new Date(item.expiration);
        expDate.setHours(0,0,0,0);
        return expDate.getTime() === cellDate.getTime();
      });

      if (expiringItems.length > 0) {
        expiringItems.forEach(item => {
          const expDate = new Date(item.expiration);
          expDate.setHours(0,0,0,0);
          const diffDays = Math.ceil((expDate - today)/(1000*60*60*24));

          if (diffDays <= 3) {
            cell.classList.add('danger');
          } else if (diffDays <= 5) {
            cell.classList.add('warning');
          } else {
            cell.classList.add('safe');
          }
        });

        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = expiringItems.map(i => i.name).join(', ');
        tooltip.setAttribute('aria-label', `Expiring items: ${tooltip.textContent}`);
        cell.appendChild(tooltip);
      }

      calendarGrid.appendChild(cell);
    }
  };

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
  });

  renderCalendar();
});
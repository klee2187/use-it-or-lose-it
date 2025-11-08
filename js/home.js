document.addEventListener('DOMContentLoaded', () => {
    // Check for alerts immediately
    checkExpirationsForAlert();

    function checkExpirationsForAlert() {
        const items = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const alertSection = document.getElementById('alertSection');
        const alertMessage = document.getElementById('alertMessage');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nearExpiration = [];
        const expired = [];

        items.forEach(item => {
            const expDate = new Date(item.expiration);
            expDate.setDate(expDate.getDate() + 1); 
            const timeDiff = expDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysRemaining <= 0) {
                expired.push(item);
            } else if (daysRemaining <= 3) {
                nearExpiration.push(item);
            }
        });

        if (expired.length > 0) {
            showAlert('danger', expired.length, 0);
        } else if (nearExpiration.length > 0) {
            showAlert('warning', 0, nearExpiration.length);
        } else {
            showAlert('safe', 0, 0);
        }
    }

    function showAlert(type, expiredCount, warningCount) {
        const alertSection = document.getElementById('alertSection');
        const alertMessage = document.getElementById('alertMessage');
        
        alertSection.classList.remove('hidden', 'danger', 'warning', 'safe', 'show');
        alertSection.classList.add(type);
        
        let message = '';

        if (type === 'danger') {
            const itemText = expiredCount === 1 ? 'item' : 'items';
            message = `🚨 **URGENT:** You have <span class="danger-text">${expiredCount} ${itemText}</span> that have expired! Check your inventory now!`;
        } else if (type === 'warning') {
            const itemText = warningCount === 1 ? 'item' : 'items';
            message = `⚠️ **Heads Up:** <span class="warning-text">${warningCount} ${itemText}</span> are expiring in the next 3 days. Time to plan a meal!`;
        } else if (type === 'safe') {
            message = `✅ **Great job!** No items are critically close to expiring.`;
        }
        
        alertMessage.innerHTML = message;

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            alertSection.classList.add('hidden');
        });

        // Ensures no duplicate close button
        if (!alertSection.querySelector('.close-btn')) {
            alertSection.appendChild(closeBtn);
        }

        // Slight delay to trigger transition
        setTimeout(() => {
            alertSection.classList.add('show');
        }, 50);
    }
});
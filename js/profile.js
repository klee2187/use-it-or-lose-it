document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const profileDisplay = document.getElementById('profileDisplay');
    const displayElements = {
        name: document.getElementById('displayName'),
        email: document.getElementById('displayEmail'),
        household: document.getElementById('displayHousehold'),
        goal: document.getElementById('displayGoal')
    };
    
    // Load existing profiles
    loadProfile();

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });

    function saveProfile() {
        const profileData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            householdSize: document.getElementById('householdSize').value,
            foodGoal: document.getElementById('foodGoal').value
        };

        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Hide form and show display area
        profileForm.classList.add('hidden');
        displayProfile(profileData);
        profileDisplay.classList.remove('hidden');
    }

    function loadProfile() {
        const profileData = JSON.parse(localStorage.getItem('userProfile'));

        if (profileData) {
            // Populate form if data exists 
            document.getElementById('fullName').value = profileData.fullName || '';
            document.getElementById('email').value = profileData.email || '';
            document.getElementById('householdSize').value = profileData.householdSize || '';
            document.getElementById('foodGoal').value = profileData.foodGoal || '';
            
            // Display data
            displayProfile(profileData);
            profileForm.classList.add('hidden');
            profileDisplay.classList.remove('hidden');
        } else {
            // Show form if no profile exists
            profileForm.classList.remove('hidden');
            profileDisplay.classList.add('hidden');
        }
    }

    function displayProfile(data) {
        displayElements.name.textContent = data.fullName;
        displayElements.email.textContent = data.email;
        displayElements.household.textContent = data.householdSize;
        displayElements.goal.textContent = data.foodGoal;
    }
});
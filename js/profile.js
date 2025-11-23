document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const clearProfileBtn = document.getElementById('clearProfileBtn');

  // Display elements
  const displayName = document.getElementById('displayName');
  const displayEmail = document.getElementById('displayEmail');
  const displayFamilySize = document.getElementById('displayFamilySize');

  // Input elements
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const familySizeInput = document.getElementById('profileFamilySize');

  // Load saved profile from localStorage
  const savedProfile = JSON.parse(localStorage.getItem('profile')) || {};
  if (savedProfile.name) displayName.textContent = savedProfile.name;
  if (savedProfile.email) displayEmail.textContent = savedProfile.email;
  if (savedProfile.familySize) displayFamilySize.textContent = savedProfile.familySize;

  // Save Profile
  profileForm.addEventListener('submit', e => {
    e.preventDefault();
    const profile = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      familySize: familySizeInput.value.trim()
    };

    localStorage.setItem('profile', JSON.stringify(profile));

    displayName.textContent = profile.name || '—';
    displayEmail.textContent = profile.email || '—';
    displayFamilySize.textContent = profile.familySize || '—';

    profileForm.reset();
  });

  // Edit Profile
  editProfileBtn.addEventListener('click', () => {
    const savedProfile = JSON.parse(localStorage.getItem('profile')) || {};
    if (savedProfile.name) nameInput.value = savedProfile.name;
    if (savedProfile.email) emailInput.value = savedProfile.email;
    if (savedProfile.familySize) familySizeInput.value = savedProfile.familySize;
  });

  // Clear Profile
  clearProfileBtn.addEventListener('click', () => {
    localStorage.removeItem('profile');
    displayName.textContent = '—';
    displayEmail.textContent = '—';
    displayFamilySize.textContent = '—';
    profileForm.reset();
  });
});
import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Initialize hamburger menu
  initNavbarToggle();

  const profileForm = document.getElementById("profileForm");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const clearProfileBtn = document.getElementById("clearProfileBtn");

  // Display elements
  const displayName = document.getElementById("displayName");
  const displayEmail = document.getElementById("displayEmail");
  const displayFamilySize = document.getElementById("displayFamilySize");
  const displayDiet = document.getElementById("displayDiet");
  const displayCuisine = document.getElementById("displayCuisine");

  // Input elements
  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const familySizeInput = document.getElementById("profileFamilySize");
  const dietInput = document.getElementById("profileDiet");
  const cuisineInput = document.getElementById("profileCuisine");

  // Load saved profile
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  if (savedProfile.name) displayName.textContent = savedProfile.name;
  if (savedProfile.email) displayEmail.textContent = savedProfile.email;
  if (savedProfile.familySize) displayFamilySize.textContent = savedProfile.familySize;
  if (savedProfile.diet) displayDiet.textContent = savedProfile.diet;
  if (savedProfile.cuisine) displayCuisine.textContent = savedProfile.cuisine;

  // Save Profile
  profileForm.addEventListener("submit", e => {
    e.preventDefault();
    const profile = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      familySize: familySizeInput.value.trim(),
      diet: dietInput.value,
      cuisine: cuisineInput.value.trim()
    };

    localStorage.setItem("profile", JSON.stringify(profile));

    displayName.textContent = profile.name || "—";
    displayEmail.textContent = profile.email || "—";
    displayFamilySize.textContent = profile.familySize || "—";
    displayDiet.textContent = profile.diet || "—";
    displayCuisine.textContent = profile.cuisine || "—";

    profileForm.reset();
  });

  // Edit Profile
  editProfileBtn.addEventListener("click", () => {
    const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
    if (savedProfile.name) nameInput.value = savedProfile.name;
    if (savedProfile.email) emailInput.value = savedProfile.email;
    if (savedProfile.familySize) familySizeInput.value = savedProfile.familySize;
    if (savedProfile.diet) dietInput.value = savedProfile.diet;
    if (savedProfile.cuisine) cuisineInput.value = savedProfile.cuisine;
  });

  // Clear Profile
  clearProfileBtn.addEventListener("click", () => {
    localStorage.removeItem("profile");
    displayName.textContent = "—";
    displayEmail.textContent = "—";
    displayFamilySize.textContent = "—";
    displayDiet.textContent = "—";
    displayCuisine.textContent = "—";
    profileForm.reset();
  });
});
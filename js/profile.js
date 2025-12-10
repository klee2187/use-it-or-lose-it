import { initNavbarToggle } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
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
  const preferencesSection = document.querySelector(".profile-preferences");

  // Input elements
  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const familySizeInput = document.getElementById("profileFamilySize");
  const dietInput = document.getElementById("profileDiet");
  const cuisineInput = document.getElementById("profileCuisine");

  // Success modal + toast
  const successModal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const toast = document.getElementById("toast");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // Load saved profile
  const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
  if (savedProfile.name || savedProfile.email || savedProfile.familySize || savedProfile.diet || savedProfile.cuisine) {
    displayName.textContent = savedProfile.name || "—";
    displayEmail.textContent = savedProfile.email || "—";
    displayFamilySize.textContent = savedProfile.familySize || "—";
    displayDiet.textContent = savedProfile.diet || "—";
    displayCuisine.textContent = savedProfile.cuisine || "—";
    preferencesSection.classList.remove("hidden");
  }

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

    preferencesSection.classList.remove("hidden");
    preferencesSection.classList.remove("fade-in");
    void preferencesSection.offsetWidth;
    preferencesSection.classList.add("fade-in");

    profileForm.reset();

    successModal.classList.remove("hidden");
    showToast("✅ Profile saved!");
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

    preferencesSection.classList.add("hidden");
    showToast("🗑️ Profile cleared");
  });

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
  });
});
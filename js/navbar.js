document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
    toggleBtn.classList.toggle("active"); // animate hamburger
  });
});
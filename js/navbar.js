export function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggle || !navMenu) {
    console.warn("Navbar toggle or menu not found.");
    return;
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('nav-open');
    toggle.classList.toggle('open');
  });

  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', initNavbar);
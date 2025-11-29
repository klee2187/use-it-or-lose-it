document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Mobile nav toggle
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('nav-open');
    });
  }

  // Dropdown toggle
  const dropdownLinks = document.querySelectorAll('.dropdown > a');
  dropdownLinks.forEach(link => {
    const menu = link.nextElementSibling;
    if (!menu) return;

    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');

    // Click toggle for mobile
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const expanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !expanded);
        menu.classList.toggle('open');
      }
    });

    // Keyboard support
    link.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        menu.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
        const firstItem = menu.querySelector('a');
        if (firstItem) firstItem.focus();
      }
      if (e.key === 'Escape') {
        menu.classList.remove('open');
        link.setAttribute('aria-expanded', 'false');
        link.focus();
      }
    });

    // Arrow navigation inside dropdown
    const items = menu.querySelectorAll('a');
    items.forEach((item, idx) => {
      item.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[idx + 1] || items[0];
          next.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = items[idx - 1] || items[items.length - 1];
          prev.focus();
        }
        if (e.key === 'Escape') {
          menu.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });
    });
  });

  // Close dropdowns when clicking outside (mobile)
  document.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      dropdownLinks.forEach(link => {
        const menu = link.nextElementSibling;
        if (!menu) return;
        if (!link.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
// ===== INTRO ANIMATION =====
(function () {
  document.body.classList.add('intro-active');
  const intro = document.getElementById('intro');

  // After bar fills (≈2.1s total), slide the overlay away
  setTimeout(() => {
    intro.classList.add('hide');
    document.body.classList.remove('intro-active');

    // After slide-out transition ends, remove from DOM
    setTimeout(() => {
      intro.classList.add('done');
    }, 950);
  }, 2200);
})();

// Nav scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const burger = document.getElementById('burger');
let mobileMenu = document.querySelector('.nav-mobile');
if (!mobileMenu) {
  mobileMenu = document.createElement('div');
  mobileMenu.className = 'nav-mobile';
  mobileMenu.innerHTML = `
    <a href="#formations" class="mobile-link">Formations</a>
    <a href="#programme" class="mobile-link">Programme</a>
    <a href="#tarifs" class="mobile-link">Tarifs</a>
    <a href="#contact" class="mobile-link">Contact</a>
  `;
  document.body.appendChild(mobileMenu);
}

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.imagine-card, .programme-item, .temoignage-card, .tarif-card, .faq-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 600);
  }
});

// ===== INTRO ANIMATION =====
(function () {
  document.body.classList.add('intro-active');

  const intro   = document.getElementById('intro');
  const fill    = document.getElementById('progressFill');
  const percent = document.getElementById('progressPercent');

  if (!intro || !fill || !percent) return;

  let current = 0;
  // Start counting after elements appear (~1s delay from CSS)
  const startDelay = 1100;
  const duration   = 1800; // ms to go 0→100
  const interval   = 30;   // tick every 30ms
  const steps      = duration / interval;
  const increment  = 100 / steps;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  let startTime = null;

  setTimeout(() => {
    startTime = performance.now();

    const tick = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      current = Math.round(easeOut(t) * 100);

      fill.style.width    = current + '%';
      percent.textContent = current + '%';

      if (current >= 100) {
        clearInterval(tick);
        // Pause at 100% then slide out
        setTimeout(() => {
          intro.classList.add('slide-out');
          document.body.classList.remove('intro-active');
          setTimeout(() => intro.classList.add('done'), 1050);
        }, 400);
      }
    }, interval);
  }, startDelay);
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

// Mobile carousel dots
(function () {
  const track = document.querySelector('.programme-cards');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.prog-card');
  const total = cards.length;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsContainer.appendChild(dot);
  }

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap);
    const active = Math.round(scrollLeft / cardWidth);
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }, { passive: true });
})();

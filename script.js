// Force scroll to top on page load/refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
document.addEventListener('DOMContentLoaded', function () { window.scrollTo(0, 0); });
window.addEventListener('load', function () { window.scrollTo(0, 0); });

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

const offreCard = document.querySelector('.offre-card');
const offreText = document.querySelector('.offre-text');
if (offreCard) { offreCard.classList.add('fade-in', 'fade-in--left'); observer.observe(offreCard); }
if (offreText) { offreText.classList.add('fade-in', 'fade-in--right'); observer.observe(offreText); }

// Avantages section animations
document.querySelectorAll('.av-card').forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = (i * 80) + 'ms';
  observer.observe(el);
});
document.querySelectorAll('.aqui-list li').forEach((el, i) => {
  el.classList.add('fade-in', 'fade-in--right');
  el.style.transitionDelay = (i * 100) + 'ms';
  observer.observe(el);
});
const avantagesTitles = document.querySelectorAll('.avantages-col .section-deco, .aqui-col .section-deco');
avantagesTitles.forEach(el => { el.classList.add('fade-in'); observer.observe(el); });

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

// Carousel prev/next arrows
(function () {
  const track = document.querySelector('.programme-cards');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  if (!track || !prev || !next) return;

  function scrollBy(dir) {
    const card = track.querySelector('.prog-card');
    const gap = parseInt(getComputedStyle(track).gap) || 16;
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  }

  prev.addEventListener('click', () => scrollBy(-1));
  next.addEventListener('click', () => scrollBy(1));
})();

// ===== TÉMOIGNAGES INFINITE SCROLL =====
window.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.temoignages-track');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML = clone + clone;
});

// ===== FORMSPREE AJAX =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    await fetch('https://formspree.io/f/mkolbnby', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
  });
}

/* ═══════════════════════════════════════════
   FOUR ROOT DIGITAL — script.js
   Lean vanilla JS — no heavy dependencies
═══════════════════════════════════════════ */

// ── LOADER ──────────────────────────────
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderStat = document.getElementById('loaderStatus');
const statuses = ['Loading', 'Crafting', 'Ready'];
let progress = 0;
let si = 0;

const loaderInterval = setInterval(() => {
  progress += Math.random() * 22 + 8;
  if (progress > 100) progress = 100;
  loaderFill.style.width = progress + '%';

  if (progress > 40 && si === 0) { si = 1; if (loaderStat) loaderStat.textContent = statuses[1]; }
  if (progress > 80 && si === 1) { si = 2; if (loaderStat) loaderStat.textContent = statuses[2]; }

  if (progress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      revealHero();
    }, 400);
  }
}, 80);

document.body.classList.add('no-scroll');

// ── HERO REVEAL ──────────────────────────
function revealHero() {
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('revealed');
}

// ── NAV SCROLL ───────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ──────────────────────────
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMenu() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.classList.toggle('no-scroll', isOpen);
});

mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ── SCROLL REVEAL ─────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px'
});

// Observe elements for a more editorial "blur-reveal"
const elsToReveal = document.querySelectorAll('.section, .offer-banner, .timeline, .skills, .process-item, .svc-card, .project-row, .faq-item, .hero-sub, .hero-actions, .hstat');

elsToReveal.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.filter = 'blur(12px)';
  el.style.transform = 'translateY(30px) scale(0.98)';
  el.style.transition = 'opacity 1.2s var(--ease), filter 1.2s var(--ease), transform 1.2s var(--ease)';
  revealObserver.observe(el);
});

// Apply in-view state with delay for a more natural flow
const styleEl = document.createElement('style');
styleEl.textContent = `
  .in-view { 
    opacity: 1 !important; 
    filter: blur(0) !important; 
    transform: translateY(0) scale(1) !important; 
  }
`;
document.head.appendChild(styleEl);

document.addEventListener('DOMContentLoaded', () => {
  // Staggering child elements naturally
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => {
    const items = sec.querySelectorAll('.process-item, .svc-card, .project-row, .promise-item');
    items.forEach((item, i) => {
      item.style.transitionDelay = (i * 0.1) + 's';
    });
  });
});

// ── FAQ ANIMATION ─────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    // nothing needed — CSS handles icon rotation
  });
});

// ── CONTACT FORM ─────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    // Simple protection key (In a real app, this would be managed securely)
    const SECRET_KEY = "FRD_SECURE_2026";

    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);
    formData.append('api_key', SECRET_KEY);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Google Apps Script requires no-cors for direct browser POSTs usually
      });

      // Note: With no-cors, we won't get a "success" body, 
      // but if it doesn't throw, it likely sent.

      btn.textContent = 'Sent ✓';
      btn.style.background = '#2ea84a';
      btn.style.borderColor = '#2ea84a';
      form.reset();

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      btn.textContent = 'Error ×';
      btn.style.background = '#e74c3c';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ── ACTIVE NAV LINK ───────────────────────
const sections = document.querySelectorAll('section[id], .hero[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const linkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--ink)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => linkObserver.observe(s));
// ── PAGE TEARING ANIMATION (GSAP) ────────────────
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  /**
   * Generates a "messy" jagged polygon path for the clip-path effect.
   * Uses sine waves and randomness for a more organic paper-tear look.
   */
  function generateMessyPath(isTop = true) {
    const steps = 60; // Higher resolution for messiness
    const amplitude = 5; // How deep the tears go (%)
    const points = [];

    // Base coordinates for the corners not being torn
    if (isTop) {
      points.push("0% 100%", "100% 100%");
      // Tear the top edge (moving from right to left to complete the loop)
      for (let i = steps; i >= 0; i--) {
        const x = (i / steps) * 100;
        const noise = (Math.random() - 0.5) * amplitude;
        const wave = Math.sin(i * 0.8) * (amplitude * 0.5);
        const y = Math.max(0, 0 + noise + wave);
        points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
      }
    } else {
      points.push("100% 0%", "0% 0%");
      // Tear the bottom edge
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * 100;
        const noise = (Math.random() - 0.5) * amplitude;
        const wave = Math.sin(i * 0.8) * (amplitude * 0.5);
        const y = Math.min(100, 100 + noise + wave);
        points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
      }
    }

    return `polygon(${points.join(", ")})`;
  }

  // Apply animations to each section
  document.querySelectorAll('.torn-section').forEach((section, i) => {
    // We'll "tear" the top of the section as it enters the viewport
    const finalPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    const initialPath = generateMessyPath(true);

    // Set initial state
    gsap.set(section, { clipPath: initialPath });

    gsap.to(section, {
      clipPath: finalPath,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom", // Starts as soon as the top of the section hits the bottom of the viewport
        end: "top 20%",      // Completes when the top of the section is 20% from the top
        scrub: 0.5,          // Smoothly follows scroll
      }
    });

    // Optional: Add a subtle exit tear at the bottom
    const exitPath = generateMessyPath(false);
    gsap.to(section, {
      clipPath: exitPath,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "bottom 20%", // Starts tearing out when bottom reaches 20% of screen
        end: "bottom top",    // Finished by the time the bottom leaves the screen
        scrub: 0.5,
      }
    });
  });
}

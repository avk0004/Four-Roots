/* ═══════════════════════════════════════════
   FOUR ROOT DIGITAL — script.js
   Premium Interactions & Motion Logic
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  let progress = 0;

  const updateLoader = () => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;

    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderPercent) loaderPercent.textContent = progress;

    if (progress < 100) {
      setTimeout(updateLoader, 80 + Math.random() * 100);
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        revealHero();
      }, 500);
    }
  };

  updateLoader();

  // ── HERO REVEAL ──────────────────────────
  const revealHero = () => {
    const target = document.getElementById("scramble-text");
    if (!target) return;

    // Two-line text
    const lines = ["BUILDING", "BRANDS"];

    target.innerHTML = "";
    target.style.opacity = "1";
    target.style.visibility = "visible";

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const spans = [];

    // Create lines
    lines.forEach((line, lineIndex) => {
      const lineWrap = document.createElement("div");
      lineWrap.classList.add("hero-line");

      line.split("").forEach((letter) => {
        const span = document.createElement("span");

        span.classList.add("char");
        span.textContent = "";

        lineWrap.appendChild(span);

        spans.push({
          el: span,
          final: letter,
        });
      });

      target.appendChild(lineWrap);

      // Add spacing between lines
      if (lineIndex !== lines.length - 1) {
        const spacer = document.createElement("div");
        spacer.style.height = "0.15em";
        target.appendChild(spacer);
      }
    });

    // Scramble animation
    function animateLetter(obj, delay) {
      let frame = 0;
      const maxFrames = 18;

      setTimeout(() => {
        const interval = setInterval(() => {
          obj.el.textContent =
            chars[Math.floor(Math.random() * chars.length)];

          frame++;

          if (frame >= maxFrames) {
            clearInterval(interval);

            obj.el.textContent = obj.final;

            gsap.fromTo(
              obj.el,
              {
                opacity: 0,
                y: 25,
                filter: "blur(10px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power3.out",
              }
            );
          }
        }, 30);
      }, delay);
    }

    // Timeline
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-bg",
      { scale: 1.08 },
      {
        scale: 1,
        duration: 3,
        ease: "power2.out",
      }
    );

    // Start scramble
    setTimeout(() => {
      spans.forEach((obj, i) => {
        animateLetter(obj, i * 70);
      });
    }, 500);

    // Parallax
    window.addEventListener("mousemove", (e) => {
      const x =
        (e.clientX / window.innerWidth - 0.5) * 15;

      const y =
        (e.clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".hero-bg", {
        x: -x,
        y: -y,
        duration: 1,
        ease: "power2.out",
      });
    });
  };

  // ── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      nav.classList.add('scrolled');
      nav.classList.remove('on-hero');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('on-hero');
    }
  }, { passive: true });

  // Initial check
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.add('on-hero');

  // ── MOBILE MENU ──────────────────────────
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  // ── SCROLL REVEAL (GSAP) ──────────────────
  gsap.registerPlugin(ScrollTrigger);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    // Check if it's the services grid or pricing layout for staggers
    if (el.classList.contains('services-grid')) {
      gsap.from(el.querySelectorAll('.service-card'), {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 40,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out"
      });
    } else if (el.classList.contains('pricing-layout')) {
      gsap.from(el.querySelectorAll('.package-card'), {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out"
      });
    } else {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 30,
        duration: 1,
        ease: "power3.out"
      });
    }
  });

  // Mobile Visibility Fix for Pricing (Ensure JS overrides any layout glitches)
  const fixMobileLayout = () => {
    const pricingLayout = document.querySelector('.pricing-layout');
    if (pricingLayout) {
      if (window.innerWidth < 1024) {
        pricingLayout.style.gridTemplateColumns = '1fr';
      } else {
        pricingLayout.style.gridTemplateColumns = 'repeat(2, 1fr)';
      }
    }
  };

  window.addEventListener('resize', fixMobileLayout);
  fixMobileLayout();

  // ── HERO STATS COUNTER ───────────────────
  function animateStats() {
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      let current = 0;

      const updateCount = () => {
        // current += (target - current) * 0.05
        current += (target - current) * 0.05;

        if (Math.abs(target - current) < 0.5) {
          stat.textContent = target;
        } else {
          stat.textContent = Math.ceil(current);
          requestAnimationFrame(updateCount);
        }
      };
      updateCount();
    });
  }

  // ── FAQ ACCORDION ────────────────────────
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(item => {
    item.addEventListener('click', (e) => {
      // Close others
      faqs.forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });

  // ── QUOTE FORM ───────────────────────────
  const form = document.getElementById('projectForm');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('sending');
      submitBtn.disabled = true;

      // Mock API call
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        submitBtn.textContent = 'Submitted ✓ — We\'ll reply within 24h';
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('success');
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('success');
          submitBtn.disabled = false;
        }, 5000);

      } catch (error) {
        submitBtn.textContent = 'Error — WhatsApp us ↗';
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('error');

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('error');
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }

  // ── ACTIVE NAV LINK (ScrollSpy) ──────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ── FOOTER YEAR ──────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── PREMIUM LOGO MARQUEE (JS POWERED) ──
  const initMarquee = () => {
    const track = document.getElementById("track");
    if (!track) return;

    // Duplicate content for infinite loop (only once)
    track.innerHTML += track.innerHTML;

    let position = 0;
    let isPaused = false;
    
    // Dynamic speed based on screen width
    const getSpeed = () => {
      const width = window.innerWidth;
      if (width < 480) return 0.5;  // Slower on mobile for better readability
      if (width < 1024) return 0.7; // Medium on tablet
      return 0.9;                   // Default premium speed
    };

    let speed = getSpeed();

    // Use requestAnimationFrame for 60fps motion
    const animate = () => {
      if (!isPaused) {
        position -= speed;
        
        // Reset position seamlessly when half the track width is reached
        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
        }
        
        track.style.transform = `translateX(${position}px) translateZ(0)`;
      }
      requestAnimationFrame(animate);
    };

    // Update speed on resize
    window.addEventListener('resize', () => {
      speed = getSpeed();
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);

    animate();
  };

  initMarquee();
});
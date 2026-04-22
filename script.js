/* ══════════════════════════════════════════════
   SUNTECK BEACH RESIDENCES — MAIN JS
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. AOS INIT ── */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ── 2. NAVBAR SCROLL ── */
  const navbar = document.getElementById('mainNav');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── 3. SMOOTH SCROLL for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile nav if open
        const collapse = document.querySelector('#navbarNav.show');
        if (collapse) {
          bootstrap.Collapse.getInstance(collapse)?.hide();
        }
      }
    });
  });

  /* ── 4. COUNTER ANIMATION for stats ── */
  const counters = document.querySelectorAll('.stat-number');
  const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.innerText;
        
        // Extract prefix, number, suffix
        const match = rawText.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return;

        const prefix = match[1];
        const target = parseFloat(match[2]);
        const suffix = match[3];
        
        const isDecimal = rawText.includes('.');
        const duration = 1800;
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          const current = target * ease;

          const numStr = isDecimal ? current.toFixed(1) : Math.floor(current);
          el.innerText = prefix + numStr + suffix;

          if (progress < 1) requestAnimationFrame(update);
          else el.innerText = rawText;
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  };

  const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── 5. ENQUIRY FORM HANDLING ── */
  const setupForm = (formId, btnId, successId) => {
    const formEl = document.getElementById(formId);
    const submitBtnEl = document.getElementById(btnId);
    const successDivEl = document.getElementById(successId);

    if (formEl && submitBtnEl && successDivEl) {
      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!formEl.checkValidity()) {
          formEl.classList.add('was-validated');
          return;
        }

        // Show loading
        const btnText = submitBtnEl.querySelector('.btn-text');
        const btnLoading = submitBtnEl.querySelector('.btn-loading');
        if (btnText) btnText.classList.add('d-none');
        if (btnLoading) btnLoading.classList.remove('d-none');
        submitBtnEl.disabled = true;

        // Simulate API call
        setTimeout(() => {
          formEl.classList.add('d-none');
          successDivEl.classList.remove('d-none');
        }, 1800);
      });
    }
    return { formEl, submitBtnEl, successDivEl };
  };

  const modalFormEls = setupForm('enquiryForm', 'submitBtn', 'formSuccess');
  setupForm('heroEnquiryForm', 'heroSubmitBtn', 'heroFormSuccess');

  /* ── 6. MODAL RESET on close ── */
  const enquireModal = document.getElementById('enquireModal');
  if (enquireModal) {
    enquireModal.addEventListener('hidden.bs.modal', () => {
      const { formEl, submitBtnEl, successDivEl } = modalFormEls;
      if (formEl) {
        formEl.classList.remove('d-none', 'was-validated');
        formEl.reset();
        successDivEl.classList.add('d-none');
        const btnText = submitBtnEl.querySelector('.btn-text');
        const btnLoading = submitBtnEl.querySelector('.btn-loading');
        if (btnText) btnText.classList.remove('d-none');
        if (btnLoading) btnLoading.classList.add('d-none');
        submitBtnEl.disabled = false;
      }
    });
  }

  /* ── 7. ACTIVE NAV LINK on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── 8. HERO PARALLAX (subtle) ── */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroSection.style.backgroundPositionY = `${scrolled * 0.35}px`;
      }
    }, { passive: true });
  }

  /* ── 9. GALLERY LIGHTBOX (simple expand) ── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.92);
        display:flex; align-items:center; justify-content:center;
        cursor:zoom-out; animation: fadeIn 0.3s ease;
      `;

      const fullImg = document.createElement('img');
      fullImg.src = img.src.replace('w=500', 'w=1200').replace('w=800', 'w=1400');
      fullImg.style.cssText = `
        max-width:92vw; max-height:92vh;
        border-radius:12px; box-shadow:0 30px 80px rgba(0,0,0,0.6);
        object-fit:contain;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        position:absolute; top:20px; right:24px;
        background:rgba(255,255,255,0.12); border:none;
        color:#fff; font-size:22px; width:44px; height:44px;
        border-radius:50%; cursor:pointer; display:flex;
        align-items:center; justify-content:center;
        transition:background 0.2s;
      `;

      closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(201,168,76,0.5)'; });
      closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(255,255,255,0.12)'; });

      overlay.appendChild(fullImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }, 250);
      };

      overlay.addEventListener('click', close);
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

      document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
      });
    });
  });

  /* ── 10. FLOATING BTN ENTRANCE ANIMATION ── */
  const floatingCtas = document.querySelector('.floating-ctas');
  if (floatingCtas) {
    floatingCtas.style.opacity = '0';
    floatingCtas.style.transform = 'translateX(30px)';
    floatingCtas.style.transition = 'all 0.6s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => {
      floatingCtas.style.opacity = '1';
      floatingCtas.style.transform = 'translateX(0)';
    }, 1500);
  }

  /* ── 11. INJECT fadeIn keyframe for gallery ── */
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .active-nav { color: var(--gold-light, #E8C97E) !important; }
    .active-nav::after { transform: scaleX(1) !important; }
  `;
  document.head.appendChild(styleTag);

  /* ── 12. MOBILE phone input formatting ── */
  const mobileInput = document.getElementById('mobile');
  if (mobileInput) {
    mobileInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  /* ── 13. URGENCY TIMER (visible on CTA strip) ── */
  // Adds subtle real-time urgency to the page
  const ctaLabel = document.querySelector('.cta-label');
  if (ctaLabel) {
    const now = new Date();
    const tonight = new Date(now);
    tonight.setHours(23, 59, 59, 0);

    const updateTimer = () => {
      const remaining = tonight - new Date();
      if (remaining <= 0) return;
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      ctaLabel.textContent = `⏰ TODAY'S OFFER ENDS IN ${h}h ${m}m ${s}s — LIMITED INVENTORY`;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  console.log('%cSunteck Beach Residences 🌊', 'font-size:18px; color:#C9A84C; font-weight:bold;');
});

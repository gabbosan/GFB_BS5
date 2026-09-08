/* =====================================================
   GFB — Portfólio 2026
   IntersectionObserver · Lightbox · Menu · Progress bar
   ===================================================== */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Stagger: converte data-delay em variável CSS ---------- */
  $$('.reveal[data-delay]').forEach((el) => {
    el.style.setProperty('--d', el.dataset.delay);
  });

  /* =====================================================
     1. REVEAL ON SCROLL
     ===================================================== */
  const revealEls = $$('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

    revealEls.forEach((el) => io.observe(el));
  }

  /* =====================================================
     2. NAV: sombra ao rolar + progress bar
     ===================================================== */
  const pill = $('.nav-pill');
  const progress = $('.progress-bar');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      pill.classList.toggle('scrolled', window.scrollY > 30);

      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =====================================================
     3. HIGHLIGHT DO LINK ATIVO
     ===================================================== */
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  const setActive = (id) => {
    navLinks.forEach((link) =>
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
    );
  };

  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((section) => navIO.observe(section));
  }

  /* =====================================================
     4. MENU MOBILE FULLSCREEN
     ===================================================== */
  const burger = $('.nav-burger');
  const overlay = $('#menuOverlay');

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    if (isOpen) return closeMenu();

    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  /* Fecha ao clicar em qualquer link do overlay */
  $$('#menuOverlay a').forEach((link) => link.addEventListener('click', closeMenu));

  /* ESC fecha menu e lightbox */
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  /* =====================================================
     5. SPOTLIGHT nos cards bento (segue o mouse)
     ===================================================== */
  $$('.bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* =====================================================
     6. LIGHTBOX da galeria
     ===================================================== */
  const galleryImgs = $$('.gallery img');
  const lightbox = $('#lightbox');
  const lbImg = $('.lb-img', lightbox);
  const lbCounter = $('.lb-counter', lightbox);
  let current = 0;
  let lastFocus = null;

  const render = () => {
    lbImg.src = galleryImgs[current].src;
    lbCounter.textContent = `${current + 1} / ${galleryImgs.length}`;
  };

  const openLightbox = (index) => {
    current = index;
    lastFocus = document.activeElement;
    render();
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
    $('.lb-close', lightbox).focus();
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.hidden = true;
      lbImg.src = '';
      lastFocus?.focus();
    }, 350);
  };

  const step = (dir) => {
    current = (current + dir + galleryImgs.length) % galleryImgs.length;
    render();
  };

  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });

  $('.lb-close', lightbox).addEventListener('click', closeLightbox);
  $('.lb-prev', lightbox).addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  $('.lb-next', lightbox).addEventListener('click', (e) => { e.stopPropagation(); step(1); });

  /* Clique no fundo fecha */
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* Setas do teclado */
  addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
/* ============================================
   SMOOTH SCROLL + FECHAR MENU MOBILE
   ============================================ */
(function() {
    'use strict';

    // Smooth scroll (compatível com todos navegadores) - animação manual tipo jQuery.animate
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            var targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();

            // Fecha menu mobile se estiver aberto
            var navCollapse = document.getElementById('navMenu');
            if (navCollapse) {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse && navCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            }

            var nav = document.querySelector('.navbar');
            var navHeight = nav ? nav.offsetHeight : 70;
            var start = window.pageYOffset;
            var targetY = targetEl.getBoundingClientRect().top + start - navHeight;
            var duration = 700; // ms
            var startTime = null;

            function easeInOutQuad(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; }

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var time = timestamp - startTime;
                var progress = Math.min(time / duration, 1);
                var eased = easeInOutQuad(progress);
                window.scrollTo(0, Math.round(start + (targetY - start) * eased));
                if (time < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    // Atualiza URL sem criar foco indesejado
                    if (history && history.replaceState) {
                        try { history.replaceState(null, null, targetId); } catch (err) {}
                    }
                    try {
                        if (window.getSelection) window.getSelection().removeAllRanges();
                        else if (document.selection) document.selection.empty();
                    } catch (err) {}
                }
            }

            window.requestAnimationFrame(step);
        });
    });

    /* ============================================
       ANIMAÇÃO SLIDE ON SCROLL
       ============================================ */
    function handleScrollAnimations() {
        var elements = document.querySelectorAll('.slideanim, .slideanim-delay');
        var windowHeight = window.innerHeight;
        var triggerPoint = windowHeight * 0.88;

        elements.forEach(function(el) {
            var pos = el.getBoundingClientRect().top;
            if (pos < triggerPoint) {
                if (el.classList.contains('slideanim-delay')) {
                    el.classList.add('slide-delay');
                } else {
                    el.classList.add('slide');
                }
            }
        });
    }

    window.addEventListener('load', handleScrollAnimations);

    /* ============================================
       FECHAR MENU AO CLICAR FORA (mobile)
       ============================================ */
    document.addEventListener('click', function(e) {
        var navMenu = document.getElementById('navMenu');
        var navbar = document.querySelector('.navbar');

        if (navMenu && navMenu.classList.contains('show')) {
            if (!navbar.contains(e.target)) {
                var bsCollapse = bootstrap.Collapse.getInstance(navMenu);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    });

    /* ============================================
       HIGHLIGHT DO MENU CONFORME SCROLL
       ============================================ */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        var scrollPos = window.scrollY + 100;
        var navHeight = document.querySelector('.navbar').offsetHeight || 70;
        scrollPos += navHeight;

        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Agrupa os handlers de scroll num único rAF por frame para não travar a animação suave
    var scrollTicking = false;
    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(function() {
            handleScrollAnimations();
            highlightNav();
            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

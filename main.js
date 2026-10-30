/* Mukto Keyboard — home page behaviour: mobile menu, FAQ accordion, back-to-top. */
(function () {
    'use strict';

    /* ---------- mobile menu ---------- */
    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    function closeMenu() {
        if (!links) return;
        links.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
    }
    if (burger && links) {
        burger.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        links.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) closeMenu();
        });
    }

    /* ---------- FAQ accordion (one open at a time) ---------- */
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq-item');
            var wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(function (it) {
                it.classList.remove('open');
                var q = it.querySelector('.faq-q');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!wasOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- back to top ---------- */
    var toTop = document.getElementById('backToTop');
    if (toTop) {
        var onScroll = function () {
            toTop.classList.toggle('visible', window.scrollY > 700);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- pause heavy SVG demos when off-screen (saves battery) ---------- */
    if ('IntersectionObserver' in window) {
        var demos = document.querySelectorAll('.scene');
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                en.target.style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
                en.target.querySelectorAll('*').forEach(function (n) {
                    n.style.animationPlayState = en.isIntersecting ? 'running' : 'paused';
                });
            });
        }, { rootMargin: '80px' });
        demos.forEach(function (d) { io.observe(d); });
    }
})();

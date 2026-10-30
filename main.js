(function () {
    'use strict';

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

        fetch('download/output-metadata.json?t=' + Date.now(), { cache: 'no-cache' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
            if (!data || !Array.isArray(data.elements)) return;
            var ver = '3.5', code = 20;
            data.elements.forEach(function (el) {
                if (el.versionName) ver = el.versionName;
                if (el.versionCode) code = el.versionCode;
            });
            document.querySelectorAll('.app-version').forEach(function (el) {
                el.textContent = 'v' + ver;
            });
            document.querySelectorAll('.app-build').forEach(function (el) {
                el.textContent = String(code);
            });
        })
        .catch(function () {});
})();

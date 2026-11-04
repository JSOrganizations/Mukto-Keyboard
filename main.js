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
            if (window.innerWidth > 1100) closeMenu();
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

        var vids = document.querySelectorAll('.phone-video');
        var vidIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                var v = en.target;
                var mock = v.closest('.phone-mockup');
                if (en.isIntersecting) {
                    if (!mock || !mock.classList.contains('user-paused')) {
                        v.play().catch(function () {});
                    }
                } else {
                    v.pause();
                }
            });
        }, { threshold: 0.25 });
        vids.forEach(function (v) { vidIo.observe(v); });
    }

    var phoneMocks = document.querySelectorAll('.phone-mockup');
    phoneMocks.forEach(function (mock) {
        var vid = mock.querySelector('video');
        if (!vid) return;
        mock.addEventListener('click', function () {
            if (vid.paused) {
                vid.play().catch(function () {});
                mock.classList.remove('paused', 'user-paused');
            } else {
                vid.pause();
                mock.classList.add('paused', 'user-paused');
            }
        });
        vid.addEventListener('play', function () { mock.classList.remove('paused'); });
        vid.addEventListener('pause', function () {
            if (mock.classList.contains('user-paused')) mock.classList.add('paused');
        });
    });

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

(function () {
    'use strict';
    var sec = document.getElementById('showcase');
    if (!sec) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vids = [].slice.call(sec.querySelectorAll('.show-video'));
    function load(v) { if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src; }
    if ('IntersectionObserver' in window) {
        var near = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } });
        }, { rootMargin: '500px 0px' });
        var act = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                var v = e.target, m = v.closest('.phone-mockup');
                if (e.isIntersecting) {
                    if (!reduce && !m.classList.contains('user-paused')) { load(v); v.play().catch(function () {}); }
                } else { v.pause(); }
            });
        }, { threshold: 0.45 });
        vids.forEach(function (v) { near.observe(v); act.observe(v); });
    } else if (!reduce) {
        vids.forEach(function (v) { load(v); v.play().catch(function () {}); });
    }

    var box = sec.querySelector('.mkc-box');
    var range = box.querySelector('input');
    function setPos(v) { box.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { box.classList.add('moved'); setPos(range.value); });
    if ('IntersectionObserver' in window && !reduce) {
        var sweep = new IntersectionObserver(function (es) {
            if (!es[0].isIntersecting) return;
            sweep.disconnect();
            var t0 = null;
            (function step(ts) {
                if (box.classList.contains('moved')) return;
                if (t0 === null) t0 = ts;
                var p = Math.min((ts - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 3), v = 100 - 50 * e;
                range.value = v; setPos(v);
                if (p < 1) requestAnimationFrame(step);
            })(performance.now());
        }, { threshold: 0.6 });
        range.value = 100; setPos(100);
        sweep.observe(box);
    }
})();

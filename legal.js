(function () {
    'use strict';
    window.scrollToTop = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    var btn = document.getElementById('backToTopBtn');
    if (!btn) return;
    function onScroll() { btn.classList.toggle('visible', window.scrollY > 350); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

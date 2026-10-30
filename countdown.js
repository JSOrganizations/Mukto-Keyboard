(function () {
    'use strict';

    var BN = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-release]'));
    if (!blocks.length) return;

    function isBn() {
        return (document.documentElement.getAttribute('data-lang') || 'bn') === 'bn';
    }

    function fmt(n, bn) {
        var s = n < 10 ? '0' + n : String(n);
        return bn ? s.replace(/[0-9]/g, function (d) { return BN[+d]; }) : s;
    }

    var timer = null;

    function tick() {
        var now = Date.now();
        var bn = isBn();
        var pending = 0;
        blocks.forEach(function (el) {
            var target = Date.parse(el.getAttribute('data-release'));
            if (isNaN(target)) return;
            var diff = Math.max(0, Math.floor((target - now) / 1000));
            if (diff === 0) {
                el.classList.add('is-live');
                return;
            }
            pending++;
            var parts = {
                d: Math.floor(diff / 86400),
                h: Math.floor((diff % 86400) / 3600),
                m: Math.floor((diff % 3600) / 60),
                s: diff % 60
            };
            Object.keys(parts).forEach(function (k) {
                el.querySelectorAll('[data-cd="' + k + '"]').forEach(function (node) {
                    var v = fmt(parts[k], bn);
                    if (node.textContent !== v) node.textContent = v;
                });
            });
        });
        if (!pending && timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    tick();
    timer = setInterval(tick, 1000);
    document.addEventListener('mukto:langchange', tick);
})();

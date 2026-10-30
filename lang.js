/*
 * Mukto Keyboard — shared language system (all pages)
 * Languages: bn (বাংলা, default) · en (English) · bl (Banglish)
 *
 * - Remembers the choice (localStorage) and honours ?language=xx
 * - Keeps the choice when moving between pages
 * - Updates <html lang>, <title>, meta description, and every [data-lang-btn]
 * - Markup patterns supported:
 *     1. <span class="lang-en">..</span><span class="lang-bn">..</span><span class="lang-bl">..</span>
 *        (shown/hidden by CSS through the body.lang-xx class — used on legal pages)
 *     2. data-i18n="key" (text stored in window.I18N, see i18n.js — used on the home page)
 *        The Bangla text lives in the HTML itself and is cached on first run.
 *     3. data-i18n-attr="aria-label:key;title:key2"
 */
(function () {
    'use strict';

    var LANGS = ['bn', 'en', 'bl'];
    var DEFAULT = 'bn';
    var STORE_KEY = 'mukto.lang';
    var HTML_LANG = { bn: 'bn', en: 'en', bl: 'bn-Latn' };
    var current = DEFAULT;

    function safeGet() {
        try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
    }
    function safeSet(v) {
        try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode */ }
    }
    function valid(l) { return LANGS.indexOf(l) !== -1; }

    function readInitial() {
        var q = new URLSearchParams(window.location.search).get('language');
        if (valid(q)) return q;
        var s = safeGet();
        if (valid(s)) return s;
        return DEFAULT;
    }

    /* ---------- i18n dictionary helpers ---------- */
    function dict() { return window.I18N || {}; }

    // Translate a key. For bn we fall back to the text cached from the HTML.
    function t(key, vars) {
        var entry = dict()[key];
        var out;
        if (entry && entry[current] != null) out = entry[current];
        else if (current === 'bn' && baseCache[key] != null) out = baseCache[key];
        else if (entry && entry.en != null) out = entry.en;
        else out = key;
        if (vars) {
            Object.keys(vars).forEach(function (k) {
                out = out.split('{' + k + '}').join(vars[k]);
            });
        }
        return out;
    }

    var baseCache = {};      // key -> original bn innerHTML
    var attrCache = {};      // key -> original bn attr value

    function cacheBase() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            if (!(k in baseCache)) baseCache[k] = el.innerHTML;
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var p = pair.split(':');
                if (p.length < 2) return;
                var a = p[0].trim(), k = p[1].trim();
                if (!(k in attrCache)) attrCache[k] = el.getAttribute(a) || '';
            });
        });
    }

    function applyDom() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var k = el.getAttribute('data-i18n');
            var entry = dict()[k];
            var val;
            if (current === 'bn') val = baseCache[k];
            else val = entry && entry[current] != null ? entry[current] : (entry && entry.en != null ? entry.en : baseCache[k]);
            if (val != null && el.innerHTML !== val) el.innerHTML = val;
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var p = pair.split(':');
                if (p.length < 2) return;
                var a = p[0].trim(), k = p[1].trim();
                var entry = dict()[k];
                var val;
                if (current === 'bn') val = attrCache[k];
                else val = entry && entry[current] != null ? entry[current] : (entry && entry.en != null ? entry.en : attrCache[k]);
                if (val != null) el.setAttribute(a, val);
            });
        });
    }

    /* ---------- page meta (title / description) ---------- */
    var metaData = null;
    function readMeta() {
        var el = document.getElementById('page-meta');
        if (!el) return;
        try { metaData = JSON.parse(el.textContent); } catch (e) { metaData = null; }
    }
    function applyMeta() {
        if (!metaData || !metaData[current]) return;
        var m = metaData[current];
        if (m.title) document.title = m.title;
        var d = document.querySelector('meta[name="description"]');
        if (d && m.description) d.setAttribute('content', m.description);
        var ot = document.querySelector('meta[property="og:title"]');
        if (ot && m.title) ot.setAttribute('content', m.title);
        var od = document.querySelector('meta[property="og:description"]');
        if (od && m.description) od.setAttribute('content', m.description);
    }

    /* ---------- internal links keep the language ---------- */
    function syncLinks() {
        document.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) return;
            var hashIdx = href.indexOf('#');
            var hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
            var path = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
            path = path.split('?')[0];
            if (!/\.html$|\/$/.test(path) && path !== '') return;
            var q = current === DEFAULT ? '' : '?language=' + current;
            a.setAttribute('href', path + q + hash);
        });
    }

    function updateUrl() {
        try {
            var url = new URL(window.location.href);
            if (current === DEFAULT) url.searchParams.delete('language');
            else url.searchParams.set('language', current);
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        } catch (e) { /* file:// or sandbox */ }
    }

    /* ---------- main setter ---------- */
    function set(lang, opts) {
        opts = opts || {};
        if (!valid(lang)) lang = DEFAULT;
        current = lang;

        var b = document.body;
        LANGS.forEach(function (l) { b.classList.toggle('lang-' + l, l === lang); });
        document.documentElement.setAttribute('lang', HTML_LANG[lang]);
        document.documentElement.setAttribute('data-lang', lang);

        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
            var on = btn.getAttribute('data-lang-btn') === lang;
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        applyDom();
        applyMeta();
        syncLinks();
        if (!opts.silent) {
            safeSet(lang);
            updateUrl();
        }
        document.dispatchEvent(new CustomEvent('mukto:langchange', { detail: { lang: lang } }));
    }

    function init() {
        readMeta();
        cacheBase();
        // Switcher buttons (works with [data-lang-btn="en"] and legacy onclick calls)
        document.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('[data-lang-btn]');
            if (!btn) return;
            e.preventDefault();
            set(btn.getAttribute('data-lang-btn'));
        });
        set(readInitial(), { silent: false });
    }

    window.MuktoLang = {
        get: function () { return current; },
        set: set,
        t: t
    };
    // Backwards compatible helper used by older inline handlers
    window.setLanguage = function (lang) { set(lang); };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

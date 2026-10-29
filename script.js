function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.innerHTML = `<svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

function setLanguage(lang, updateHistory = true) {
    if (!['en', 'bn', 'bl'].includes(lang)) {
        lang = 'bn';
    }
    document.body.className = 'lang-' + lang;

    const btnEn = document.getElementById('btnEn');
    const btnBn = document.getElementById('btnBn');
    const btnBl = document.getElementById('btnBl');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnBn) btnBn.classList.toggle('active', lang === 'bn');
    if (btnBl) btnBl.classList.toggle('active', lang === 'bl');

    const navBtnEn = document.getElementById('navBtnEn');
    const navBtnBn = document.getElementById('navBtnBn');
    const navBtnBl = document.getElementById('navBtnBl');
    if (navBtnEn) navBtnEn.classList.toggle('active', lang === 'en');
    if (navBtnBn) navBtnBn.classList.toggle('active', lang === 'bn');
    if (navBtnBl) navBtnBl.classList.toggle('active', lang === 'bl');

    if (updateHistory) {
        const url = new URL(window.location);
        if (lang === 'bn') {
            url.searchParams.delete('language');
        } else {
            url.searchParams.set('language', lang);
        }
        const cleanSearch = url.searchParams.toString();
        const cleanUrl = url.pathname + (cleanSearch ? '?' + cleanSearch : '') + url.hash;
        window.history.replaceState({}, '', cleanUrl);
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
        const question = el.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
    }
}

const transliterateDemos = [
    {
        steps: [
            { in: "a", out: "আ" },
            { in: "am", out: "আম" },
            { in: "ami", out: "আমি" },
            { in: "ami ", out: "আমি " },
            { in: "ami b", out: "আমি ব" },
            { in: "ami ba", out: "আমি বা" },
            { in: "ami bang", out: "আমি বাং" },
            { in: "ami bangl", out: "আমি বাংল" },
            { in: "ami bangla", out: "আমি বাংলা" },
            { in: "ami banglay", out: "আমি বাংলায়" },
            { in: "ami banglay ", out: "আমি বাংলায় " },
            { in: "ami banglay g", out: "আমি বাংলায় গ" },
            { in: "ami banglay ga", out: "আমি বাংলায় গা" },
            { in: "ami banglay gan", out: "আমি বাংলায় গান" },
            { in: "ami banglay gan ", out: "আমি বাংলায় গান " },
            { in: "ami banglay gan g", out: "আমি বাংলায় গান গ" },
            { in: "ami banglay gan ga", out: "আমি বাংলায় গান গা" },
            { in: "ami banglay gan gai", out: "আমি বাংলায় গান গাই" }
        ]
    },
    {
        steps: [
            { in: "t", out: "ত" },
            { in: "tO", out: "তো" },
            { in: "tOm", out: "তোম" },
            { in: "tOma", out: "তোমা" },
            { in: "tOmar", out: "তোমার" },
            { in: "tOmar ", out: "তোমার " },
            { in: "tOmar ch", out: "তোমার চ" },
            { in: "tOmar cho", out: "তোমার চ" },
            { in: "tOmar chok", out: "তোমার চক" },
            { in: "tOmar chokh", out: "তোমার চোখ" }
        ]
    },
    {
        steps: [
            { in: "s", out: "স" },
            { in: "sO", out: "সো" },
            { in: "sOn", out: "সোন" },
            { in: "sOna", out: "সোনা" },
            { in: "sOnar", out: "সোনার" },
            { in: "sOnar ", out: "সোনার " },
            { in: "sOnar b", out: "সোনার ব" },
            { in: "sOnar ba", out: "সোনার বা" },
            { in: "sOnar bang", out: "সোনার বাং" },
            { in: "sOnar bangl", out: "সোনার বাংল" },
            { in: "sOnar bangla", out: "সোনার বাংলা" }
        ]
    },
    {
        steps: [
            { in: "s", out: "স" },
            { in: "sh", out: "শ" },
            { in: "sho", out: "শ" },
            { in: "shob", out: "সব" },
            { in: "shoba", out: "সবা" },
            { in: "shobai", out: "সবাই" },
            { in: "shobai ", out: "সবাই " },
            { in: "shobai bh", out: "সবাই ভ" },
            { in: "shobai bha", out: "সবাই ভা" },
            { in: "shobai bhal", out: "সবাই ভাল" },
            { in: "shobai bhalO", out: "সবাই ভালো" }
        ]
    }
];

let currentDemoIdx = 0;
let currentStepIdx = 0;
let isErasing = false;

function runTypewriterTick() {
    const inEl = document.getElementById('tickerInputText');
    const outEl = document.getElementById('tickerOutputText');
    if (!inEl || !outEl) return;

    const demo = transliterateDemos[currentDemoIdx];
    const steps = demo.steps;

    if (!isErasing) {
        if (currentStepIdx < steps.length) {
            const currentStep = steps[currentStepIdx];
            inEl.textContent = currentStep.in;
            outEl.textContent = currentStep.out;
            currentStepIdx++;
            setTimeout(runTypewriterTick, 90);
        } else {
            setTimeout(() => {
                isErasing = true;
                runTypewriterTick();
            }, 2400);
        }
    } else {
        if (currentStepIdx > 0) {
            currentStepIdx--;
            if (currentStepIdx > 0) {
                const currentStep = steps[currentStepIdx - 1];
                inEl.textContent = currentStep.in;
                outEl.textContent = currentStep.out;
            } else {
                inEl.textContent = "";
                outEl.textContent = "";
            }
            setTimeout(runTypewriterTick, 35);
        } else {
            isErasing = false;
            currentStepIdx = 0;
            currentDemoIdx = (currentDemoIdx + 1) % transliterateDemos.length;
            setTimeout(runTypewriterTick, 400);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('language') || 'bn';
    if (!['en', 'bn', 'bl'].includes(lang)) {
        lang = 'bn';
    }
    setLanguage(lang, false);
    if (urlParams.has('language') && lang === 'bn') {
        const url = new URL(window.location);
        url.searchParams.delete('language');
        const cleanSearch = url.searchParams.toString();
        const cleanUrl = url.pathname + (cleanSearch ? '?' + cleanSearch : '') + url.hash;
        window.history.replaceState({}, '', cleanUrl);
    }

    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => toggleFaq(btn));
    });

    runTypewriterTick();

    window.addEventListener('scroll', function() {
        const btn = document.getElementById('backToTopBtn');
        if (!btn) return;
        if (window.scrollY > 350) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
});

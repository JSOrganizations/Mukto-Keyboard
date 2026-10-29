document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get("language") || "en";
    if (!["en", "bn", "bl"].includes(lang)) {
        lang = "en";
    }
    setLanguage(lang, false);

    window.addEventListener("scroll", function() {
        const btn = document.getElementById("backToTopBtn");
        if (!btn) return;
        if (window.scrollY > 350) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });
});

function setLanguage(lang, updateHistory = true) {
    document.body.className = "lang-" + lang;
    const btnEn = document.getElementById("btnEn");
    const btnBn = document.getElementById("btnBn");
    const btnBl = document.getElementById("btnBl");
    if (btnEn) btnEn.classList.toggle("active", lang === "en");
    if (btnBn) btnBn.classList.toggle("active", lang === "bn");
    if (btnBl) btnBl.classList.toggle("active", lang === "bl");

    if (updateHistory) {
        const url = new URL(window.location.href);
        url.searchParams.set("language", lang);
        window.history.replaceState({}, "", url);
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

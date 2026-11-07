// ============================
// DARK / LIGHT MODE
// ============================

const themeToggle = document.getElementById("themeToggle");

// Baca tema tersimpan (dibungkus try/catch supaya aman
// jika localStorage diblokir browser)
function getSavedTheme() {
    try {
        return localStorage.getItem("portfolioTheme");
    } catch (e) {
        return null;
    }
}

function saveTheme(value) {
    try {
        localStorage.setItem("portfolioTheme", value);
    } catch (e) {
        // abaikan jika tidak bisa menyimpan
    }
}

function applyTheme(isLight) {
    document.body.classList.toggle("light", isLight);
    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Ganti ke tema gelap" : "Ganti ke tema terang"
    );
}

// Terapkan tema saat website dibuka
applyTheme(getSavedTheme() === "light");

// Klik tombol tema
themeToggle.addEventListener("click", function () {
    const isLight = !document.body.classList.contains("light");
    applyTheme(isLight);
    saveTheme(isLight ? "light" : "dark");
});


// ============================
// MOBILE NAVIGATION
// ============================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

function setMenu(isOpen) {
    navMenu.classList.toggle("show", isOpen);
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
}

// Buka dan tutup menu
menuToggle.addEventListener("click", function () {
    setMenu(!navMenu.classList.contains("show"));
});

// Tutup menu setelah memilih halaman
document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});


// ============================
// EFEK MENGETIK (HERO)
// ============================

const typingElement = document.getElementById("typing");

const words = [
    "Editor",
    "Poster Designer",
    "UI/UX Designer",
    "Web Learner"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingElement.textContent = currentWord.substring(0, charIndex);

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        // Selesai mengetik, jeda sebentar lalu hapus
        delay = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Selesai menghapus, lanjut ke kata berikutnya
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
    }

    setTimeout(typeEffect, delay);
}

if (typingElement) {
    typeEffect();
}


// ============================
// TAHUN OTOMATIS (FOOTER)
// ============================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

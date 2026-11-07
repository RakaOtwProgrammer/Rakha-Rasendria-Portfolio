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


// ============================
// MUSIC PLAYER
// ============================

// GANTI judul dan nama file lagu di sini.
// Taruh file lagunya (mp3) di folder "music/" dengan nama yang sama.
const tracks = [
    { title: "The one we got away", file: "music/lagu-1.mp3" },
    { title: "About you", file: "music/lagu-2.mp3" },
    { title: "End of beginning", file: "music/lagu-3.mp3" },
    { title: "Don't look back in anger", file: "music/lagu-4.mp3" },
    { title: "IQRO'", file: "music/lagu-5.mp3" },
    { title: "Menari-narilah", file: "music/lagu-6.mp3" },
    { title: "Pada hati yang mana", file: "music/lagu-7.mp3" },
    { title: "Separuh aku", file: "music/lagu-8.mp3" },
    { title: "Sadrah", file: "music/lagu-9.mp3" },
    { title: "500 Miles", file: "music/lagu-10.mp3" }
];

const audio = document.getElementById("audio");

if (audio && tracks.length > 0) {

    const trackListEl = document.getElementById("trackList");
    const trackTitleEl = document.getElementById("trackTitle");
    const albumCoverEl = document.getElementById("albumCover");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const seekEl = document.getElementById("seek");
    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");
    const noteEl = document.getElementById("playerNote");

    let currentTrack = 0;

    function formatTime(seconds) {
        if (!isFinite(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + String(s).padStart(2, "0");
    }

    function updateSeekFill() {
        seekEl.style.setProperty("--p", seekEl.value + "%");
    }

    function showNote(message) {
        noteEl.textContent = message;
        noteEl.hidden = !message;
    }

    function setPlayingUI(isPlaying) {
        playBtn.classList.toggle("is-playing", isPlaying);
        playBtn.setAttribute("aria-label", isPlaying ? "Jeda" : "Putar");
        albumCoverEl.classList.toggle("playing", isPlaying);

        trackListEl.querySelectorAll("li").forEach(function (li, i) {
            li.classList.toggle("playing", isPlaying && i === currentTrack);
        });
    }

    function markActiveTrack() {
        trackListEl.querySelectorAll("li").forEach(function (li, i) {
            li.classList.toggle("active", i === currentTrack);
        });
        trackTitleEl.textContent = tracks[currentTrack].title;
    }

    function playAudio() {
        const result = audio.play();
        if (result && result.catch) {
            // Error file hilang ditangani oleh event "error" di bawah
            result.catch(function () {});
        }
    }

    function togglePlay() {
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    }

    function loadTrack(index, autoplay) {
        currentTrack = (index + tracks.length) % tracks.length;

        showNote("");
        audio.src = tracks[currentTrack].file;

        seekEl.value = 0;
        updateSeekFill();
        currentTimeEl.textContent = "0:00";
        durationEl.textContent = "0:00";

        markActiveTrack();
        setPlayingUI(false);

        if (autoplay) playAudio();
    }

    // Buat daftar lagu
    tracks.forEach(function (track, i) {
        const li = document.createElement("li");
        const btn = document.createElement("button");

        btn.type = "button";
        btn.className = "track-btn";
        btn.innerHTML =
            '<span class="track-num"></span>' +
            '<span class="track-name"></span>' +
            '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';

        btn.querySelector(".track-num").textContent = String(i + 1).padStart(2, "0");
        btn.querySelector(".track-name").textContent = track.title;

        btn.addEventListener("click", function () {
            if (i === currentTrack) {
                togglePlay();
            } else {
                loadTrack(i, true);
            }
        });

        li.appendChild(btn);
        trackListEl.appendChild(li);
    });

    // Tombol kontrol
    playBtn.addEventListener("click", togglePlay);

    nextBtn.addEventListener("click", function () {
        loadTrack(currentTrack + 1, true);
    });

    prevBtn.addEventListener("click", function () {
        // Kalau sudah lewat 3 detik, ulangi lagu ini dulu
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
        } else {
            loadTrack(currentTrack - 1, true);
        }
    });

    // Slider posisi lagu
    seekEl.addEventListener("input", function () {
        updateSeekFill();
        if (isFinite(audio.duration)) {
            audio.currentTime = (seekEl.value / 100) * audio.duration;
        }
    });

    // Event dari elemen audio
    audio.addEventListener("loadedmetadata", function () {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
        if (isFinite(audio.duration) && audio.duration > 0) {
            seekEl.value = (audio.currentTime / audio.duration) * 100;
            updateSeekFill();
        }
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("play", function () {
        setPlayingUI(true);
    });

    audio.addEventListener("pause", function () {
        setPlayingUI(false);
    });

    audio.addEventListener("ended", function () {
        if (currentTrack < tracks.length - 1) {
            loadTrack(currentTrack + 1, true);
        } else {
            // Lagu terakhir selesai: kembali ke awal dan berhenti
            audio.currentTime = 0;
            setPlayingUI(false);
        }
    });

    audio.addEventListener("error", function () {
        setPlayingUI(false);
        showNote(
            "File lagu belum ditemukan: " + tracks[currentTrack].file +
            ". Pastikan file sudah ada di folder music/ dan namanya sama persis."
        );
    });

    loadTrack(0, false);
}

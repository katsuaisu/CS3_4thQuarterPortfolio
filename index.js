/*
  index.js — Rei's Portfolio

  Jelly text system: from CodePen @mike-at-redspace
  https://codepen.io/mike-at-redspace
  Not my original work.
*/

// ============================================================
// BACKGROUND CANVAS — pastel rainbow + parallax swirls + stars
// ============================================================

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

// track scroll for parallax offset
let scrollY = 0;
window.addEventListener("scroll", () => { scrollY = window.scrollY; });

// resize canvas to match window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// pastel rainbow band colors, soft like the fabric photo
const RAINBOW_COLORS = [
    "rgba(255, 182, 193, 0.55)", // pink
    "rgba(255, 218, 160, 0.50)", // peach/yellow
    "rgba(180, 240, 200, 0.50)", // mint green
    "rgba(160, 220, 255, 0.50)", // sky blue
    "rgba(210, 180, 255, 0.50)", // lavender
    "rgba(255, 200, 220, 0.45)", // blush pink again
];

// draw the diagonal pastel rainbow stripes
function drawRainbow(offsetY) {
    const w = canvas.width;
    const h = canvas.height;
    const bandW = w / RAINBOW_COLORS.length;

    RAINBOW_COLORS.forEach((col, i) => {
        const grad = ctx.createLinearGradient(i * bandW, 0, (i + 1) * bandW, h);
        grad.addColorStop(0, col);
        grad.addColorStop(0.5, "rgba(255,255,255,0.85)");
        grad.addColorStop(1, col);
        ctx.fillStyle = grad;
        ctx.fillRect(i * bandW, 0, bandW, h);
    });
}

// --- swirls ---
// each swirl is a spiral drawn with arc segments
const SWIRL_DEFS = [
    { x: 0.12, y: 0.15, r: 38, col: "rgba(196,155,245,0.25)", speed: 0.0006, phase: 0 },
    { x: 0.78, y: 0.22, r: 28, col: "rgba(255,121,176,0.22)", speed: 0.0008, phase: 1.2 },
    { x: 0.30, y: 0.60, r: 50, col: "rgba(125,232,216,0.22)", speed: 0.0005, phase: 2.4 },
    { x: 0.88, y: 0.70, r: 35, col: "rgba(255,217,102,0.25)", speed: 0.0007, phase: 0.8 },
    { x: 0.55, y: 0.40, r: 22, col: "rgba(158,232,118,0.22)", speed: 0.0009, phase: 3.1 },
    { x: 0.20, y: 0.85, r: 42, col: "rgba(255,170,85,0.20)", speed: 0.0004, phase: 1.9 },
    { x: 0.65, y: 0.08, r: 30, col: "rgba(196,155,245,0.20)", speed: 0.0007, phase: 2.0 },
];

function drawSwirl(cx, cy, maxR, col, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    // draws an archimedean spiral: radius grows as angle increases
    const turns = 3;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * turns * Math.PI * 2;
        const r = (i / steps) * maxR;
        const px = Math.cos(t) * r;
        const py = Math.sin(t) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
}

// --- stars ---
// two kinds: little 4-point sparkles and small circles
const STARS = Array.from({ length: 55 }, (_, i) => ({
    x: Math.random(),         // normalized 0-1
    y: Math.random(),
    size: 2 + Math.random() * 5,
    col: ["#ffd966", "#ff79b0", "#7de8d8", "#c49bf5", "#9de876", "#ffaa55"][i % 6],
    speed: 0.0003 + Math.random() * 0.0006,
    phase: Math.random() * Math.PI * 2,
    type: Math.random() > 0.45 ? "sparkle" : "dot",
}));

function drawSparkle(cx, cy, r, col) {
    // 4-point star shape
    ctx.save();
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let p = 0; p < 4; p++) {
        const angle = (p / 4) * Math.PI * 2;
        const ir = r * 0.3;
        const ox = Math.cos(angle) * r;
        const oy = Math.sin(angle) * r;
        const ix = Math.cos(angle + Math.PI / 4) * ir;
        const iy = Math.sin(angle + Math.PI / 4) * ir;
        p === 0 ? ctx.moveTo(ox, oy) : ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// main draw loop
let t = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // solid base so the rainbow reads well
    ctx.fillStyle = "#fdf6ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRainbow(scrollY);

    const w = canvas.width;
    const h = canvas.height;

    // swirls — parallax: each layer moves at a slightly different rate
    SWIRL_DEFS.forEach((s, i) => {
        const parallaxFactor = 0.05 + i * 0.02; // layers 0-6 move at different depths
        const cx = s.x * w;
        const cy = s.y * h - scrollY * parallaxFactor;
        drawSwirl(cx, cy, s.r, s.col, s.phase + t * s.speed * 1000);
    });

    // stars — parallax too, slower than swirls
    STARS.forEach((s) => {
        const parallaxFactor = s.speed * 20;
        const cx = s.x * w;
        const cy = (s.y * h - scrollY * parallaxFactor) % h;
        const bob = Math.sin(t * s.speed * 2000 + s.phase) * 4; // gentle float

        ctx.globalAlpha = 0.55 + Math.sin(t * s.speed * 1500 + s.phase) * 0.2;

        if (s.type === "sparkle") {
            drawSparkle(cx, cy + bob, s.size, s.col);
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy + bob, s.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = s.col;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    });

    t = performance.now() / 1000;
    requestAnimationFrame(draw);
}
draw();


// ============================================================
// JELLY TEXT — from CodePen @mike-at-redspace
// https://codepen.io/mike-at-redspace
// ============================================================

const h1 = document.querySelector(".hero h1");
const root = document.documentElement;

// from CodePen @mike-at-redspace — physics params
const params = {
    duration: 0.9,
    stagger: 0.035,
    baseWght: 700,
    baseWdth: 85,
    squashX: 1.35,
    squashY: 0.65,
    squashDown: 12,
    stretchX: 0.75,
    stretchY: 1.35,
    stretchUp: -22,
    overshootX: 1.15,
    overshootY: 0.85,
    squashWght: 900,
    squashWdth: 80,
    stretchWght: 450,
    stretchWdth: 90,
};

// from CodePen @mike-at-redspace — pushes params to CSS vars
const updateCSS = () => {
    root.style.setProperty("--jelly-duration", `${params.duration}s`);
    root.style.setProperty("--stagger", `${params.stagger}s`);
    root.style.setProperty("--base-wght", params.baseWght);
    root.style.setProperty("--base-wdth", params.baseWdth);
    root.style.setProperty("--squash-scale-x", params.squashX);
    root.style.setProperty("--squash-scale-y", params.squashY);
    root.style.setProperty("--squash-ty", `${params.squashDown}%`);
    root.style.setProperty("--stretch-scale-x", params.stretchX);
    root.style.setProperty("--stretch-scale-y", params.stretchY);
    root.style.setProperty("--stretch-ty", `${params.stretchUp}%`);
    root.style.setProperty("--overshoot-scale-x", params.overshootX);
    root.style.setProperty("--overshoot-scale-y", params.overshootY);
    root.style.setProperty("--squash-wght", params.squashWght);
    root.style.setProperty("--squash-wdth", params.squashWdth);
    root.style.setProperty("--stretch-wght", params.stretchWght);
    root.style.setProperty("--stretch-wdth", params.stretchWdth);
};

// from CodePen @mike-at-redspace — candy color flavors per letter
const FLAVORS = [
    { c: "oklch(72% 0.42 12  / 0.65)", cs: "oklch(22% 0.20 12  / 0.3)" }, // Strawberry
    { c: "oklch(75% 0.40 138 / 0.65)", cs: "oklch(22% 0.18 138 / 0.3)" }, // Lime
    { c: "oklch(68% 0.42 308 / 0.65)", cs: "oklch(16% 0.18 308 / 0.3)" }, // Grape
    { c: "oklch(78% 0.36 60  / 0.65)", cs: "oklch(24% 0.15 60  / 0.3)" }, // Orange
    { c: "oklch(70% 0.38 232 / 0.65)", cs: "oklch(16% 0.15 232 / 0.3)" }, // Blue Razz
    { c: "oklch(72% 0.42 5   / 0.65)", cs: "oklch(18% 0.19 5   / 0.3)" }, // Cherry
    { c: "oklch(88% 0.30 100 / 0.65)", cs: "oklch(32% 0.13 100 / 0.3)" }, // Lemon
    { c: "oklch(70% 0.36 270 / 0.65)", cs: "oklch(18% 0.16 270 / 0.3)" }, // Blueberry
];

// from CodePen @mike-at-redspace — force reflow to restart CSS animation
const forceReflow = (el) => void el.offsetWidth;

let isAnimating = false;

// from CodePen @mike-at-redspace — whole-title jiggle
const playJiggle = () => {
    if (!h1 || isAnimating) return;
    isAnimating = true;

    h1.classList.remove("force-jelly");
    forceReflow(h1);
    h1.classList.add("force-jelly");

    const letters = h1.querySelectorAll(".letter");
    const lastLetter = letters[letters.length - 1];

    lastLetter.addEventListener("animationend", () => {
        h1.classList.remove("force-jelly");
        isAnimating = false;
    }, { once: true });
};

// from CodePen @mike-at-redspace — wraps each char in a colored span
const buildLetters = () => {
    if (!h1) return;

    const text = h1.textContent.trim();
    h1.setAttribute("aria-label", text);

    const fragment = document.createDocumentFragment();
    let flavorIndex = 0;

    Array.from(text).forEach((char, i) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.style.setProperty("--i", i);

        const isSpace = char === " ";
        span.dataset.char = isSpace ? "\u00A0" : char;
        span.textContent = isSpace ? "\u00A0" : char;

        if (!isSpace) {
            const flavor = FLAVORS[flavorIndex % FLAVORS.length];
            span.style.setProperty("--c", flavor.c);
            span.style.setProperty("--cs", flavor.cs);
            flavorIndex++;
        }

        fragment.appendChild(span);
    });

    h1.replaceChildren(fragment);

    // from CodePen @mike-at-redspace — per-letter hover & click jiggle
    const triggerLetter = (e, forceRestart = false) => {
        const letter = e.target.closest(".letter");
        if (!letter) return;
        if (!forceRestart && letter.classList.contains("is-jiggling")) return;

        letter.classList.remove("is-jiggling");
        forceReflow(letter);
        letter.classList.add("is-jiggling");

        letter.addEventListener("animationend", () => {
            letter.classList.remove("is-jiggling");
        }, { once: true });
    };

    h1.addEventListener("mouseenter", (e) => triggerLetter(e, false), true);
    h1.addEventListener("click", (e) => triggerLetter(e, true), true);
};

buildLetters();
updateCSS();
playJiggle();
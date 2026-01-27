// script.js

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function nowStamp() {
  const d = new Date();
  // zh-Hant readable timestamp
  return d.toLocaleString("zh-Hant", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// ---------- Mobile Nav ----------
const navToggle = $("#navToggle");
const mobileMenu = $("#mobileMenu");

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.display = "none";
  mobileMenu.setAttribute("aria-hidden", "true");
  navToggle?.setAttribute("aria-expanded", "false");
}

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.style.display = "block";
  mobileMenu.setAttribute("aria-hidden", "false");
  navToggle?.setAttribute("aria-expanded", "true");
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.getAttribute("aria-hidden") === "false";
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  // Close when clicking a link
  $$("#mobileMenu a").forEach((a) => {
    a.addEventListener("click", () => closeMobileMenu());
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const within =
      mobileMenu.contains(e.target) || navToggle.contains(e.target);
    if (!within) closeMobileMenu();
  });

  // Close on resize up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobileMenu();
  });
}

// ---------- Smooth Anchor Scroll (nice feel) ----------
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- Stats Counter Animation ----------
function animateCount(el, to, duration = 900) {
  const start = performance.now();
  const from = 0;

  function tick(t) {
    const p = clamp((t - start) / duration, 0, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + (to - from) * eased);
    el.textContent = String(val);

    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statNums = $$(".stat-num[data-count]");

// Only animate once when stats become visible
let statsAnimated = false;

// ---------- Reveal on Scroll ----------
const revealEls = $$(".reveal");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Trigger stats animation when hero stats are visible
        if (!statsAnimated && entry.target.classList.contains("hero")) {
          statsAnimated = true;
          statNums.forEach((el) => {
            const to = Number(el.getAttribute("data-count") || "0");
            animateCount(el, to);
          });
        }

        // Unobserve for performance
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

// Attach observer to section reveals
revealEls.forEach((el) => io.observe(el));

// Also observe hero container for stats animation if needed
const hero = $(".hero");
if (hero) io.observe(hero);

// Fallback if IO not supported
if (!("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
  statNums.forEach((el) => animateCount(el, Number(el.dataset.count || 0)));
}

// ---------- “System Status” faux telemetry ----------
const latencyEl = $("#latency");
const fpsEl = $("#fps");
const lastUpdateEl = $("#lastUpdate");
const statusTextEl = $("#statusText");

// Simulate telemetry changes
function updateTelemetry() {
  // realistic-ish ranges
  const latency = Math.round(18 + Math.random() * 38); // 18–56 ms
  const fps = (14 + Math.random() * 11).toFixed(1); // 14.0–25.0 fps

  if (latencyEl) latencyEl.textContent = String(latency);
  if (fpsEl) fpsEl.textContent = String(fps);
  if (lastUpdateEl) lastUpdateEl.textContent = nowStamp();

  // status flips rarely
  if (statusTextEl) {
    const r = Math.random();
    if (r < 0.03) statusTextEl.textContent = "degraded";
    else statusTextEl.textContent = "online";
  }
}

// Update immediately + every 1.2s
updateTelemetry();
setInterval(updateTelemetry, 1200);

// ---------- Video: Play/Pause Button ----------
const video = $("#demoVideo");
const videoToggle = $("#videoToggle");
const videoHint = $("#videoHint");

// Hide hint if mp4 exists (loadedmetadata fired)
if (video) {
  video.addEventListener("loadedmetadata", () => {
    if (videoHint) videoHint.style.display = "none";
  });

  video.addEventListener("error", () => {
    // Keep hint visible if video missing / cannot load
    if (videoHint) videoHint.style.display = "block";
  });

  // Keep button label synced
  const syncLabel = () => {
    if (!videoToggle) return;
    videoToggle.textContent = video.paused ? "▶ Play" : "❚❚ Pause";
  };

  video.addEventListener("play", syncLabel);
  video.addEventListener("pause", syncLabel);
  video.addEventListener("ended", syncLabel);

  if (videoToggle) {
    videoToggle.addEventListener("click", () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    });
    syncLabel();
  }
}

// ---------- Footer year ----------
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ---------- Optional: Close mobile menu on ESC ----------
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

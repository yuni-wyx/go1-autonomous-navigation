/* scripts.js — Go1 portfolio interactions (vanilla JS) */
(() => {
  "use strict";

  // -----------------------------
  // Helpers
  // -----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------------
  // Footer year
  // -----------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -----------------------------
  // Mobile nav toggle
  // -----------------------------
  const navToggle = $("#navToggle");
  const navLinks = $(".nav-links");

  const setNavOpen = (open) => {
    if (!navLinks || !navToggle) return;
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      setNavOpen(open);
    });

    // Close when clicking a link (mobile)
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setNavOpen(false);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const clickedInside =
        navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) setNavOpen(false);
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  // -----------------------------
  // Hero stats count-up (on view)
  // -----------------------------
  const statNums = $$(".stat-num[data-count]");
  const animateCount = (el, toValue) => {
    // If user prefers reduced motion, set instantly.
    if (prefersReducedMotion()) {
      el.textContent = formatStat(toValue);
      return;
    }

    const fromValue = 0;
    const duration = 1200; // ms
    const start = performance.now();

    const step = (t) => {
      const p = clamp((t - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      // Decide interpolation style based on target magnitude
      let current;
      if (toValue < 1) {
        current = fromValue + (toValue - fromValue) * eased;
      } else {
        current = Math.round(fromValue + (toValue - fromValue) * eased);
      }

      el.textContent = formatStat(current, toValue);

      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatStat(toValue);
    };

    requestAnimationFrame(step);
  };

  const formatStat = (v, target = v) => {
    // 0.93 -> 0.93 (2 decimals)
    // 5000 -> 5,000
    // 30 -> 30
    if (target < 1) return Number(v).toFixed(2);
    if (target >= 1000) return Number(v).toLocaleString();
    return String(Math.round(v));
  };

  const statsObserver = (() => {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(
      (entries, obs) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          const el = ent.target;
          const to = Number(el.getAttribute("data-count"));
          animateCount(el, to);
          obs.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );
  })();

  if (statNums.length) {
    if (statsObserver) statNums.forEach((el) => statsObserver.observe(el));
    else {
      // Fallback: run immediately
      statNums.forEach((el) => {
        const to = Number(el.getAttribute("data-count"));
        el.textContent = formatStat(to);
      });
    }
  }

  // -----------------------------
  // Live telemetry meters (SIM)
  // -----------------------------
  const m1 = $("#m1");
  const m2 = $("#m2");
  const m3 = $("#m3");
  const m1v = $("#m1v");
  const m2v = $("#m2v");
  const m3v = $("#m3v");

  const setMeter = (fillEl, textEl, pct) => {
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (textEl) textEl.textContent = `${Math.round(pct)}%`;
  };

  // Seed values (match your initial text roughly)
  let v1 = 72,
    v2 = 18,
    v3 = 88;

  // Initialize immediately
  setMeter(m1, m1v, v1);
  setMeter(m2, m2v, v2);
  setMeter(m3, m3v, v3);

  // Smooth random walk
  const tickTelemetry = () => {
    if (prefersReducedMotion()) return; // keep stable if reduced motion

    v1 = clamp(v1 + (Math.random() * 8 - 4), 45, 95); // traversability
    v2 = clamp(v2 + (Math.random() * 6 - 3), 5, 60); // risk
    v3 = clamp(v3 + (Math.random() * 6 - 3), 55, 98); // stability

    setMeter(m1, m1v, v1);
    setMeter(m2, m2v, v2);
    setMeter(m3, m3v, v3);
  };

  // Only run if those elements exist
  let telemetryTimer = null;
  if (m1 && m2 && m3) {
    telemetryTimer = window.setInterval(tickTelemetry, 900);
  }

  // Terminal blinking underscore (already dim line)
  const blinkEl = $("#terminalBlink");
  if (blinkEl && !prefersReducedMotion()) {
    window.setInterval(() => {
      blinkEl.style.opacity =
        blinkEl.style.opacity === "0" ? "1" : "0";
    }, 550);
  }

  // -----------------------------
  // Results metrics (optional: keep consistent)
  // -----------------------------
  // If you later want to drive these from one place, adjust here.
  const accText = $("#accText");
  const latText = $("#latText");
  const fpsText = $("#fpsText");

  if (accText && accText.textContent.trim() === "") accText.textContent = "0.93";
  if (latText && latText.textContent.trim() === "") latText.textContent = "33ms";
  if (fpsText && fpsText.textContent.trim() === "") fpsText.textContent = "30 FPS";

  // -----------------------------
  // Media switcher: local mp4 vs YouTube
  // -----------------------------
  const mediaBody = document.getElementById("mediaBody");
  const useLocalBtn = document.getElementById("useLocal");
  const useYTBtn = document.getElementById("useYT");

  // Default assets path (per your footer tip)
  const LOCAL_SRC = "assets/go1-walk.mp4";

  // Put your YouTube embed URL here (replace VIDEO_ID)
  // Example: https://www.youtube.com/embed/dQw4w9WgXcQ
  const YT_EMBED = "https://www.youtube.com/embed/VIDEO_ID";

  const renderLocal = () => {
    if (!mediaBody) return;
    mediaBody.innerHTML = `
      <div class="video-wrap">
        <video controls playsinline preload="metadata" style="width:100%; border-radius:12px;">
          <source src="${LOCAL_SRC}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    setActiveMediaButton?.("local");
  };

  const renderYT = () => {
    if (!mediaBody) return;
    mediaBody.innerHTML = `
      <div class="video-wrap">
        <iframe
          src="${YT_EMBED}"
          title="Go1 Walking Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    `;
    setActiveMediaButton("yt");
  };

  const setActiveMediaButton = (mode) => {
    // subtle state: use aria-pressed so it’s accessible without changing CSS
    if (useLocalBtn) useLocalBtn.setAttribute("aria-pressed", mode === "local" ? "true" : "false");
    if (useYTBtn) useYTBtn.setAttribute("aria-pressed", mode === "yt" ? "true" : "false");
  };

  // Default render: local if exists, else YouTube (best-effort)
  const defaultRender = () => {
    // If reduced motion, still fine — this is not animation.
    renderLocal();
  };

  if (mediaBody) defaultRender();

  if (useLocalBtn) useLocalBtn.addEventListener("click", renderLocal);
  if (useYTBtn) useYTBtn.addEventListener("click", renderYT);

  // -----------------------------
  // Optional: highlight nav link on scroll (lightweight)
  // -----------------------------
  const sections = ["overview", "pipeline", "results", "media"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navAnchors = $$(".nav-links a").filter((a) => a.getAttribute("href")?.startsWith("#"));

  const setActiveNav = (id) => {
    navAnchors.forEach((a) => {
      const active = a.getAttribute("href") === `#${id}`;
      a.style.color = active ? "rgba(255,255,255,0.92)" : "";
    });
  };

  const navObserver = (() => {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveNav(visible.target.id);
      },
      { root: null, threshold: [0.25, 0.4, 0.6] }
    );
  })();

  if (navObserver) sections.forEach((s) => navObserver.observe(s));
})();

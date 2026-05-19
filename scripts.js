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
  // Overview research map
  // -----------------------------
  const overviewTabs = $$('[data-overview-pane]');
  const overviewPanelBits = {
    label: $('#overviewPanelLabel'),
    badge: $('#overviewPanelBadge'),
    kicker: $('#overviewPanelKicker'),
    lead: $('#overviewPanelLead'),
    question: $('#overviewQuestion'),
    inputs: $('#overviewInputs'),
    outputs: $('#overviewOutputs'),
    reality: $('#overviewReality'),
    tags: $('#overviewTags'),
    terminal: $('#overviewTerminal'),
    link: $('#overviewLink')
  };

  const overviewCopy = {
    motion: {
      label: 'IMITATION LEARNING NAVIGATION',
      badge: 'STUDY 1',
      kicker: 'Motion Layer',
      lead: 'The earlier study focuses on real-time learned motion behavior on Go1.',
      question: 'How does Go1 learn to move?',
      inputs: 'Front-camera imagery and demonstration data',
      outputs: 'Real-time motion behavior',
      reality: 'Deployed controller on Go1',
      tags: ['Traversability', 'Obstacle Risk', 'Stability'],
      terminal: [
        ['focus', 'low-level motion and reactive safety'],
        ['question', 'whether a learned controller can run online on the robot'],
        ['next', 'see how the project changed once people entered the scene']
      ],
      linkHref: 'imitation-learning.html',
      linkText: 'Imitation Learning →'
    },
    social: {
      label: 'VLM SOCIAL NAVIGATION',
      badge: 'STUDY 2',
      kicker: 'Social Decision Layer',
      lead: 'The later study treats person-dependent navigation as a semantic decision problem.',
      question: 'How should Go1 behave around people?',
      inputs: 'Extracted frame sequences from curated Go1 bags',
      outputs: 'STOP / FORWARD / LEFT / RIGHT / REVIEW',
      reality: 'Offline benchmark on 13 curated bags',
      tags: ['13 Bags', '0.60 Consensus', '10 / 5 Sequence Setting'],
      terminal: [
        ['focus', 'decision labels for crossings, yielding, and ambiguity'],
        ['evidence', 'primary bag-level consensus accuracy 0.60 in the saved run'],
        ['boundary', 'high-level study, not raw online VLM control']
      ],
      linkHref: 'vlm-social-navigation.html',
      linkText: 'VLM Social Navigation →'
    },
    boundary: {
      label: 'FAST CONTROLLER + SLOWER SEMANTIC LAYER',
      badge: 'SYSTEM VIEW',
      kicker: 'System Boundary',
      lead: 'The two studies connect through a split architecture rather than one end-to-end policy.',
      question: 'How do the two studies connect?',
      inputs: 'Reactive controller plus semantic decision hints',
      outputs: 'Safety-projected high-level guidance',
      reality: 'Fast motion below, slower reasoning above',
      tags: ['Safety Projection', 'Advisory Layer', 'Local Safety'],
      terminal: [
        ['fast loop', 'motion execution and local safety stay with the controller'],
        ['slow loop', 'the VLM layer contributes semantic guidance'],
        ['boundary', 'raw high-level output does not directly drive motors']
      ],
      linkHref: 'vlm-social-navigation.html#deployment',
      linkText: 'Deployment Boundary →'
    }
  };

  const setOverviewPane = (pane) => {
    const cfg = overviewCopy[pane];
    if (!cfg || !overviewPanelBits.label) return;

    overviewTabs.forEach((btn) => {
      const active = btn.getAttribute('data-overview-pane') === pane;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    overviewPanelBits.label.textContent = cfg.label;
    overviewPanelBits.badge.textContent = cfg.badge;
    overviewPanelBits.kicker.textContent = cfg.kicker;
    overviewPanelBits.lead.textContent = cfg.lead;
    overviewPanelBits.question.textContent = cfg.question;
    overviewPanelBits.inputs.textContent = cfg.inputs;
    overviewPanelBits.outputs.textContent = cfg.outputs;
    overviewPanelBits.reality.textContent = cfg.reality;
    overviewPanelBits.tags.innerHTML = cfg.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
    overviewPanelBits.terminal.innerHTML = cfg.terminal.map(([k,v]) => `<div class="terminal-line"><span class="k">${k}</span> ${v}</div>`).join('');
    overviewPanelBits.link.setAttribute('href', cfg.linkHref);
    overviewPanelBits.link.textContent = cfg.linkText;
  };

  if (overviewTabs.length && overviewPanelBits.label) {
    overviewTabs.forEach((btn) => {
      btn.addEventListener('click', () => setOverviewPane(btn.getAttribute('data-overview-pane')));
    });
    const initialPane = overviewTabs.find((btn) => btn.classList.contains('active'))?.getAttribute('data-overview-pane') || 'motion';
    setOverviewPane(initialPane);
  }

  // -----------------------------
  // Note view markdown wrapper
  // -----------------------------
  const noteContent = $("#noteContent");
  if (noteContent) {
    const params = new URLSearchParams(window.location.search);
    const doc = params.get("doc");
    const title = params.get("title") || "Research Notes";
    const subtitle = params.get("subtitle") || "Supporting detail page";
    const summary = params.get("summary") || "Source note rendered from the project documentation.";
    const parent = params.get("parent") || "Overview";
    const parentHref = params.get("parentHref") || "index.html";
    const focus = params.get("focus");

    const isVlmNote =
      parent === "VLM Social Navigation" ||
      (doc && (
        doc.includes("vlm_social_navigation") ||
        doc.includes("future_work") ||
        (focus && (
          focus.includes("benchmark") ||
          focus.includes("vlm") ||
          focus.includes("what-the-vlm-capstone-proposes")
        ))
      ));

    if (isVlmNote) {
      document.body.classList.add("theme-vlm");
    }

    const noteTitle = $("#noteTitle");
    const noteCrumbCurrent = $("#noteCrumbCurrent");
    const noteSubtitle = $("#noteSubtitle");
    const noteSummary = $("#noteSummary");
    const noteParentLink = $("#noteParentLink");
    const noteBackStudy = $("#noteBackStudy");
    const noteSourceLine = $("#noteSourceLine");

    if (noteTitle) noteTitle.textContent = title;
    if (noteCrumbCurrent) noteCrumbCurrent.textContent = title;
    if (noteSubtitle) noteSubtitle.textContent = subtitle;
    if (noteSummary) noteSummary.textContent = summary;
    if (noteParentLink) {
      noteParentLink.textContent = parent;
      noteParentLink.setAttribute("href", parentHref);
    }
    if (noteBackStudy) {
      noteBackStudy.textContent = `Back to ${parent}`;
      noteBackStudy.setAttribute("href", parentHref);
    }
    if (noteSourceLine) noteSourceLine.textContent = "Source note rendered from the project documentation.";
    if (doc) document.title = `${title} | Go1`;

    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const escapeHtml = (s) => s.replace(/[&<>]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
    const inline = (s) => s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    const renderMarkdown = (md) => {
      const lines = md.replace(/\r\n/g, "\n").split("\n");
      let html = "";
      let inList = false;
      let inCode = false;
      let codeLines = [];
      let para = [];

      const flushPara = () => {
        if (!para.length) return;
        html += `<p>${inline(para.join(" "))}</p>`;
        para = [];
      };
      const flushList = () => {
        if (!inList) return;
        html += "</ul>";
        inList = false;
      };
      const flushCode = () => {
        if (!inCode) return;
        html += `<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`;
        inCode = false;
        codeLines = [];
      };

      for (const line of lines) {
        if (line.startsWith("```")) {
          flushPara();
          flushList();
          if (inCode) flushCode();
          else inCode = true;
          continue;
        }
        if (inCode) {
          codeLines.push(line);
          continue;
        }
        if (!line.trim()) {
          flushPara();
          flushList();
          continue;
        }
        if (line.trim() === "---") {
          flushPara();
          flushList();
          html += "<hr />";
          continue;
        }
        const h = line.match(/^(#{1,3})\s+(.*)$/);
        if (h) {
          flushPara();
          flushList();
          const level = h[1].length;
          const text = h[2].trim();
          const id = slugify(text);
          const focusClass = focus && focus === id ? ' class="focus-heading"' : "";
          html += `<h${level} id="${id}"${focusClass}>${inline(text)}</h${level}>`;
          continue;
        }
        const li = line.match(/^[-*]\s+(.*)$/);
        if (li) {
          flushPara();
          if (!inList) {
            html += "<ul>";
            inList = true;
          }
          html += `<li>${inline(li[1])}</li>`;
          continue;
        }
        para.push(line.trim());
      }

      flushPara();
      flushList();
      flushCode();
      return html;
    };

    if (!doc) {
      noteContent.innerHTML = "<p>Missing note source.</p>";
    } else {
      fetch(doc)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${doc}`);
          return res.text();
        })
        .then((md) => {
          noteContent.innerHTML = renderMarkdown(md);
          if (focus) {
            const el = document.getElementById(focus);
            if (el) el.scrollIntoView({ block: "start" });
          }
        })
        .catch(() => {
          noteContent.innerHTML = "<p>Unable to load the note content.</p>";
        });
    }
  }

  // -----------------------------
  // VLM action-space explainer
  // -----------------------------
  const socialButtons = $$('[data-social-action]');
  const decisionExplainer = $('#decisionExplainer');

  const socialActionCopy = {
    STOP: {
      meaning: 'Yield or pause when a person is directly ahead or approaching.',
      typical: 'Approaching or directly blocked person.',
      why: 'Keeps the policy conservative in socially occupied space.',
      boundary: 'High-level decision only, not a direct brake command.'
    },
    FORWARD: {
      meaning: 'Continue when the path is socially clear.',
      typical: 'Empty path or receding person with reopened corridor.',
      why: 'Avoids stopping just because a person is still faintly visible.',
      boundary: 'Still depends on the lower motion stack for safe execution.'
    },
    LEFT: {
      meaning: 'High-level side preference toward the left.',
      typical: 'Crossing or occupied scene where the left side is the better social option.',
      why: 'Lets the policy express lateral intent instead of collapsing to stop/go.',
      boundary: 'Not a raw motor command and still needs safety projection.'
    },
    RIGHT: {
      meaning: 'High-level side preference toward the right.',
      typical: 'Crossing or occupied scene where the right side is the better social option.',
      why: 'Makes directional avoidance explicit at the decision level.',
      boundary: 'Not a raw motor command and still needs safety projection.'
    },
    REVIEW: {
      meaning: 'Uncertainty interface for ambiguous scenes.',
      typical: 'Ambiguous crossing, late entry, or unclear person intent.',
      why: 'Avoids forcing a confident label when the scene is not clear enough.',
      boundary: 'Should not be read as failure by itself.'
    }
  };

  const setSocialAction = (action) => {
    socialButtons.forEach((btn) => {
      const active = btn.getAttribute('data-social-action') === action;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (decisionExplainer) {
      decisionExplainer.innerHTML = `
        <div class="decision-explainer-title">${action}</div>
        <p><strong>Meaning:</strong> ${socialActionCopy[action]?.meaning || ''}</p>
        <p><strong>Typical situation:</strong> ${socialActionCopy[action]?.typical || ''}</p>
        <p><strong>Why it exists:</strong> ${socialActionCopy[action]?.why || ''}</p>
        <p><strong>Deployment note:</strong> ${socialActionCopy[action]?.boundary || ''}</p>
      `;
    }
  };

  if (socialButtons.length && decisionExplainer) {
    socialButtons.forEach((btn) => {
      btn.addEventListener('click', () => setSocialAction(btn.getAttribute('data-social-action')));
    });
    const initial = socialButtons.find((btn) => btn.classList.contains('active'))?.getAttribute('data-social-action') || 'STOP';
    setSocialAction(initial);
  }

  // -----------------------------
  // Optional: highlight nav link on scroll (lightweight)
  // -----------------------------
  const sections = ["overview", "timeline", "results", "deployment", "media"]
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

(function () {
  "use strict";

  /* ==========================================================================
     DARK MODE
     ========================================================================== */
  const themeBtn = document.getElementById("themeBtn");
  const htmlEl   = document.documentElement;

  if (localStorage.getItem("theme") === "dark") htmlEl.classList.add("dark");

  themeBtn?.addEventListener("click", () => {
    const isDark = htmlEl.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ==========================================================================
     NAVBAR
     ========================================================================== */
  const navbar      = document.getElementById("navbar");
  const hamburger   = document.getElementById("hamburger");
  const navMenu     = document.getElementById("navMenu");
  const navOverlay  = document.getElementById("navOverlay");
  const navCloseBtn = document.getElementById("navCloseBtn");
  const navLinks    = document.querySelectorAll(".nav-link");
  const sections    = document.querySelectorAll("section[id]");

  const openMenu = () => {
    hamburger.classList.add("open");
    navMenu.classList.add("open");
    navOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
    navOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  hamburger?.addEventListener("click", openMenu);
  navOverlay?.addEventListener("click", closeMenu);
  navCloseBtn?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  navLinks.forEach(l => l.addEventListener("click", closeMenu));

  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);

    let current = "";
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.4 && r.bottom >= window.innerHeight * 0.4) {
        current = sec.id;
      }
    });
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ==========================================================================
     SCROLL REVEAL  — staggered, direction-aware
     ========================================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  // Slightly different thresholds per element type for a more organic feel
  const makeRevealObserver = (threshold) =>
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    }, { threshold, rootMargin: "0px 0px -40px 0px" });

  const revealObserverDefault = makeRevealObserver(0.12);
  const revealObserverCards   = makeRevealObserver(0.08);   // cards trigger earlier

  revealEls.forEach(el => {
    const isCard =
      el.classList.contains("service-card")  ||
      el.classList.contains("hl-card")       ||
      el.classList.contains("testi-card")    ||
      el.classList.contains("project-card")  ||
      el.classList.contains("timeline-card") ||
      el.classList.contains("skill-card");

    (isCard ? revealObserverCards : revealObserverDefault).observe(el);
  });

  /* ==========================================================================
     SKILL BARS
     ========================================================================== */
  const skillBars = document.querySelectorAll(".skill-bar");

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill  = entry.target.querySelector(".sb-fill");
      const value = entry.target.getAttribute("data-value");
      if (fill && value) setTimeout(() => { fill.style.width = value + "%"; }, 200);
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  skillBars.forEach(b => barObserver.observe(b));

  /* ==========================================================================
     SOFT SKILL CIRCLES  (SVG stroke-dashoffset)
     The SVG is scaled by CSS (76 → 64 → 58 → 54px). The viewBox is always
     80×80 with r=32 in SVG units, so circumference in SVG units is always
     2 * π * 32 ≈ 201.06. We apply stroke-dasharray in SVG units and let
     the browser scale the stroke visually — no need to recalculate per
     breakpoint. The CSS overrides at narrow breakpoints are only for the
     CSS stroke-dasharray initial value before JS fires.
     ========================================================================== */
  const SVG_CIRC = 2 * Math.PI * 32; // 201.06 — matches r="32" in viewBox

  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el      = entry.target;
      const value   = parseInt(el.getAttribute("data-value"), 10);
      const fill    = el.querySelector(".ssc-fill");
      const pctText = el.querySelector(".ssc-percent");

      if (fill) {
        // Always set dasharray to SVG-unit circumference (viewBox coords)
        fill.style.strokeDasharray  = SVG_CIRC;
        fill.style.strokeDashoffset = SVG_CIRC;
        setTimeout(() => {
          fill.style.strokeDashoffset = SVG_CIRC * (1 - value / 100);
        }, 250);
      }

      if (pctText) {
        let cur  = 0;
        const step = value / 60;
        const tick = () => {
          cur += step;
          if (cur >= value) { pctText.textContent = value + "%"; return; }
          pctText.textContent = Math.floor(cur) + "%";
          requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 250);
      }

      circleObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll(".soft-skill-circle").forEach(el => circleObserver.observe(el));

  /* ==========================================================================
     ANIMATED COUNTERS
     ========================================================================== */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute("data-target"), 10);
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + "+"; return; }
        el.textContent = Math.floor(cur) + "+";
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".counter").forEach(c => countObserver.observe(c));

  /* ==========================================================================
     PORTFOLIO TAB FILTERING
     ========================================================================== */
  const tabs        = document.querySelectorAll(".ptab");
  const projRows    = document.querySelectorAll(".project-row[data-category]");
  const projCards   = document.querySelectorAll(".project-card[data-category]");
  const gridEl      = document.getElementById("projectsGrid");
  const featuredEl  = document.getElementById("projectsFeatured");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      projRows.forEach(row => {
        const match = filter === "all" || row.getAttribute("data-category") === filter;
        row.classList.toggle("hidden", !match);
        if (match) { row.classList.remove("active"); setTimeout(() => row.classList.add("active"), 50); }
      });

      projCards.forEach(card => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hidden", !match);
        if (match) { card.classList.remove("active"); setTimeout(() => card.classList.add("active"), 120); }
      });

      if (gridEl)     gridEl.style.display     = document.querySelectorAll(".project-card:not(.hidden)").length  ? "grid"  : "none";
      if (featuredEl) featuredEl.style.display  = document.querySelectorAll(".project-row:not(.hidden)").length   ? "block" : "none";
    });
  });

  /* ==========================================================================
     SERVICES MODAL
     ========================================================================== */
  const serviceData = {
    web: {
      title: "Web Development",
      img:   "imgs/web-dev.png",
      desc:  "I build fast, scalable, and modern websites using the latest web technologies and best practices.",
      items: ["Responsive, mobile-first layouts", "Clean HTML5, CSS3 & JavaScript", "SEO-optimized architecture", "API & third-party integrations"]
    },
    uiux: {
      title: "UI / UX Design",
      img:   "imgs/uiux.png",
      desc:  "User-centered designs that are both visually stunning and intuitive to navigate.",
      items: ["In-depth user research", "Wireframes & prototypes", "Design systems in Figma", "Usability testing & iteration"]
    },
    graphic: {
      title: "Graphic Design",
      img:   "imgs/graphic.png",
      desc:  "Visual branding and creative design solutions that make your business unforgettable.",
      items: ["Logo & brand identity", "Marketing creatives", "Social media assets", "Print & digital collateral"]
    },
    seo: {
      title: "SEO Optimization",
      img:   "imgs/seo.png",
      desc:  "Strategic SEO to boost your search visibility, drive organic traffic, and grow your online presence.",
      items: ["Keyword research & strategy", "On-page optimization", "Technical SEO audits", "Content optimization"]
    }
  };

  const modalBackdrop = document.getElementById("serviceModal");
  const modalClose    = document.getElementById("modalClose");
  const modalImg      = document.getElementById("modalImg");
  const modalTitle    = document.getElementById("modalTitle");
  const modalDesc     = document.getElementById("modalDesc");
  const modalList     = document.getElementById("modalList");

  const openModal = key => {
    const d = serviceData[key];
    if (!d) return;
    modalImg.src           = d.img;
    modalImg.alt           = d.title;
    modalTitle.textContent = d.title;
    modalDesc.textContent  = d.desc;
    modalList.innerHTML    = d.items.map(i => `<li><i class="fa-solid fa-circle-check"></i>${i}</li>`).join("");
    modalBackdrop.classList.add("active");
    document.body.classList.add("no-scroll");
    modalBackdrop.querySelector(".modal-card").scrollTop = 0;
  };

  const closeModal = () => {
    modalBackdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  document.querySelectorAll(".service-card").forEach(card => {
    card.querySelector(".sc-btn")?.addEventListener("click", () => openModal(card.dataset.service));
  });
  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", e => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ==========================================================================
     SCROLL TO TOP
     ========================================================================== */
  const scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", () => {
    scrollTopBtn?.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
  scrollTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ==========================================================================
     CONTACT FORM — validation + EmailJS
     ========================================================================== */
  emailjs.init("5IkvlnetHiJWb9jGd");

  const contactForm = document.getElementById("contactForm");
  const sendBtn     = document.getElementById("sendBtn");
  const toast       = document.getElementById("toast");
  const toastTitle  = document.getElementById("toastTitle");
  const toastMsg    = document.getElementById("toastMsg");
  const toastIcon   = document.getElementById("toastIcon");
  const toastProg   = document.getElementById("toastProgress");

  const showToast = (title, message, isError = false) => {
    if (toastProg) { toastProg.style.animation = "none"; void toastProg.offsetWidth; toastProg.style.animation = ""; }
    toast.classList.toggle("toast--error", isError);
    if (toastIcon) toastIcon.className = isError ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-check";
    toastTitle.textContent = title;
    toastMsg.innerHTML     = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4800);
  };

  const getField = id => document.getElementById(id);

  const setError = (input, msg) => {
    input.classList.add("input--error");
    input.classList.remove("input--valid");
    input.parentElement.querySelector(".field-error")?.remove();
    const err = document.createElement("span");
    err.className = "field-error";
    err.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${msg}`;
    input.parentElement.appendChild(err);
  };

  const clearError = input => {
    input.classList.remove("input--error");
    input.parentElement.querySelector(".field-error")?.remove();
  };

  const setValid = input => { clearError(input); input.classList.add("input--valid"); };
  const isEmail  = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateForm = () => {
    const n = getField("user_name"), e = getField("user_email"), m = getField("message");
    let ok = true;
    if (!n.value.trim())                              { setError(n, "Please enter your full name."); ok = false; } else setValid(n);
    if (!e.value.trim())                              { setError(e, "Please enter your email address."); ok = false; }
    else if (!isEmail(e.value.trim()))                { setError(e, "Please enter a valid email address."); ok = false; }
    else                                                setValid(e);
    if (!m.value.trim())                              { setError(m, "Please write a message before sending."); ok = false; }
    else if (m.value.trim().length < 10)              { setError(m, "Message is too short (min 10 characters)."); ok = false; }
    else                                                setValid(m);
    return ok;
  };

  ["user_name", "user_email", "message"].forEach(id => {
    const el = getField(id);
    if (!el) return;
    el.addEventListener("input",  () => { if (el.classList.contains("input--error")) clearError(el); });
    el.addEventListener("blur",   () => {
      if (id === "user_name"  && el.value.trim())                 setValid(el);
      if (id === "user_email" && isEmail(el.value.trim()))        setValid(el);
      if (id === "message"    && el.value.trim().length >= 10)    setValid(el);
    });
  });

  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) {
      sendBtn.style.animation = "none";
      void sendBtn.offsetWidth;
      sendBtn.style.animation = "btnShake 0.4s ease";
      return;
    }
    const name  = contactForm.user_name.value.trim();
    const email = contactForm.user_email.value.trim();
    const bt    = sendBtn.querySelector(".btn-text");
    const bi    = sendBtn.querySelector("i");
    sendBtn.disabled = true;
    bt.textContent   = "Sending…";
    bi.className     = "fa-solid fa-spinner fa-spin";

    emailjs.sendForm("service_xw7noct", "template_tgke9ss", contactForm)
      .then(() => {
        showToast("Message Sent!", `Thanks <strong>${name}</strong>! We'll reply to <strong>${email}</strong> soon.`);
        contactForm.reset();
        ["user_name","user_email","message"].forEach(id => {
          const el = getField(id);
          if (el) el.classList.remove("input--valid","input--error");
        });
      })
      .catch(() => showToast("Failed to Send", "Something went wrong. Please try again or email directly.", true))
      .finally(() => { sendBtn.disabled = false; bt.textContent = "Send Message"; bi.className = "fa-solid fa-paper-plane"; });
  });

  /* ==========================================================================
     MARQUEE — pause on hover
     ========================================================================== */
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    marqueeTrack.addEventListener("mouseenter", () => marqueeTrack.style.animationPlayState = "paused");
    marqueeTrack.addEventListener("mouseleave", () => marqueeTrack.style.animationPlayState = "running");
  }

})();

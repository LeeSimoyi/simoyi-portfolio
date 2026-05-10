/* ==========================================================================
   SIMOYI LEE — PORTFOLIO JAVASCRIPT
   Organized into clear modules for easy reading and maintenance
   ========================================================================== */

(function () {
  "use strict";

  /* ==========================================================================
     1. PAGE LOADER
     ========================================================================== */
  const loader = document.getElementById("pageLoader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("hidden");
    }, 2000);
  });

  /* ==========================================================================
     2. DARK MODE TOGGLE
     ========================================================================== */
  const themeBtn = document.getElementById("themeBtn");
  const htmlEl   = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    htmlEl.classList.add("dark");
  }

  themeBtn?.addEventListener("click", () => {
    const isDark = htmlEl.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ==========================================================================
     3. NAVBAR
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));

  const handleScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);

    let current = "";
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     4. CUSTOM CURSOR
     ========================================================================== */
  const cursor         = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursorFollower");
  let followerX = 0, followerY = 0;
  let cursorX   = 0, cursorY   = 0;

  const animateCursor = () => {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;

    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top  = `${cursorY}px`;
    }
    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top  = `${followerY}px`;
    }

    requestAnimationFrame(animateCursor);
  };

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  const hoverTargets = document.querySelectorAll("a, button, [data-service]");
  hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => cursorFollower?.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorFollower?.classList.remove("hover"));
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    animateCursor();
  }

  /* ==========================================================================
     5. SCROLL REVEAL
     ========================================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. SKILL BARS
     ========================================================================== */
  const skillBars = document.querySelectorAll(".skill-bar");

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target.querySelector(".sb-fill");
        const value = entry.target.getAttribute("data-value");
        if (fill && value) {
          setTimeout(() => { fill.style.width = value + "%"; }, 150);
        }
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => barObserver.observe(bar));

  /* ==========================================================================
     7. ANIMATED COUNTERS
     ========================================================================== */
  const counters = document.querySelectorAll(".counter");

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute("data-target"), 10);
      const suffix = "+";
      let current  = 0;
      const step   = target / 50;
      const tick   = () => {
        current += step;
        if (current >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => countObserver.observe(c));

  /* ==========================================================================
     8. SERVICES MODAL
     ========================================================================== */
  const serviceData = {
    web: {
      title:  "Web Development",
      img:    "imgs/web-dev.png",
      desc:   "I build fast, scalable, and modern websites using the latest web technologies and best practices.",
      items:  ["Responsive, mobile-first layouts", "Clean HTML5, CSS3 & JavaScript", "SEO-optimized architecture", "API & third-party integrations"]
    },
    uiux: {
      title:  "UI / UX Design",
      img:    "imgs/uiux.png",
      desc:   "User-centered designs that are both visually stunning and intuitive to navigate.",
      items:  ["In-depth user research", "Wireframes & prototypes", "Design systems in Figma", "Usability testing & iteration"]
    },
    graphic: {
      title:  "Graphic Design",
      img:    "imgs/graphic.png",
      desc:   "Visual branding and creative design solutions that make your business unforgettable.",
      items:  ["Logo & brand identity", "Marketing creatives", "Social media assets", "Print & digital collateral"]
    },
    seo: {
      title:  "SEO Optimization",
      img:    "imgs/seo.png",
      desc:   "Strategic SEO to boost your search visibility, drive organic traffic, and grow your online presence.",
      items:  ["Keyword research & strategy", "On-page optimization", "Technical SEO audits", "Content optimization"]
    }
  };

  const modalBackdrop = document.getElementById("serviceModal");
  const modalClose    = document.getElementById("modalClose");
  const modalImg      = document.getElementById("modalImg");
  const modalTitle    = document.getElementById("modalTitle");
  const modalDesc     = document.getElementById("modalDesc");
  const modalList     = document.getElementById("modalList");

  const openModal = (serviceKey) => {
    const data = serviceData[serviceKey];
    if (!data) return;

    modalImg.src           = data.img;
    modalImg.alt           = data.title;
    modalTitle.textContent = data.title;
    modalDesc.textContent  = data.desc;
    modalList.innerHTML    = data.items
      .map(item => `<li><i class="fa-solid fa-circle-check"></i>${item}</li>`)
      .join("");

    modalBackdrop.classList.add("active");
    document.body.classList.add("no-scroll");

    const card = modalBackdrop.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
  };

  const closeModal = () => {
    modalBackdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  document.querySelectorAll(".service-card").forEach(card => {
    card.querySelector(".sc-btn")?.addEventListener("click", () => {
      openModal(card.dataset.service);
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ==========================================================================
     9. SCROLL TO TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    scrollTopBtn?.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ==========================================================================
     10. CONTACT FORM — validation + EmailJS
     ========================================================================== */
  emailjs.init("5IkvlnetHiJWb9jGd");

  const contactForm = document.getElementById("contactForm");
  const sendBtn     = document.getElementById("sendBtn");
  const toast       = document.getElementById("toast");
  const toastTitle  = document.getElementById("toastTitle");
  const toastMsg    = document.getElementById("toastMsg");
  const toastIcon   = document.getElementById("toastIcon");
  const toastProg   = document.getElementById("toastProgress");

  /* ── Toast helper ── */
  const showToast = (title, message, isError = false) => {
    // Reset progress animation
    if (toastProg) {
      toastProg.style.animation = "none";
      void toastProg.offsetWidth; // force reflow
      toastProg.style.animation  = "";
    }

    toast.classList.toggle("toast--error", isError);

    if (toastIcon) {
      toastIcon.className = isError
        ? "fa-solid fa-triangle-exclamation"
        : "fa-solid fa-circle-check";
    }

    toastTitle.textContent = title;
    toastMsg.innerHTML     = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 4800);
  };

  /* ── Validation helpers ── */
  const getField = (id) => document.getElementById(id);

  const setError = (input, message) => {
    input.classList.add("input--error");
    input.classList.remove("input--valid");

    const existing = input.parentElement.querySelector(".field-error");
    if (existing) existing.remove();

    const err = document.createElement("span");
    err.className = "field-error";
    err.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${message}`;
    input.parentElement.appendChild(err);
  };

  const clearError = (input) => {
    input.classList.remove("input--error");
    const existing = input.parentElement.querySelector(".field-error");
    if (existing) existing.remove();
  };

  const setValid = (input) => {
    clearError(input);
    input.classList.add("input--valid");
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const nameEl    = getField("user_name");
    const emailEl   = getField("user_email");
    const messageEl = getField("message");
    let valid = true;

    // Name
    if (!nameEl.value.trim()) {
      setError(nameEl, "Please enter your full name.");
      valid = false;
    } else {
      setValid(nameEl);
    }

    // Email
    if (!emailEl.value.trim()) {
      setError(emailEl, "Please enter your email address.");
      valid = false;
    } else if (!isValidEmail(emailEl.value.trim())) {
      setError(emailEl, "Please enter a valid email address.");
      valid = false;
    } else {
      setValid(emailEl);
    }

    // Message
    if (!messageEl.value.trim()) {
      setError(messageEl, "Please write a message before sending.");
      valid = false;
    } else if (messageEl.value.trim().length < 10) {
      setError(messageEl, "Message is too short (min 10 characters).");
      valid = false;
    } else {
      setValid(messageEl);
    }

    return valid;
  };

  // Live: clear error as user types; set valid on blur
  ["user_name", "user_email", "message"].forEach(id => {
    const el = getField(id);
    if (!el) return;

    el.addEventListener("input", () => {
      if (el.classList.contains("input--error")) clearError(el);
    });

    el.addEventListener("blur", () => {
      if (id === "user_name" && el.value.trim()) setValid(el);
      if (id === "user_email" && isValidEmail(el.value.trim())) setValid(el);
      if (id === "message" && el.value.trim().length >= 10) setValid(el);
    });
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake the button to signal failure
      sendBtn.style.animation = "none";
      void sendBtn.offsetWidth;
      sendBtn.style.animation = "btnShake 0.4s var(--ease)";
      return;
    }

    const name  = contactForm.user_name.value.trim();
    const email = contactForm.user_email.value.trim();

    const btnText = sendBtn.querySelector(".btn-text");
    const btnIcon = sendBtn.querySelector("i");
    sendBtn.disabled    = true;
    btnText.textContent = "Sending…";
    btnIcon.className   = "fa-solid fa-spinner fa-spin";

    emailjs.sendForm("service_xw7noct", "template_tgke9ss", contactForm)
      .then(() => {
        showToast(
          "Message Sent!",
          `Thanks <strong>${name}</strong>! We'll reply to <strong>${email}</strong> soon.`
        );
        contactForm.reset();
        ["user_name", "user_email", "message"].forEach(id => {
          const el = getField(id);
          if (el) el.classList.remove("input--valid", "input--error");
        });
      })
      .catch(() => {
        showToast(
          "Failed to Send",
          "Something went wrong. Please try again or email directly.",
          true
        );
      })
      .finally(() => {
        sendBtn.disabled    = false;
        btnText.textContent = "Send Message";
        btnIcon.className   = "fa-solid fa-paper-plane";
      });
  });

  /* ==========================================================================
     11. SMOOTH MARQUEE — pause on hover
     ========================================================================== */
  const marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    marqueeTrack.addEventListener("mouseenter", () => {
      marqueeTrack.style.animationPlayState = "paused";
    });
    marqueeTrack.addEventListener("mouseleave", () => {
      marqueeTrack.style.animationPlayState = "running";
    });
  }

})();

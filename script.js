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
     Reads/writes to localStorage, applies class to <html>
     ========================================================================== */
  const themeBtn = document.getElementById("themeBtn");
  const htmlEl   = document.documentElement;

  // Apply saved preference immediately (prevents flash)
  if (localStorage.getItem("theme") === "dark") {
    htmlEl.classList.add("dark");
  }

  themeBtn?.addEventListener("click", () => {
    const isDark = htmlEl.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  /* ==========================================================================
     3. NAVBAR
     – Scrolled state
     – Active link highlighting
     – Mobile menu open/close
     ========================================================================== */
  const navbar     = document.getElementById("navbar");
  const hamburger  = document.getElementById("hamburger");
  const navMenu    = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const navCloseBtn= document.getElementById("navCloseBtn");
  const navLinks   = document.querySelectorAll(".nav-link");
  const sections   = document.querySelectorAll("section[id]");

  // Open mobile menu
  const openMenu = () => {
    hamburger.classList.add("open");
    navMenu.classList.add("open");
    navOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
  };

  // Close mobile menu
  const closeMenu = () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
    navOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  hamburger?.addEventListener("click", openMenu);
  navOverlay?.addEventListener("click", closeMenu);

  // Close button inside menu panel
  navCloseBtn?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => link.addEventListener("click", closeMenu));

  // Scrolled state + active section highlighting
  const handleScroll = () => {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active section
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
  handleScroll(); // Run on load

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

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll("a, button, [data-service]");
  hoverTargets.forEach(el => {
    el.addEventListener("mouseenter", () => cursorFollower?.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorFollower?.classList.remove("hover"));
  });

  // Only run cursor on pointer devices
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    animateCursor();
  }

  /* ==========================================================================
     5. SCROLL REVEAL
     Uses IntersectionObserver for performance
     ========================================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. SKILL BARS
     Animate bars when they scroll into view
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

    modalImg.src              = data.img;
    modalImg.alt              = data.title;
    modalTitle.textContent    = data.title;
    modalDesc.textContent     = data.desc;
    modalList.innerHTML       = data.items
      .map(item => `<li><i class="fa-solid fa-circle-check"></i>${item}</li>`)
      .join("");

    modalBackdrop.classList.add("active");
    document.body.classList.add("no-scroll");

    // Scroll modal to top on re-open
    const card = modalBackdrop.querySelector(".modal-card");
    if (card) card.scrollTop = 0;
  };

  const closeModal = () => {
    modalBackdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  };

  // Delegate click to service cards
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
     10. CONTACT FORM (EmailJS)
     ========================================================================== */
  emailjs.init("5IkvlnetHiJWb9jGd");

  const contactForm = document.getElementById("contactForm");
  const sendBtn     = document.getElementById("sendBtn");
  const toast       = document.getElementById("toast");
  const toastTitle  = document.getElementById("toastTitle");
  const toastMsg    = document.getElementById("toastMsg");

  const showToast = (title, message, isError = false) => {
    // Reset progress animation
    const progress = toast.querySelector(".toast-progress");
    if (progress) {
      progress.style.animation = "none";
      progress.offsetHeight; // Reflow
      progress.style.animation = "";
      progress.style.background = isError ? "#ef4444" : "";
    }
    toast.style.borderLeftColor = isError ? "#ef4444" : "";
    toast.querySelector(".toast-icon i").className = isError
      ? "fa-solid fa-circle-xmark"
      : "fa-solid fa-circle-check";
    toast.querySelector(".toast-icon").style.color      = isError ? "#ef4444" : "";
    toast.querySelector(".toast-icon").style.background = isError ? "rgba(239,68,68,0.12)" : "";

    toastTitle.textContent = title;
    toastMsg.innerHTML     = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 4800);
  };

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name  = contactForm.user_name.value.trim();
    const email = contactForm.user_email.value.trim();

    // Button loading state
    const btnText = sendBtn.querySelector(".btn-text");
    const btnIcon = sendBtn.querySelector("i");
    sendBtn.disabled    = true;
    btnText.textContent = "Sending…";
    btnIcon.className   = "fa-solid fa-spinner fa-spin";

    emailjs.sendForm("service_xw7noct", "template_tgke9ss", contactForm)
      .then(() => {
        showToast("Message Sent! 🎉", `Thanks <strong>${name}</strong>! We'll reply to <strong>${email}</strong> soon.`);
        contactForm.reset();
      })
      .catch(() => {
        showToast("Failed to Send", "Something went wrong. Please try again or email directly.", true);
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

})(); // End IIFE

/* ================= NAVBAR JAVASCRIPT STYLES STARTS HERE =============== */
document.addEventListener("DOMContentLoaded", () => {

  const navRoot = document.getElementById("navRoot");
  const hamburger = document.getElementById("hamburger");
  const navOverlay = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("navCloseBtn");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  const openMenu = () => {
    navRoot.classList.add("active");
    navOverlay.classList.add("active");
    document.body.classList.add("nav-no-scroll");
  };

  const closeMenu = () => {
    navRoot.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.classList.remove("nav-no-scroll");
  };

  if (hamburger) hamburger.addEventListener("click", openMenu);
  if (navOverlay) navOverlay.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

const handleScroll = () => {

  if (window.scrollY > 80) {
    navRoot.classList.add("scrolled");
    navRoot.classList.remove("transparent");
  } else {
    navRoot.classList.remove("scrolled");
    navRoot.classList.add("transparent");
  }

  let currentSection = "";

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();

    // detect section in center of screen (more accurate)
    if (rect.top <= window.innerHeight * 0.4 &&
        rect.bottom >= window.innerHeight * 0.4) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
};

  window.addEventListener("scroll", handleScroll);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

});
  const navbar = document.querySelector(".nav-root");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });


/* ================= SKILLS JAVASCRIPT STYLES STARTS HERE =============== */
const skillItems = document.querySelectorAll(".skill");

function animateSkills() {
  skillItems.forEach(item => {
    const value = item.getAttribute("data-value");
    const bar = item.querySelector(".bar span");
    const top = item.getBoundingClientRect().top;

    if (top < window.innerHeight * 0.85) {
      bar.style.width = value + "%";
    }
  });
}

window.addEventListener("scroll", animateSkills);
animateSkills();

/* ================= SERVICE JAVASCRIPT ================= */
document.addEventListener("DOMContentLoaded", () => {

  const servicesSection = document.getElementById("servicesSection");
  const servicesOverlay = document.getElementById("servicesOverlay");
  const servicesOverlayTitle = document.getElementById("servicesOverlayTitle");
  const servicesOverlayContent = document.getElementById("servicesOverlayContent");
  const servicesCloseBtn = document.getElementById("servicesCloseBtn");

  let scrollY = 0;

  const serviceDetails = {
    web: {
      title: "Web Development",
      content: `
        <div class="overlay-content">
          <div class="overlay-image">
            <img src="imgs/web-dev.png">
          </div>
          <p>I develop fast, scalable, and modern websites.</p>
          <ul>
            <li><i class="fa-solid fa-check-circle"></i>Responsive websites</li>
            <li><i class="fa-solid fa-check-circle"></i>Clean HTML, CSS & JS</li>
            <li><i class="fa-solid fa-check-circle"></i>SEO optimized</li>
            <li><i class="fa-solid fa-check-circle"></i>API integration</li>
          </ul>
        </div>`
    },
    uiux: {
      title: "UI / UX Design",
      content: `
        <div class="overlay-content">
          <div class="overlay-image">
            <img src="imgs/uiux.png">
          </div>
          <p>Intuitive, user-centered design experiences.</p>
          <ul>
            <li><i class="fa-solid fa-check-circle"></i>User research</li>
            <li><i class="fa-solid fa-check-circle"></i>Wireframes</li>
            <li><i class="fa-solid fa-check-circle"></i>Design systems</li>
          </ul>
        </div>`
    },
    graphic: {
      title: "Graphic Design",
      content: `
        <div class="overlay-content">
          <div class="overlay-image">
            <img src="imgs/graphic.png">
          </div>
          <p>Visual branding and creative design solutions.</p>
          <ul>
            <li><i class="fa-solid fa-check-circle"></i>Logo design</li>
            <li><i class="fa-solid fa-check-circle"></i>Marketing creatives</li>
            <li><i class="fa-solid fa-check-circle"></i>Brand identity</li>
          </ul>
        </div>`
    },
    seo: {
      title: "SEO Optimization",
      content: `
        <div class="overlay-content">
          <div class="overlay-image">
            <img src="imgs/seo.png">
          </div>
          <p>Strategic SEO to improve visibility and rankings.</p>
          <ul>
            <li><i class="fa-solid fa-check-circle"></i>Keyword research</li>
            <li><i class="fa-solid fa-check-circle"></i>On-page optimization</li>
            <li><i class="fa-solid fa-check-circle"></i>Technical audits</li>
            <li><i class="fa-solid fa-check-circle"></i>Content optimization</li>
          </ul>
        </div>`
    }
  };

  /* ========= OPEN ========= */
  const openServicesModal = (service) => {
    scrollY = window.scrollY;

    servicesOverlayTitle.textContent = serviceDetails[service].title;
    servicesOverlayContent.innerHTML = serviceDetails[service].content;

    servicesOverlay.classList.add("active");

    // LOCK SCROLL (NO JUMP)
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  };

  /* ========= CLOSE ========= */
const closeServicesModal = () => {
  servicesOverlay.classList.remove("active");

  // UNLOCK SCROLL
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  // STAY ON SERVICES SECTION
  servicesSection.scrollIntoView({ behavior: "instant", block: "start" });

  // ✅ FORCE "WHAT I DO" ACTIVE (PUT YOUR CODE HERE)
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });

  const whatIDoLink = document.querySelector('.nav-link[href="#servicesSection"]');
  if (whatIDoLink) {
    whatIDoLink.classList.add("active");
  }
};

  /* ========= CLICK ========= */
  servicesSection?.addEventListener("click", (e) => {
    const btn = e.target.closest(".services-learn-link");
    if (!btn) return;

    const card = btn.closest(".service-card");
    const service = card.dataset.service;

    if (!serviceDetails[service]) return;

    openServicesModal(service);
  });

  /* ========= CLOSE EVENTS ========= */
  servicesCloseBtn?.addEventListener("click", closeServicesModal);

  servicesOverlay?.addEventListener("click", (e) => {
    if (e.target === servicesOverlay) closeServicesModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeServicesModal();
  });

});

/* ================= SCROLL INDICATOR JAVASCRIPT STYLES STARTS HERE ================= */
const indicator = document.getElementById("scrollIndicator");
const footer = document.querySelector("footer");
const cta = document.querySelector(".cta-section");
const contact = document.querySelector(".contact-wrapper");

window.addEventListener("scroll", () => {


  if (window.scrollY > 300) {
    indicator.classList.add("show");
  } else {
    indicator.classList.remove("show");
  }

  const windowHeight = window.innerHeight;

  const footerTop = footer.getBoundingClientRect().top;
  if (footerTop < windowHeight + 20) {
    indicator.classList.add("on-footer");
  } else {
    indicator.classList.remove("on-footer");
  }

  const ctaRect = cta.getBoundingClientRect();
  const contactRect = contact.getBoundingClientRect();
  if (
    ctaRect.top < windowHeight &&
    ctaRect.bottom > 0 &&
    !(contactRect.top < windowHeight && contactRect.bottom > 0)
  ) {
    indicator.classList.add("on-cta");
  } else {
    indicator.classList.remove("on-cta");
  }
});
indicator.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* ================= HERO SCROLL INDICATOR JAVASCRIPT STYLES STARTS HERE ================= */
const progressBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = scrollTop / docHeight;

  const maxHeight = 40;
  progressBar.setAttribute("height", progress * maxHeight);

});



/* ================= CONTACT SEND MESSAGE JAVASCRIPT STYLES STARTS HERE ================= */
(function () {
  emailjs.init("5IkvlnetHiJWb9jGd");
})();

const form = document.getElementById("contactForm");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

function showToast(message){

  toastMessage.innerHTML = message;

  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },5000);

}

form.addEventListener("submit", function (e) {

  e.preventDefault();

  const name = form.user_name.value;
  const email = form.user_email.value;

  emailjs.sendForm(
    "service_xw7noct",
    "template_tgke9ss",
    this
  )

  .then(function () {

    showToast(
      `Thanks <b>${name}</b>! Message sent successfully. We will reply to <b>${email}</b>.`
    );

    form.reset();

  })

  .catch(function () {

    showToast("Message failed to send. Please try again.");

  });

});



// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));


/* ==========================================================================
   DARK MODE — Theme Toggle
   ─────────────────────────────────────────────────────────────────────────
   How it works:
   • Reads saved preference from localStorage on page load (no flash).
   • Clicking the toggle flips the "dark" class on <html>.
   • Saves the new preference to localStorage.
   • The checkbox state stays in sync with the class automatically.
   ========================================================================== */

(function () {
  "use strict";

  // ── 1. Apply saved theme immediately (prevents flash of wrong theme) ──
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  }

  // ── 2. Wire up the toggle once the DOM is ready ──
  document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById("themeCheckbox");
    if (!checkbox) return;

    // Sync checkbox with current theme
    checkbox.checked = document.documentElement.classList.contains("dark");

    // Listen for toggle changes
    checkbox.addEventListener("change", function () {
      const isDark = this.checked;

      // Apply / remove class
      document.documentElement.classList.toggle("dark", isDark);

      // Persist preference
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  });
})();
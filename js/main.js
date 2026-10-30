(function () {
  "use strict";

  const GALLERY_IMAGES = Array.from({ length: 17 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return {
      src: `assets/images/gallery-${num}.jpg`,
      alt: `Kanak Dwivedi — work and events photo ${i + 1}`,
    };
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Page load */
  function onReady() {
    document.body.classList.add("is-loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  /* Scroll reveal */
  function observeReveal(elements) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => revealObserver.observe(el));
  }

  observeReveal(document.querySelectorAll(".reveal"));

  const timeline = document.querySelector(".timeline-animate");
  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add("is-visible");
            timelineObserver.unobserve(timeline);
          }
        });
      },
      { threshold: 0.15 }
    );
    timelineObserver.observe(timeline);
  }

  document.querySelectorAll(".timeline-item.reveal").forEach((item, i) => {
    item.style.setProperty("--delay", `${0.15 + i * 0.12}s`);
  });

  /* Gallery grid */
  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) {
    GALLERY_IMAGES.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item reveal reveal-scale";
      btn.style.setProperty("--delay", `${(index % 8) * 0.05}s`);
      btn.dataset.index = String(index);
      btn.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy" />`;
      galleryGrid.appendChild(btn);
    });
    observeReveal(galleryGrid.querySelectorAll(".reveal"));
  }

  /* Mobile nav */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Header on scroll */
  const header = document.querySelector(".site-header");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* Animated counters */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent =
        target >= 1000 ? value.toLocaleString("en-IN") + suffix : value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else {
        el.textContent =
          target >= 1000
            ? target.toLocaleString("en-IN") + suffix
            : target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const statDts = document.querySelectorAll(".hero-stats dt[data-count]");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statDts.forEach((dt) => statsObserver.observe(dt));

  /* Parallax (subtle) */
  if (!prefersReducedMotion) {
    const parallaxEls = document.querySelectorAll(".parallax-wrap");
    function onParallaxScroll() {
      const scrollY = window.scrollY;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * 0.04;
        el.style.transform = `translateY(${offset}px)`;
      });
    }
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    onParallaxScroll();
  }

  /* Cursor glow */
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
    let x = 0;
    let y = 0;
    let gx = 0;
    let gy = 0;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
    });
    function loop() {
      gx += (x - gx) * 0.08;
      gy += (y - gy) * 0.08;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    const item = GALLERY_IMAGES[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    setTimeout(() => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }, 280);
  }

  function showAdjacent(delta) {
    currentIndex =
      (currentIndex + delta + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    const item = GALLERY_IMAGES[currentIndex];
    lightboxImg.style.opacity = "0";
    lightboxImg.style.transform = "scale(0.96)";
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxImg.style.opacity = "";
      lightboxImg.style.transform = "";
    }, 120);
  }

  if (galleryGrid) {
    galleryGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-item");
      if (!btn) return;
      openLightbox(parseInt(btn.dataset.index, 10));
    });
  }

  document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-prev")?.addEventListener("click", () => showAdjacent(-1));
  document.querySelector(".lightbox-next")?.addEventListener("click", () => showAdjacent(1));

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showAdjacent(-1);
    if (e.key === "ArrowRight") showAdjacent(1);
  });

  /* Active nav on scroll */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

  function onScrollNav() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.style.color = href === `#${current}` ? "var(--text)" : "";
    });
  }

  window.addEventListener("scroll", onScrollNav, { passive: true });
})();

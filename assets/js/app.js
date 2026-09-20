// Toast Notification Engine
window.showToast = function(message, type = "default") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `glass-strong shadow-[var(--shadow-lift)] flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 animate-rise pointer-events-auto ${
    type === "success"
      ? "border-gold/50 text-foreground"
      : type === "error"
      ? "border-destructive/40 text-destructive"
      : "border-border text-foreground"
  }`;

  const iconSvg = type === "success" 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-gold shrink-0"><path d="M20 6 9 17l-5-5"/></svg>`
    : type === "error"
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-destructive shrink-0"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-primary shrink-0"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    setTimeout(() => toast.remove(), 350);
  }, 3200);
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation scroll blur & padding transition
  const nav = document.getElementById("main-nav");
  const navContainer = document.getElementById("nav-container");

  function onScroll() {
    if (!nav || !navContainer) return;
    if (window.scrollY > 40) {
      nav.classList.remove("py-4");
      nav.classList.add("py-2");
      navContainer.classList.remove("bg-transparent");
      navContainer.classList.add("glass-strong", "mx-3", "sm:mx-6");
    } else {
      nav.classList.remove("py-2");
      nav.classList.add("py-4");
      navContainer.classList.remove("glass-strong", "mx-3", "sm:mx-6");
      navContainer.classList.add("bg-transparent");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 2. Mobile menu toggle
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isExpanded = mobileBtn.getAttribute("aria-expanded") === "true";
      mobileBtn.setAttribute("aria-expanded", String(!isExpanded));
      if (isExpanded) {
        mobileMenu.classList.add("hidden");
        menuIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      } else {
        mobileMenu.classList.remove("hidden");
        menuIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileBtn.setAttribute("aria-expanded", "false");
        menuIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      });
    });
  }

  // 3. Scroll Reveal Animation (IntersectionObserver)
  const revealSections = document.querySelectorAll("section.scroll-mt-24, ol.relative > li");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0");
          entry.target.classList.add("animate-rise");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
  );

  revealSections.forEach((sec) => observer.observe(sec));

  // 4. FAQs Accordion toggle
  document.querySelectorAll("[data-faq-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const answerContainer = btn.nextElementSibling;
      const chevron = btn.querySelector(".lucide-chevron-down");

      // Close all other FAQs
      document.querySelectorAll("[data-faq-toggle]").forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherAns = otherBtn.nextElementSibling;
          const otherChev = otherBtn.querySelector(".lucide-chevron-down");
          if (otherAns) {
            otherAns.classList.remove("grid-rows-[1fr]", "opacity-100");
            otherAns.classList.add("grid-rows-[0fr]", "opacity-0");
          }
          if (otherChev) otherChev.classList.remove("rotate-180");
        }
      });

      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        if (answerContainer) {
          answerContainer.classList.remove("grid-rows-[1fr]", "opacity-100");
          answerContainer.classList.add("grid-rows-[0fr]", "opacity-0");
        }
        if (chevron) chevron.classList.remove("rotate-180");
      } else {
        btn.setAttribute("aria-expanded", "true");
        if (answerContainer) {
          answerContainer.classList.remove("grid-rows-[0fr]", "opacity-0");
          answerContainer.classList.add("grid-rows-[1fr]", "opacity-100");
        }
        if (chevron) chevron.classList.add("rotate-180");
      }
    });
  });

  // 5. Hashtag Copy functionality
  const copyBtn = document.getElementById("copy-hashtag-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const hashtag = "#AyushWedsAnnushka";
      try {
        await navigator.clipboard.writeText(hashtag);
        const textSpan = document.getElementById("copy-btn-text");
        const copyIcon = document.getElementById("copy-icon");
        const checkIcon = document.getElementById("check-icon");

        if (textSpan) textSpan.textContent = "Copied";
        if (copyIcon) copyIcon.classList.add("hidden");
        if (checkIcon) checkIcon.classList.remove("hidden");

        window.showToast("Hashtag copied — tag away!", "success");

        setTimeout(() => {
          if (textSpan) textSpan.textContent = "Copy hashtag";
          if (copyIcon) copyIcon.classList.remove("hidden");
          if (checkIcon) checkIcon.classList.add("hidden");
        }, 2200);
      } catch (err) {
        window.showToast("Couldn't copy. Long-press to select it instead.", "error");
      }
    });
  }
});

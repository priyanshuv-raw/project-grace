const GALLERY_ITEMS = [
  {
    src: "./assets/images/hero-couple.png",
    caption: "The two of us — as drawn by our favourite illustrator"
  },
  {
    src: "./assets/images/event-mehendi.png",
    caption: "Mehendi — Green"
  },
  {
    src: "./assets/images/event-sangeet.png",
    caption: "Sangeet — Glittery & Indo-Western"
  },
  {
    src: "./assets/images/event-haldi.png",
    caption: "Haldi — Yellow, Magenta & Pink"
  },
  {
    src: "./assets/images/event-wedding.png",
    caption: "Wedding — Traditional wear"
  },
  {
    src: "./assets/images/event-reception.png",
    caption: "Reception — Eternity by Taj Group"
  }
];

let currentLightboxIndex = null;

function openLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById("gallery-lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  if (!modal || !img || !caption) return;

  const item = GALLERY_ITEMS[index];
  img.src = item.src;
  img.alt = item.caption;
  caption.textContent = item.caption;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  currentLightboxIndex = null;
  const modal = document.getElementById("gallery-lightbox");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

function stepLightbox(step) {
  if (currentLightboxIndex === null) return;
  const newIndex = (currentLightboxIndex + step + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  openLightbox(newIndex);
}

document.addEventListener("DOMContentLoaded", () => {
  // Bind gallery image buttons
  document.querySelectorAll("[data-gallery-index]").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.getAttribute("data-gallery-index"), 10);
      if (!isNaN(idx)) openLightbox(idx);
    });
  });

  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const modal = document.getElementById("gallery-lightbox");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("lightbox-backdrop")) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (currentLightboxIndex === null) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
  });
});

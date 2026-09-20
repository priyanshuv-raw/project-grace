function initScratchCard() {
  const canvas = document.getElementById("scratch-canvas");
  const cardContainer = document.getElementById("scratch-card-container");
  const hintText = document.getElementById("scratch-hint-text");
  if (!canvas || !cardContainer) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let isDrawing = false;
  let isRevealed = false;
  let lastPos = null;
  const REVEAL_THRESHOLD = 0.45; // When ~45% is cleared, reveal full secret

  function paintFoil() {
    if (isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    const w = canvas.width;
    const h = canvas.height;

    // Authentic gold gradient identical to original site
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#f6e3c8");
    grad.addColorStop(0.35, "#e6c48f");
    grad.addColorStop(0.55, "#fff4e2");
    grad.addColorStop(0.8, "#dcb377");
    grad.addColorStop(1, "#f1d7ae");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sparkle flecks
    const sparkleCount = Math.floor((w * h) / 900);
    for (let i = 0; i < sparkleCount; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.35})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    // Centered "SCRATCH HERE" label
    ctx.fillStyle = "rgba(160, 120, 60, 0.35)";
    const fontSize = Math.round(w / 26);
    ctx.font = `600 ${fontSize}px Karla, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2 + 3);
  }

  paintFoil();

  window.addEventListener("resize", () => {
    if (!isRevealed) paintFoil();
  });

  function scratchAt(clientX, clientY) {
    if (isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    const radius = canvas.width * 0.055;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;

    ctx.beginPath();
    if (lastPos) {
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    lastPos = { x, y };
  }

  function checkReveal() {
    if (isRevealed) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < imgData.length; i += 32) {
        total++;
        if (imgData[i] === 0) cleared++;
      }
      if (total && cleared / total > REVEAL_THRESHOLD) {
        isRevealed = true;
        canvas.style.transition = "opacity 0.6s ease-out";
        canvas.style.opacity = "0";
        setTimeout(() => {
          canvas.style.display = "none";
        }, 600);

        if (hintText) {
          hintText.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-gold" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>
            See you there!
          `;
        }
        if (window.showToast) {
          window.showToast("Muhurat revealed! 20 Nov 2026, 7:30 PM", "success");
        }
      }
    } catch (e) {}
  }

  canvas.addEventListener("pointerdown", (e) => {
    isDrawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    scratchAt(e.clientX, e.clientY);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDrawing) return;
    scratchAt(e.clientX, e.clientY);
  });

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      lastPos = null;
      checkReveal();
    }
  }

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
}

document.addEventListener("DOMContentLoaded", initScratchCard);

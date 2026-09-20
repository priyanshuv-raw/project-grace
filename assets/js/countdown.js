// Wedding Date: 20 November 2026, 7:30 PM IST (UTC+5:30) - Ayush & Annushka
const WEDDING_DATE = new Date("2026-11-20T19:30:00+05:30");

function updateCountdown() {
  const now = Date.now();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");
  const titleEl = document.getElementById("countdown-status");

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

  if (titleEl) {
    titleEl.textContent = diff === 0 ? "The day is here" : "Counting down to the vows";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
});

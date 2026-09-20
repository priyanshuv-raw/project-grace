const INITIAL_WISHES = [
  {
    name: "Ananya & Kabir",
    note: "From canteen conversations to a royal mandap in Varanasi. So proud of you both!"
  },
  {
    name: "Team Varanasi",
    note: "Annushka, please teach Ayush to dance before the Sangeet. Regards, everyone."
  },
  {
    name: "Dadi & Nani",
    note: "Bless you both with a life full of laughter, sweets, and eternal happiness."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestbook-form");
  const list = document.getElementById("guestbook-list");
  if (!form || !list) return;

  function loadWishes() {
    try {
      const saved = JSON.parse(localStorage.getItem("wedding_guestbook") || "[]");
      return [...saved, ...INITIAL_WISHES];
    } catch (_) {
      return INITIAL_WISHES;
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderWishes() {
    const wishes = loadWishes();
    list.innerHTML = "";
    wishes.forEach((w) => {
      const li = document.createElement("li");
      li.className = "glass hover-lift rounded-4xl p-5";
      li.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-primary/70" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>
        <p class="mt-3 text-sm leading-relaxed text-foreground">“${escapeHtml(w.note)}”</p>
        <p class="mt-4 font-display text-sm font-semibold text-muted-foreground">— ${escapeHtml(w.name)}</p>
      `;
      list.appendChild(li);
    });
  }

  renderWishes();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = form.querySelector("[name='name']");
    const noteInput = form.querySelector("[name='note']");
    const errName = document.getElementById("error-guestbook-name");
    const errNote = document.getElementById("error-guestbook-note");

    if (errName) errName.classList.add("hidden");
    if (errNote) errNote.classList.add("hidden");

    const name = (nameInput?.value || "").trim();
    const note = (noteInput?.value || "").trim();

    let hasError = false;
    if (!name || name.length < 2) {
      if (errName) {
        errName.textContent = "Please add your name";
        errName.classList.remove("hidden");
      }
      hasError = true;
    }

    if (!note || note.length < 4) {
      if (errNote) {
        errNote.textContent = "Write a little more";
        errNote.classList.remove("hidden");
      }
      hasError = true;
    } else if (note.length > 300) {
      if (errNote) {
        errNote.textContent = "Keep it under 300 characters";
        errNote.classList.remove("hidden");
      }
      hasError = true;
    }

    if (hasError) return;

    try {
      const saved = JSON.parse(localStorage.getItem("wedding_guestbook") || "[]");
      saved.unshift({ name, note, date: new Date().toISOString() });
      localStorage.setItem("wedding_guestbook", JSON.stringify(saved));
    } catch (_) {}

    renderWishes();
    form.reset();

    if (window.showToast) {
      window.showToast("Your blessing has been added to the guestbook", "success");
    }
  });
});

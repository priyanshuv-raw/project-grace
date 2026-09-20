document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const successCard = document.getElementById("rsvp-success-card");
  const resetBtn = document.getElementById("rsvp-reset-btn");
  if (!form || !successCard) return;

  function showError(fieldName, message) {
    const errEl = document.getElementById(`error-${fieldName}`);
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove("hidden");
    }
  }

  function clearErrors() {
    document.querySelectorAll("[id^='error-']").forEach((el) => {
      el.textContent = "";
      el.classList.add("hidden");
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const guests = parseInt(formData.get("guests") || "0", 10);
    const attendance = formData.get("attendance");
    const meal = formData.get("meal");
    const events = formData.getAll("events");
    const message = (formData.get("message") || "").toString().trim();

    let hasError = false;

    if (!name || name.length < 2) {
      showError("name", "Please enter your full name");
      hasError = true;
    } else if (name.length > 80) {
      showError("name", "Name must be under 80 characters");
      hasError = true;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      showError("phone", "Enter a valid phone number (digits, spaces, + and -)");
      hasError = true;
    }

    if (isNaN(guests) || guests < 1) {
      showError("guests", "At least 1 guest");
      hasError = true;
    } else if (guests > 12) {
      showError("guests", "Max 12 guests");
      hasError = true;
    }

    if (message.length > 600) {
      showError("message", "Please keep it under 600 characters");
      hasError = true;
    }

    if (hasError) {
      if (window.showToast) window.showToast("Please check the highlighted fields", "error");
      return;
    }

    // Save to localStorage
    const submission = {
      name,
      phone,
      guests,
      attendance,
      meal,
      events,
      message,
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("wedding_rsvps") || "[]");
      existing.unshift(submission);
      localStorage.setItem("wedding_rsvps", JSON.stringify(existing));
    } catch (_) {}

    // Form confirmation
    form.classList.add("hidden");
    successCard.classList.remove("hidden");

    if (window.showToast) {
      if (attendance === "yes") {
        window.showToast(`Thank you, ${name}! We can't wait to celebrate with you.`, "success");
      } else {
        window.showToast(`Thank you for letting us know, ${name}. You'll be missed!`, "default");
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      clearErrors();
      successCard.classList.add("hidden");
      form.classList.remove("hidden");
    });
  }
});

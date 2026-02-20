(() => {
  const TOAST_ID = "toast";
  const STYLE_ID = "toast-style";

  function ensureToast() {
    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = TOAST_ID;
      document.body.appendChild(toast);
    }

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
#${TOAST_ID} {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translate(-50%, -10px) scale(0.98);
  min-width: 260px;
  max-width: min(90vw, 420px);

  padding: 14px 20px;
  border-radius: 10px;

  background: rgba(28, 28, 30, 0.59);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.15);

  opacity: 0;
  visibility: hidden;

  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(.2,.8,.2,1),
    visibility 0.25s;

  z-index: 9999;
}

#${TOAST_ID}.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0) scale(1);
}

/* Optional: Success style */
#${TOAST_ID}.success {
  background: rgba(34, 197, 94, 0.9);
}

/* Optional: Error style */
#${TOAST_ID}.error {
  background: rgba(239, 68, 68, 0.9);
}

/* Optional: Warning style */
#${TOAST_ID}.warning {
  background: rgba(245, 158, 11, 0.9);
}
`;
      document.head.appendChild(style);
    }

    return toast;
  }

  function showToast(message, duration) {
    const toast = ensureToast();
    toast.textContent = message;
    toast.classList.add("show");

    const delay = typeof duration === "number" ? duration : 3000;
    if (toast._timer) {
      clearTimeout(toast._timer);
    }
    toast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, delay);
  }

  window.showToast = showToast;
})();

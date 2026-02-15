const fadeItems = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

fadeItems.forEach((item) => observer.observe(item));


const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});


const brandLogo = document.querySelector(".brand");

if (brandLogo) {
  brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });
}


const track = document.getElementById("galleryTrack");
let items = document.querySelectorAll(".gallery-item");

let index = 1;
let autoPlay;

const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, items[0]);

items = document.querySelectorAll(".gallery-item");

function updateGallery(animate = true) {
  track.style.transition = animate
    ? "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
    : "none";

  const item = items[index];
  const itemCenter = item.offsetLeft + item.offsetWidth / 2;
  const containerCenter = window.innerWidth / 2;

  const moveX = containerCenter - itemCenter;
  track.style.transform = `translateX(${moveX}px)`;

  items.forEach((item) => item.classList.remove("is-active"));
  item.classList.add("is-active");
}

function nextSlide() {
  index++;
  updateGallery(true);

  if (index === items.length - 1) {
    setTimeout(() => {
      index = 1;
      updateGallery(false);
    }, 600);
  }
}

function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 5500);
}

items.forEach((item, i) => {
  item.addEventListener("click", () => {
    index = i;
    updateGallery();
    clearInterval(autoPlay);
    startAutoPlay();
  });
});

updateGallery(false);
startAutoPlay();

window.addEventListener("resize", () => updateGallery(false));



const addReviewBtn = document.getElementById("addReviewBtn");

if (addReviewBtn) {
  addReviewBtn.addEventListener("click", () => {
    alert("Review option is opening soon for you guys..!");
  });
}


window.addEventListener("load", () => {
  fadeItems.forEach((item) => {
    if (item.getBoundingClientRect().top < window.innerHeight) {
      item.classList.add("show");
    }
  });

  const twitbutton = document.getElementById("twitter");

  if (twitbutton) {
    twitbutton.addEventListener("click", () => {
      alert("Not yet created, we will create soon 😊");
    });
  }
});



const profileBtn = document.getElementById("profileBtn");
const navAvatar = document.getElementById("navAvatar");
const profileSvgIcon = document.getElementById("profileSvgIcon");

const profileOverlay = document.getElementById("profileOverlay");
const profileMenu = document.getElementById("profileMenu");

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");

const switchModeBtn = document.getElementById("switchModeBtn");
const switchText = document.getElementById("switchText");

const authTitle = document.getElementById("authTitle");
const authSub = document.getElementById("authSub");
const submitBtn = document.getElementById("submitBtn");

const nameWrap = document.getElementById("nameWrap");
const nameField = document.getElementById("nameField");

const emailField = document.getElementById("emailField");
const passField = document.getElementById("passField");

const togglePassBtn = document.getElementById("togglePassBtn");
const loginRow = document.getElementById("loginRow");

const authForm = document.getElementById("authForm");
const forgotBtn = document.getElementById("forgotBtn");

const userNameText = document.getElementById("userNameText");
const userEmailText = document.getElementById("userEmailText");
const logoutBtn = document.getElementById("logoutBtn");

let isSignup = false;
const supabaseClient = window.supabaseClient;


function updateProfileMenuUI() {
  const user = JSON.parse(localStorage.getItem("zenoUser"));
  
  if (!user) {
    if (navAvatar) navAvatar.style.display = "none";
    if (profileSvgIcon) profileSvgIcon.style.display = "block";
    return;
  }

  if (userNameText) userNameText.textContent = user.name;
  if (userEmailText) userEmailText.textContent = user.email;

  if (navAvatar) {
    navAvatar.style.display = "flex";
    if (user.photo) {
      navAvatar.innerHTML = `<img src="${user.photo}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else {
      const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();
      navAvatar.textContent = initials || "Z";
    }
  }

  if (profileSvgIcon) profileSvgIcon.style.display = "none";
}

function getAuthRedirectUrl() {
  return window.location.origin + window.location.pathname;
}

function buildUserData(user) {
  const meta = user.user_metadata || {};
  const email = user.email || "";
  const nameFromMeta = meta.full_name || meta.name || meta.display_name;
  const name = nameFromMeta || (email ? email.split("@")[0] : "zENO User");
  const photo = meta.avatar_url || meta.picture || meta.avatar || null;

  return {
    uid: user.id,
    name: name,
    email: email,
    photo: photo,
    provider: "supabase"
  };
}

function setLocalUser(userData) {
  localStorage.setItem("zenoUser", JSON.stringify(userData));
  updateProfileMenuUI();
}

function clearLocalUser() {
  localStorage.removeItem("zenoUser");
  updateProfileMenuUI();
}

async function handleSupabaseSession(session) {
  if (session && session.user) {
    const userData = buildUserData(session.user);
    setLocalUser(userData);

    if (modalOverlay) modalOverlay.style.display = "none";
  } else {
    clearLocalUser();
  }
}

if (supabaseClient && supabaseClient.auth) {
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Supabase getSession error:", error);
      clearLocalUser();
      return;
    }

    handleSupabaseSession(data.session);
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    handleSupabaseSession(session);
  });
} else {
  console.error("Supabase client not found. Check Supabase config.");
  clearLocalUser();
}
if (profileBtn) {
  profileBtn.addEventListener("click", (e) => {
    alert("You can able to access your profile Soon 😌..");
  });
}


if (profileOverlay) {
  profileOverlay.addEventListener("click", (e) => {
    if (e.target === profileOverlay) {
      profileOverlay.classList.remove("show");
      if (profileMenu) profileMenu.classList.remove("show");
    }
  });
}


if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    if (modalOverlay) modalOverlay.style.display = "none";
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
}


if (togglePassBtn && passField) {
  togglePassBtn.addEventListener("click", () => {
    passField.type = passField.type === "password" ? "text" : "password";
  });
}


if (switchModeBtn) {
  switchModeBtn.addEventListener("click", () => {
    isSignup = !isSignup;

    if (isSignup) {
      authTitle.textContent = "Create account";
      authSub.textContent = "Create your zENO account in seconds.";
      submitBtn.textContent = "Sign up";

      switchText.textContent = "Already have an account?";
      switchModeBtn.textContent = "Sign in";

      if (nameWrap) nameWrap.style.display = "block";
      if (loginRow) loginRow.style.display = "none";

      if (nameField) {
        nameField.required = true;
        nameField.focus();
      }
    } else {
      authTitle.textContent = "Sign in";
      authSub.textContent = "Use your zENO account to continue.";
      submitBtn.textContent = "Sign in";

      switchText.textContent = "Don’t have an account?";
      switchModeBtn.textContent = "Sign up";

      if (nameWrap) nameWrap.style.display = "none";
      if (loginRow) loginRow.style.display = "flex";

      if (nameField) nameField.required = false;
      if (emailField) emailField.focus();
    }
  });
}


if (authForm) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!supabaseClient || !supabaseClient.auth) {
      alert("Supabase client not initialized.");
      return;
    }

    const email = emailField ? emailField.value.trim() : "";
    const pass = passField ? passField.value.trim() : "";
    const name = nameField ? nameField.value.trim() : "";

    if (isSignup && name.length < 2) {
      alert("Enter your name properly 😄");
      return;
    }

    if (!email || !pass) {
      alert("Email and password required ✅");
      return;
    }

    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isSignup ? "Signing up..." : "Signing in...";
    }

    try {
      let shouldClose = false;

      if (isSignup) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: pass,
          options: {
            data: { full_name: name }
          }
        });

        if (error) throw error;

        if (!data.session) {
          alert("Check your email to confirm your account.");
        } else {
          shouldClose = true;
          alert("✅ Logged in successfully!");
        }
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: pass
        });

        if (error) throw error;

        shouldClose = true;
        alert("✅ Logged in successfully!");
      }

      if (shouldClose) {
        if (modalOverlay) modalOverlay.style.display = "none";
        authForm.reset();
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.message || "Authentication failed.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

if (forgotBtn) {
  forgotBtn.addEventListener("click", () => {
    alert("🔐 Password reset feature coming soon!");
  });
}


if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    clearLocalUser();

    if (profileOverlay) profileOverlay.classList.remove("show");
    if (profileMenu) profileMenu.classList.remove("show");

    if (supabaseClient && supabaseClient.auth) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error("Supabase signOut error:", err);
      }
    }

    alert("✅ Logged out!");

    if (modalOverlay) modalOverlay.style.display = "flex";
    if (emailField) emailField.focus();
  });
}

const ordersBtn = document.getElementById("upgradeBtn");
const addressBtn = document.getElementById("personalBtn");

if (ordersBtn) {
  ordersBtn.addEventListener("click", () => {
    window.location.href = "orders.html";
  });
}

if (addressBtn) {
  addressBtn.addEventListener("click", () => {
    window.location.href = "address.html";
  });
}

const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}


const googleBtn = document.getElementById("googleSignIn");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    if (!supabaseClient || !supabaseClient.auth) {
      alert("Supabase client not initialized.");
      return;
    }

    const redirectTo = getAuthRedirectUrl();

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo }
    });

    if (error) {
      console.error("Google Sign-In error:", error);
      alert(error.message);
    }
  });
}

// data base
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bbvstwqpsskiscgkquxs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidnN0d3Fwc3NraXNjZ2txdXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjAwMjEsImV4cCI6MjA4NjMzNjAyMX0.ETwCuwTOLifP2cBhcH-2iy4re4AZRpzfMIcxr971AYY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const user = JSON.parse(localStorage.getItem("zenoUser"));
if (user) {
  alert("⚠️ Please login to add address.");
  window.location.href = "index.html";
}

const STORE_LAT = 13.024206;
const STORE_LNG = 77.706110;

const DELIVERY_RADIUS_KM = 1;


const useLocationBtn = document.getElementById("useLocationBtn");
const clearLocationBtn = document.getElementById("clearLocationBtn");
const mapFrame = document.getElementById("mapFrame");

const form = document.getElementById("addressForm");
const savedMsg = document.getElementById("savedMsg");

const latField = document.getElementById("lat");
const lngField = document.getElementById("lng");

const addressFormWrap = document.getElementById("addressFormWrap");
const savedCard = document.getElementById("savedCard");
const editAddressBtn = document.getElementById("editAddressBtn");

const savedName = document.getElementById("savedName");
const savedPhone = document.getElementById("savedPhone");
const savedCity = document.getElementById("savedCity");
const savedPincode = document.getElementById("savedPincode");
const savedAddressText = document.getElementById("savedAddressText");


function getDistanceInKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


function updateMap(lat, lng) {
  const url = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  mapFrame.src = url;
}


function showSavedCard(data) {
  if (!data) return;

  savedName.textContent = data.fullName || "—";
  savedPhone.textContent = data.phone || "—";
  savedCity.textContent = data.city || "—";
  savedPincode.textContent = data.pincode || "—";
  savedAddressText.textContent = data.address || "—";

  addressFormWrap.style.display = "none";
  savedCard.style.display = "block";
}


function showFormMode() {
  savedCard.style.display = "none";
  addressFormWrap.style.display = "block";
}


const savedAddress = JSON.parse(localStorage.getItem("zenoAddress"));

if (savedAddress) {
  document.getElementById("fullName").value = savedAddress.fullName || "";
  document.getElementById("phone").value = savedAddress.phone || "";
  document.getElementById("city").value = savedAddress.city || "";
  document.getElementById("pincode").value = savedAddress.pincode || "";
  document.getElementById("address").value = savedAddress.address || "";

  latField.value = savedAddress.lat || "";
  lngField.value = savedAddress.lng || "";

  showSavedCard(savedAddress);

  if (savedAddress.lat && savedAddress.lng) {
    updateMap(savedAddress.lat, savedAddress.lng);
    useLocationBtn.textContent = "✔️ Location Added";
  }
}


if (editAddressBtn) {
  editAddressBtn.addEventListener("click", () => {
    showFormMode();
  });
}


if (useLocationBtn) {
  useLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("❌ GPS not supported in your browser.");
      return;
    }

    useLocationBtn.textContent = "📍 Detecting...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        latField.value = lat;
        lngField.value = lng;

        const existing = JSON.parse(localStorage.getItem("zenoAddress")) || {};

localStorage.setItem("zenoAddress", JSON.stringify({
  ...existing,
  lat,
  lng
}));


        updateMap(lat, lng);

        const distance = getDistanceInKm(STORE_LAT, STORE_LNG, lat, lng);

        if (distance <= DELIVERY_RADIUS_KM) {
          savedMsg.textContent = `✔️ Delivery available! (${distance.toFixed(1)} km away)`;
        } else {
          savedMsg.textContent = `❌ Delivery not available (${distance.toFixed(1)} km away). We deliver within ${DELIVERY_RADIUS_KM} km.`;
        }

        useLocationBtn.textContent = "✔️ Location Added";
      },
      () => {
        useLocationBtn.textContent = "📍 Use my location";
        alert("❌ Location permission denied!");
      }
    );
  });
}


if (clearLocationBtn) {
  clearLocationBtn.addEventListener("click", () => {

    // Clear only location fields
    latField.value = "";
    lngField.value = "";

    // Remove lat/lng from localStorage but keep other data
    const existing = JSON.parse(localStorage.getItem("zenoAddress")) || {};

    delete existing.lat;
    delete existing.lng;

    localStorage.setItem("zenoAddress", JSON.stringify(existing));

    // Reset map to store
    updateMap(STORE_LAT, STORE_LNG);

    savedMsg.textContent = "";
    useLocationBtn.textContent = "📍 Use my location";
  });
}



if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const userLat = parseFloat(latField.value);
    const userLng = parseFloat(lngField.value);

    // if (!userLat || !userLng) {
    //   alert("⚠️ Please click 'Use my location' to check delivery availability.");
    //   return;
    // }

    const distance = getDistanceInKm(STORE_LAT, STORE_LNG, userLat, userLng);

    if (distance > DELIVERY_RADIUS_KM) {
      alert(
        `❌ Sorry! Delivery not available.\n\n📍 You are ${distance.toFixed(
          1
        )} km away.\n✔️ We deliver only within ${DELIVERY_RADIUS_KM} km for now.`
      );
      return;
    }

    const data = {
      fullName: document.getElementById("fullName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      city: document.getElementById("city").value.trim(),
      pincode: document.getElementById("pincode").value.trim(),
      address: document.getElementById("address").value.trim(),
      lat: userLat,
      lng: userLng,
    };

    localStorage.setItem("zenoAddress", JSON.stringify(data));

    showSavedCard(data);

    alert("✔️ Address saved successfully!");
  });
}
// =========================
// CONTINUE BUTTON LOGIC
// =========================
const continueBtn = document.getElementById("continueBtn");

if (continueBtn) {
  continueBtn.addEventListener("click", async () => {

    const addressData = JSON.parse(localStorage.getItem("zenoAddress"));
    const orders = JSON.parse(localStorage.getItem("zenoOrders")) || [];

    if (!addressData) {
  alert("⚠️ Please save your address before continuing.");
  return;
}

if (!addressData.lat || !addressData.lng) {
  alert("⚠️ Please click 'Use my location' before continuing.");
  return;
}



    if (orders.length === 0) {
      alert("⚠️ No order found. Please add items first.");
      return;
    }

    const latestOrder = orders[orders.length - 1];

    const finalOrder = {
      customer: {
        fullName: addressData.fullName,
        phone: addressData.phone,
        city: addressData.city,
        pincode: addressData.pincode,
        address: addressData.address,
        lat: addressData.lat,
        lng: addressData.lng,
      },
      order: {
        items: latestOrder.items,
        total: latestOrder.total,
        time: new Date().toLocaleString(),
      },
    };

    try {
      const { error } = await supabase
        .from("orders")
        .insert([
          {
            customer: finalOrder.customer,
            order_data: finalOrder.order,
            status: "pending"
          }
        ]);

      if (error) {
  console.error(error);
  alert("❌ Failed to place order.");
  return;
}

// 🔔 Trigger Telegram
await fetch("https://bbvstwqpsskiscgkquxs.functions.supabase.co/rapid-service", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    customer: finalOrder.customer,
    order_data: finalOrder.order
  })
});

showSuccessPopup();


    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    }

  });
}

// =========================
// SUCCESS POPUP
// =========================

function showSuccessPopup() {

  const sound = document.getElementById("successSound");
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

if (sound) {
  sound.play();
}
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(255,255,255,0.95)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  overlay.innerHTML = `
    <style>
      .success-card {
        width: min(420px, 90%);
        background: #fff;
        border-radius: 28px;
        padding: 28px;
        text-align: center;
        box-shadow: 0 30px 70px rgba(0,0,0,0.15);
        animation: pop 0.25s ease;
      }

      @keyframes pop {
        from {
          transform: translateY(12px) scale(0.96);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      .tick {
        width: 82px;
        height: 82px;
      }

      .tick-circle {
        stroke: #01ff09;
        stroke-width: 4;
        stroke-dasharray: 160;
        stroke-dashoffset: 160;
        animation: circleDraw 0.7s ease forwards;
      }

      .tick-check {
        stroke: #33ff00;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 60;
        stroke-dashoffset: 60;
        animation: checkDraw 0.45s ease forwards;
        animation-delay: 0.6s;
      }

      @keyframes circleDraw {
        to { stroke-dashoffset: 0; }
      }

      @keyframes checkDraw {
        to { stroke-dashoffset: 0; }
      }
    </style>

    <div class="success-card">
      <div style="display:flex; justify-content:center;">
        <svg class="tick" viewBox="0 0 52 52">
          <circle class="tick-circle" cx="26" cy="26" r="24" fill="none"/>
          <path class="tick-check" fill="none" d="M14 27 L22 35 L38 18"/>
        </svg>
      </div>

      <h2 style="font-size:24px; font-weight:800; margin-top:14px;">
        Order Placed
      </h2>

      <p style="margin-top:8px; font-size:14px; opacity:0.7;">
        We will call you for 2-step confirmation 📞
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  // ⏳ Redirect to home after animation
  setTimeout(() => {
    window.location.href = "index.html";
  }, 4000);
}






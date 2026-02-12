import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bbvstwqpsskiscgkquxs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidnN0d3Fwc3NraXNjZ2txdXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjAwMjEsImV4cCI6MjA4NjMzNjAyMX0.ETwCuwTOLifP2cBhcH-2iy4re4AZRpzfMIcxr971AYY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const container = document.getElementById("ordersContainer");

async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = "";

  data.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const statusClass = order.status === "confirmed" ? "confirmed" : "pending";

    card.innerHTML = `
      <h3>${order.customer.fullName || order.customer.name}</h3>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>City:</strong> ${order.customer.city}</p>
      <p><strong>Items:</strong> ${JSON.stringify(order.order_data.items)}</p>
      <p><strong>Total:</strong> ₹${order.order_data.total}</p>
      <p><strong>Time:</strong> ${new Date(order.created_at).toLocaleString()}</p>
      <span class="status ${statusClass}">
        ${order.status}
      </span>
      <br/>
      <button onclick="confirmOrder('${order.id}')">
        Mark as Confirmed
      </button>
    `;

    container.appendChild(card);
  });
}

window.confirmOrder = async function(id) {
  await supabase
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", id);

  loadOrders();
};

loadOrders();

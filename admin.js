import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bbvstwqpsskiscgkquxs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidnN0d3Fwc3NraXNjZ2txdXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjAwMjEsImV4cCI6MjA4NjMzNjAyMX0.ETwCuwTOLifP2cBhcH-2iy4re4AZRpzfMIcxr971AYY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "admin-login.html";
}
if (session.user.email !== "sumanth00121@gmail.com") {
  alert("Access denied");
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

const container = document.getElementById("ordersContainer");

const summary = document.getElementById("summary");

async function loadOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  let totalRevenue = 0;
let pendingCount = 0;
let confirmedCount = 0;
let deliveredCount = 0;

data.forEach(order => {
  totalRevenue += order.order_data.total;

  if (order.status === "pending") pendingCount++;
  if (order.status === "confirmed") confirmedCount++;
  if (order.status === "delivered") deliveredCount++;
});

summary.innerHTML = `
  <div><strong>Total Orders:</strong> ${data.length}</div>
  <div><strong>Total Revenue:</strong> ₹${totalRevenue}</div>
  <div><strong>Pending:</strong> ${pendingCount}</div>
  <div><strong>Confirmed:</strong> ${confirmedCount}</div>
  <div><strong>Delivered:</strong> ${deliveredCount}</div>
`;


  container.innerHTML = "";

  data.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    let statusClass = "pending";
    if (order.status === "confirmed") statusClass = "confirmed";
    if (order.status === "delivered") statusClass = "delivered";

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

      <br/><br/>

      <button onclick="updateStatus('${order.id}', 'confirmed')">
        Confirm
      </button>

      <button onclick="updateStatus('${order.id}', 'delivered')">
        Delivered
      </button>

      <button onclick="deleteOrder('${order.id}')" style="background:#dc3545;">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

window.updateStatus = async function(id, newStatus) {
  await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", id);

  loadOrders();
};

window.deleteOrder = async function(id) {
  const confirmDelete = confirm("Are you sure you want to delete this order?");
  if (!confirmDelete) return;

  await supabase
    .from("orders")
    .delete()
    .eq("id", id);
  loadOrders();
};

loadOrders();
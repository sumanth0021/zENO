import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://bbvstwqpsskiscgkquxs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidnN0d3Fwc3NraXNjZ2txdXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjAwMjEsImV4cCI6MjA4NjMzNjAyMX0.ETwCuwTOLifP2cBhcH-2iy4re4AZRpzfMIcxr971AYY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.login = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Invalid login");
    return;
  }

  window.location.href = "admin.html";
};

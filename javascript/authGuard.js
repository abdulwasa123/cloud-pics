const SUPABASE_URL = "https://ltuoxjnbknwutuclsjqy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dW94am5ia253dXR1Y2xzanF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTQ2NjEsImV4cCI6MjA3MDY5MDY2MX0.hWrDsgTddY2wyFUijYYI8rGvSwtsVt5ZwD4y1I8sZiE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Page routes
const loginPage = "/login/";
const appPage   = "/";

// Auth Guard
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  const currentPath = window.location.pathname;

  if (!user && currentPath !== loginPage) {
    // 🚪 Not logged in → force to login
    window.location.href = loginPage;
  
  } else if (user && currentPath === loginPage) {
    window.location.href = appPage;

  } else {
    // ✅ Allow rendering
    document.body.classList.remove("hidden");
  }
})();

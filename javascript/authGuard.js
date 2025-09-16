import { supabase } from "./supabase.js";
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

// supabase.js

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ltuoxjnbknwutuclsjqy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dW94am5ia253dXR1Y2xzanF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTQ2NjEsImV4cCI6MjA3MDY5MDY2MX0.hWrDsgTddY2wyFUijYYI8rGvSwtsVt5ZwD4y1I8sZiE";

// Export ONE supabase client for the whole app
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

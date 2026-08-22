import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uiktjxmmionakjsmrcde.supabase.co";
const supabaseAnonKey = "sb_publishable_g4xH66znwHjHhNA64bieCA_si77mZiT";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
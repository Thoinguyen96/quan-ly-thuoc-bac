import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nrtbjhqgqsyqvexvtufj.supabase.co";
const supabaseKey = "sb_publishable_s1pyEPF4u4m5dlSPEm1ckQ_-44CAWww";

export const supabase = createClient(supabaseUrl, supabaseKey);

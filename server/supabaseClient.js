require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL or Service Role Key is missing. Supabase features will not work.');
  // Create a dummy client that will throw errors only when used
  supabase = {
    from: () => ({ select: async () => { throw new Error('Supabase not configured'); } }),
    auth: {},
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase;

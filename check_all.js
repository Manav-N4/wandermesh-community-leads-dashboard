import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkEverything() {
  const likelyTables = ['join_community', 'leads', 'community_leads', 'registrations', 'users', 'profiles'];
  for (const table of likelyTables) {
    const { data, count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (!error) {
      console.log(`Table "${table}" has ${count} records.`);
    } else {
      console.log(`Table "${table}" error: ${error.message}`);
    }
  }
}

checkEverything()

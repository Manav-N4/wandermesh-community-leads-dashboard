import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findTheTable() {
  // Querying information_schema.tables via postgrest is hard unless permitted.
  // We'll try to select from a bunch of likely names.
  const tables = ['join_community', 'leads', 'community_leads', 'submissions', 'signups', 'form_submissions'];
  for (const t of tables) {
    const { data, count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (!error) {
      console.log(`Table "${t}" exists with ${count} rows.`);
    }
  }
}

findTheTable()

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listTables() {
  // Try to use RPC if available, or just common names
  const { data, error } = await supabase.rpc('get_tables')
  if (error) {
    console.log('RPC get_tables failed, trying direct select on common table names...')
    const commonTables = ['join_community', 'leads', 'community_leads', 'applications', 'users', 'profiles']
    for (const table of commonTables) {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (!error) {
        console.log(`Table "${table}" exists. Record count: ${data.length}`)
        if (data.length > 0) console.log('Sample record:', data[0])
      }
    }
  } else {
    console.log('Tables:', data)
  }
}

listTables()

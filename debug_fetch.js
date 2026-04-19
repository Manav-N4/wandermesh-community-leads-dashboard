import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugData() {
  const { data, error, count } = await supabase
    .from('join_community')
    .select('*', { count: 'exact' })

  console.log('Error:', error)
  console.log('Count:', count)
  console.log('Data:', data)
}

debugData()

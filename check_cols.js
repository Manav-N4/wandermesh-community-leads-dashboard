import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkColumns() {
  const { data, error } = await supabase.from('join_community').select('*').limit(1)
  if (data && data.length > 0) {
    console.log('Available columns:', Object.keys(data[0]))
  } else {
    console.log('No data to check columns.')
  }
}

checkColumns()

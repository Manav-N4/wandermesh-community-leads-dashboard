import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getColumnNames() {
  // Querying columns might fail via anon, so we'll try a select with empty data
  const { data, error } = await supabase
    .from('join_community')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error selecting from join_community:', error)
  } else if (data && data.length > 0) {
    console.log('Columns found in record:', Object.keys(data[0]))
  } else {
    console.log('Table join_community exists but is empty.')
  }
}

getColumnNames()

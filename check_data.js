import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkMultipleTables() {
  console.log('Checking join_community...')
  const { data: joinData, error: joinError } = await supabase.from('join_community').select('*').limit(5)
  console.log('join_community sample:', joinData)

  console.log('Checking leads...')
  const { data: leadsData, error: leadsError } = await supabase.from('leads').select('*').limit(5)
  console.log('leads sample:', leadsData)
}

checkMultipleTables()

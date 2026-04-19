import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedData() {
  const filePath = '/Users/manav/Downloads/community_leads.csv'
  
  if (!fs.existsSync(filePath)) {
    console.error('CSV file not found at:', filePath)
    return
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })

  console.log(`Found ${records.length} records. Importing...`)

  // Map CSV fields to table fields if necessary
  const formattedRecords = records.map(r => ({
    full_name: r.full_name,
    phone_number: r.phone_number,
    instagram_handle: r.instagram_handle,
    created_at: r.created_at,
    // Add any extra fields as needed
    referral_code: r.referral_code
  }))

  const { data, error } = await supabase
    .from('join_community')
    .upsert(formattedRecords)

  if (error) {
    console.error('Error importing data:', error)
  } else {
    console.log('Successfully imported existing community leads!')
  }
}

seedData()

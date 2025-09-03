import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jptqxyfbvfrcmebmxmxl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdHF4eWZidmZyY21lYm14bXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjA2MzAsImV4cCI6MjA3MjQzNjYzMH0.Z9mJy_LbeJWYDX0hXuad9S06oq-gHUoZcKtGVp_9WNE'

export const supabase = createClient(supabaseUrl, supabaseKey)

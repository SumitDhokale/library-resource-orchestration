import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lrgcgfonebkggbdwfedm.supabase.co"
const supabaseKey = "sb_publishable_XckJbNYl2E_od-5BhHBBkw_jhJUy7-Q"

export const supabase = createClient(supabaseUrl, supabaseKey)
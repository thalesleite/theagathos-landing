import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

console.log("[supabase] url exists:", !!url)
console.log("[supabase] secret exists:", !!secretKey)

export const supabaseAdmin = createClient(url!, secretKey!, {
  auth: { persistSession: false },
})

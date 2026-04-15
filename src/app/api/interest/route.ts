import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase.server"
import { sendInterestConfirmation } from "@/lib/mailer"
import { z } from "zod"

const interestSchema = z.object({
  name: z.string().max(120).optional().nullable(),
  email: z.string().email(),
  city: z.string().max(120).optional().nullable(),
  titles: z.string().max(2000).optional().nullable(),
  authors: z.string().max(1000).optional().nullable(),
  inStock: z.boolean().optional().nullable(),
  onDemand: z.boolean().optional().nullable(),
  priceRange: z.string().max(40).optional().nullable(),
  preorder: z.boolean().optional().nullable(),
  instagram: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  consent: z.boolean().default(false),
})

// Rate limit simples por IP (não persiste)
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 20
const hits = new Map<string, { count: number; ts: number }>()

function rateLimit(ip: string) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now })
    return true
  }
  if (rec.count >= MAX_PER_WINDOW) return false
  rec.count += 1
  return true
}

export async function POST(req: Request) {
  // IP apenas para rate limit (não armazenamos)
  const ip =
    (
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") ||
      ""
    )
      .split(",")[0]
      .trim() || "unknown"

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const payload = interestSchema.parse(await req.json())

    // Minimização: campos opcionais normalizados para null
    const clean = {
      name: payload.name?.trim() || null,
      email: payload.email.trim(),
      city: payload.city?.trim() || null,
      titles: payload.titles?.trim() || null,
      authors: payload.authors?.trim() || null,
      in_stock: !!payload.inStock,
      on_demand: !!payload.onDemand,
      price_range: payload.priceRange || null,
      preorder: !!payload.preorder,
      instagram: payload.instagram?.trim() || null,
      notes: payload.notes?.trim() || null,
      consent: !!payload.consent, // base legal para contato
      submitted_at: new Date().toISOString(),
    }

    // Inserção no Supabase
    const { error } = await supabaseAdmin
      .from("agathos_landing_interests")
      .insert([clean])

    if (error) {
      console.error("[supabase] insert error:", error)
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 })
    }

    // Envio de e-mail apenas se houver consentimento
    if (clean.consent) {
      try {
        await sendInterestConfirmation({
          to: clean.email,
          name: clean.name || undefined,
        })
      } catch (mailErr) {
        // não falha a requisição por causa do e-mail
        console.warn("[mail] send failed:", mailErr)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Invalid payload"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

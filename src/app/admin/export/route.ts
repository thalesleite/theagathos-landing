import { NextResponse } from "next/server"
import ExcelJS from "exceljs"
import { supabaseAdmin } from "@/lib/supabase.server"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("agathos_landing_interests")
    .select("*")
    .order("submitted_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "Could not export data" },
      { status: 500 },
    )
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Agathos Interests")

  worksheet.columns = [
    { header: "Date", key: "submitted_at", width: 18 },
    { header: "Name", key: "name", width: 24 },
    { header: "Email", key: "email", width: 32 },
    { header: "City", key: "city", width: 18 },
    { header: "Titles", key: "titles", width: 50 },
    { header: "Authors", key: "authors", width: 40 },
    { header: "In Stock", key: "in_stock", width: 12 },
    { header: "On Demand", key: "on_demand", width: 12 },
    { header: "Price Range", key: "price_range", width: 14 },
    { header: "Preorder", key: "preorder", width: 12 },
    { header: "Instagram", key: "instagram", width: 22 },
    { header: "Notes", key: "notes", width: 40 },
    { header: "Consent", key: "consent", width: 12 },
  ]

  worksheet.getRow(1).font = { bold: true }

  for (const row of data ?? []) {
    worksheet.addRow({
      submitted_at: row.submitted_at
        ? new Date(row.submitted_at).toLocaleString("en-IE")
        : "",
      name: row.name ?? "",
      email: row.email ?? "",
      city: row.city ?? "",
      titles: row.titles ?? "",
      authors: row.authors ?? "",
      in_stock: row.in_stock ? "Yes" : "No",
      on_demand: row.on_demand ? "Yes" : "No",
      price_range: row.price_range ?? "",
      preorder: row.preorder ? "Yes" : "No",
      instagram: row.instagram ?? "",
      notes: row.notes ?? "",
      consent: row.consent ? "Yes" : "No",
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer as BodyInit, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="agathos-landing-responses.xlsx"',
    },
  })
}

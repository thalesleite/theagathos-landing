import { supabaseAdmin } from "@/lib/supabase.server"

type InterestRow = {
  id: string
  submitted_at: string
  name: string | null
  email: string
  city: string | null
  titles: string | null
  authors: string | null
  in_stock: boolean | null
  on_demand: boolean | null
  price_range: string | null
  preorder: boolean | null
  instagram: string | null
  notes: string | null
  consent: boolean | null
}

function splitTerms(value: string | null | undefined) {
  if (!value) return []
  return value
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildTopCounts(rows: InterestRow[], key: "titles" | "authors") {
  const map = new Map<string, number>()

  for (const row of rows) {
    for (const item of splitTerms(row[key])) {
      const normalized = item.toLowerCase()
      map.set(normalized, (map.get(normalized) ?? 0) + 1)
    }
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, count]) => ({
      label: label.replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
    }))
}

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("agathos_landing_interests")
    .select("*")
    .order("submitted_at", { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-[#FCFAF3] p-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Agathos Admin</h1>
          <p className="mt-3 text-red-600">
            Error loading dashboard: {error.message}
          </p>
        </div>
      </main>
    )
  }

  const rows = (data ?? []) as InterestRow[]

  const total = rows.length
  const preorderCount = rows.filter((r) => r.preorder).length
  const inStockCount = rows.filter((r) => r.in_stock).length
  const onDemandCount = rows.filter((r) => r.on_demand).length

  const uniqueCities = new Set(
    rows.map((r) => r.city?.trim()).filter(Boolean) as string[],
  ).size

  const topTitles = buildTopCounts(rows, "titles")
  const topAuthors = buildTopCounts(rows, "authors")

  return (
    <main className="min-h-screen bg-[#FCFAF3] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Agathos Dashboard</h1>
          <p className="text-slate-600">
            Dashboard privado das respostas da landing page.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card title="Total responses" value={String(total)} />
          <Card title="Pre-order" value={String(preorderCount)} />
          <Card title="In stock" value={String(inStockCount)} />
          <Card title="On demand" value={String(onDemandCount)} />
          <Card title="Cities" value={String(uniqueCities)} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <StatsCard title="Top requested titles" items={topTitles} />
          <StatsCard title="Top requested authors" items={topAuthors} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-lg font-semibold">Submissions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Titles</th>
                  <th className="px-4 py-3 text-left">Authors</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Pre-order</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 align-top"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(row.submitted_at).toLocaleDateString("en-IE")}
                    </td>
                    <td className="px-4 py-3">{row.name || "—"}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.city || "—"}</td>
                    <td className="px-4 py-3 max-w-xs whitespace-pre-wrap">
                      {row.titles || "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs whitespace-pre-wrap">
                      {row.authors || "—"}
                    </td>
                    <td className="px-4 py-3">{row.price_range || "—"}</td>
                    <td className="px-4 py-3">{row.preorder ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      {row.in_stock
                        ? "In stock"
                        : row.on_demand
                          ? "On demand"
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
    </div>
  )
}

function StatsCard({
  title,
  items,
}: {
  title: string
  items: { label: string; count: number }[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
            >
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import Link from "next/link"
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

function previewText(value: string | null | undefined, max = 120) {
  if (!value) return "—"
  if (value.length <= max) return value
  return value.slice(0, max).trim() + "..."
}

type AdminPageProps = {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) ?? {}
  const page = Math.max(1, Number(params.page || "1"))
  const pageSize = 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const [
    { data: allRows, error: allError, count },
    { data: pagedRows, error: pageError },
  ] = await Promise.all([
    supabaseAdmin
      .from("agathos_landing_interests")
      .select("*", { count: "exact" })
      .order("submitted_at", { ascending: false }),
    supabaseAdmin
      .from("agathos_landing_interests")
      .select("*")
      .order("submitted_at", { ascending: false })
      .range(from, to),
  ])

  const error = allError || pageError

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

  const rows = (pagedRows ?? []) as InterestRow[]
  const all = (allRows ?? []) as InterestRow[]

  const total = count ?? all.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const preorderCount = all.filter((r) => r.preorder).length
  const inStockCount = all.filter((r) => r.in_stock).length
  const onDemandCount = all.filter((r) => r.on_demand).length

  const uniqueCities = new Set(
    all.map((r) => r.city?.trim()).filter(Boolean) as string[],
  ).size

  const topTitles = buildTopCounts(all, "titles")
  const topAuthors = buildTopCounts(all, "authors")

  return (
    <main className="min-h-screen bg-[#FCFAF3] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agathos Dashboard</h1>
            <p className="text-slate-600">
              Dashboard privado das respostas da landing page.
            </p>
          </div>

          <a
            href="/admin/export"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Download Excel
          </a>
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

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">Submissions</h2>
              <p className="text-sm text-slate-500">
                Showing {from + 1}-{Math.min(from + pageSize, total)} of {total}
              </p>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
              No submissions yet.
            </div>
          ) : (
            rows.map((row) => (
              <article
                key={row.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        {new Date(row.submitted_at).toLocaleDateString("en-IE")}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {row.name || "Anonymous"}
                      </h3>
                      <p className="text-sm text-slate-600">{row.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {row.city ? <Badge>{row.city}</Badge> : null}
                      {row.price_range ? (
                        <Badge>{row.price_range}</Badge>
                      ) : null}
                      {row.preorder ? (
                        <Badge variant="success">Pre-order</Badge>
                      ) : (
                        <Badge variant="muted">No pre-order</Badge>
                      )}
                      {row.in_stock ? (
                        <Badge variant="brand">In stock</Badge>
                      ) : null}
                      {row.on_demand ? (
                        <Badge variant="warning">On demand</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <InfoBlock
                      title="Titles preview"
                      content={previewText(row.titles, 180)}
                    />
                    <InfoBlock
                      title="Authors preview"
                      content={previewText(row.authors, 160)}
                    />
                  </div>

                  <details className="group rounded-xl border border-slate-200 bg-slate-50 open:bg-white">
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-700 flex items-center justify-between">
                      <span>View full details</span>
                      <span className="text-slate-400 transition group-open:rotate-180">
                        ▼
                      </span>
                    </summary>

                    <div className="border-t border-slate-200 px-4 py-4 space-y-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <DetailBlock
                          title="Requested titles"
                          content={row.titles || "—"}
                        />
                        <DetailBlock
                          title="Preferred authors"
                          content={row.authors || "—"}
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <DetailBlock
                          title="Instagram"
                          content={row.instagram || "—"}
                        />
                        <DetailBlock title="Notes" content={row.notes || "—"} />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <MiniStat
                          label="Consent"
                          value={row.consent ? "Yes" : "No"}
                        />
                        <MiniStat
                          label="Pre-order"
                          value={row.preorder ? "Yes" : "No"}
                        />
                        <MiniStat
                          label="In stock"
                          value={row.in_stock ? "Yes" : "No"}
                        />
                        <MiniStat
                          label="On demand"
                          value={row.on_demand ? "Yes" : "No"}
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </article>
            ))
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/admin?page=${Math.max(1, page - 1)}`}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  page === 1
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Previous
              </Link>

              <p className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </p>

              <Link
                href={`/admin?page=${Math.min(totalPages, page + 1)}`}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  page === totalPages
                    ? "pointer-events-none bg-slate-100 text-slate-400"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Next
              </Link>
            </div>
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

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "brand" | "muted"
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    brand: "bg-cyan-100 text-cyan-700",
    muted: "bg-slate-200 text-slate-600",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  )
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
    </div>
  )
}

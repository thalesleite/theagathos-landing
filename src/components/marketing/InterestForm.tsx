"use client"

import { useState } from "react"

type Payload = {
  name?: string
  email: string
  city?: string
  titles?: string
  authors?: string
  inStock?: boolean
  onDemand?: boolean
  priceRange?: string
  preorder?: boolean
  instagram?: string
  notes?: string
  consent?: boolean
}

export default function InterestForm() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const payload: Payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      city: String(form.get("city") || ""),
      titles: String(form.get("titles") || ""),
      authors: String(form.get("authors") || ""),
      inStock: form.get("inStock") === "on",
      onDemand: form.get("onDemand") === "on",
      priceRange: String(form.get("priceRange") || ""),
      preorder: form.get("preorder") === "on",
      instagram: String(form.get("instagram") || ""),
      notes: String(form.get("notes") || ""),
      consent: form.get("consent") === "on",
    }

    if (!payload.email) {
      setErr("Por favor, informe um e-mail válido.")
      setLoading(false)
      return
    }
    if (!payload.consent) {
      setErr("Você precisa aceitar o uso dos dados para contato.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Não foi possível enviar seu interesse.")
      }
      window.location.href = "/thanks"
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message || "Algo deu errado. Tente novamente.")
      } else {
        setErr("Algo deu errado. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-muted mb-1">Nome</label>
          <input name="name" className="input" placeholder="Nome" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="input"
            placeholder="nome@mail.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-muted mb-1">Cidade</label>
          <input name="city" className="input" placeholder="Dublin, Cork..." />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            Instagram (opcional)
          </label>
          <input name="instagram" className="input" placeholder="@seuuser" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">
          Diga quais títulos de livros você gostaria de ver na livraria?
        </label>
        <textarea
          name="titles"
          className="input"
          rows={3}
          placeholder="Liste 3 a 5 livros que você compraria"
        />
        <p className="text-xs text-muted mt-1">
          Ex.: A Hora da Estrela; Ensaio sobre a Cegueira; O Senhor do Mundo…
        </p>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">
          Autores preferidos
        </label>
        <input
          name="authors"
          className="input"
          placeholder="Ex.: Clarice Lispector, José Saramago, Chesterton…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-muted mb-1">Interesse</label>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="inStock" /> Estoque local (entrega
              rápida)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="onDemand" /> Sob encomenda (Brasil)
            </label>
          </div>
          <p className="text-xs text-muted mt-1">
            Sob encomenda: prazo maior e frete diferenciado.
          </p>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">
            Faixa de preço
          </label>
          <select name="priceRange" className="input">
            <option value="">Escolher…</option>
            <option value="<=15">Até €15</option>
            <option value="15-25">€15–€25</option>
            <option value="25-40">€25–€40</option>
            <option value=">40">Mais de €40</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="preorder" /> Aceito pré-venda (quero
          garantir o meu)
        </label>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1">Comentários</label>
        <textarea
          name="notes"
          className="input"
          rows={3}
          placeholder="Alguma observação de capa/edição, formato, coleção…"
        />
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" name="consent" className="mt-1" />
        <p className="text-sm text-muted">
          Concordo em receber novidades da The Agathos Bookstore. Usaremos seus
          dados apenas para o lançamento.
        </p>
      </div>

      {/* Errors */}
      <div aria-live="polite" className="min-h-[1.25rem]">
        {err && <p className="text-sm text-rose-600">{err}</p>}
      </div>

      <button disabled={loading} className="btn btn-primary btn-full">
        {loading ? "Enviando…" : "Enviar minhas sugestões"}
      </button>
    </form>
  )
}

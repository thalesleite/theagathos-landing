import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type SendArgs = {
  to: string
  name?: string
}

export async function sendInterestConfirmation({ to, name }: SendArgs) {
  const from = process.env.RESEND_FROM!
  const replyTo = process.env.RESEND_REPLY_TO || "thalesaleite@gmail.com"

  const first = (name || "").trim().split(/\s+/)[0]
  const greet = first ? `Olá, ${first}!` : "Olá!"

  const subject = "Recebemos suas sugestões 📚 (+10% no lançamento)"
  const text = `${greet}

Obrigado por participar da construção da Agathos Books — a livraria para quem ama o verdadeiro, o bom e o belo.

Quando lançarmos o catálogo, você receberá seu cupom de 10% e o aviso dos títulos mais pedidos.

Se não quiser receber futuros e-mails, é só responder “unsubscribe”.
—
Agathos Books — Livros em português, direto pra Irlanda 🇮🇪
`

  const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f7faf9;padding:24px;color:#111;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
      <div style="padding:20px 20px 0 20px;text-align:center">
        <div style="display:inline-block;padding:6px 10px;border:1px solid #e5e7eb;border-radius:999px;font-size:12px;color:#0b8585;background:#f2fbf6">Agathos Books</div>
        <h1 style="margin:12px 0 6px 0;font-size:22px;line-height:1.3">Recebemos suas sugestões 📚</h1>
        <p style="margin:0 0 18px 0;color:#334155;font-size:14px">Em breve, seu cupom de 10% no lançamento.</p>
      </div>
      <div style="padding:0 20px 20px 20px">
        <p style="font-size:14px;line-height:1.6;color:#111;margin:0 0 12px 0">${greet} Obrigado por participar da construção da Agathos Books — a livraria para quem ama o verdadeiro, o bom e o belo.</p>
        <p style="font-size:14px;line-height:1.6;color:#111;margin:0 0 12px 0">Quando lançarmos o catálogo, você receberá seu cupom de <strong>10%</strong> e o aviso dos títulos mais pedidos.</p>
        <p style="font-size:12px;color:#64748b;margin:14px 0 0 0">Não quer receber e-mails? Responda este e-mail com <strong>“unsubscribe”</strong>.</p>
      </div>
      <div style="padding:14px 20px;background:#fcfdfc;border-top:1px solid #e5e7eb;color:#475569;font-size:12px;text-align:center">
        Agathos Books — Livros em português, direto pra Irlanda 🇮🇪 •
        <a href="mailto:${replyTo}" style="color:#0b8585;text-decoration:underline">${replyTo}</a>
      </div>
    </div>
  </div>`

  await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
    replyTo,
    headers: {
      "List-Unsubscribe": `<mailto:${replyTo}>`,
    },
  })
}

import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Pill } from "@/components/ui/Pills"

export default function ThanksPage() {
  return (
    <main>
      <Section className="pt-14 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Content */}
            <div className="p-6 sm:p-8 space-y-4 text-center">
              <div className="flex justify-center">
                <Pill>Obrigado por construir a The Agathos Bookstore 💛</Pill>
              </div>

              <h1 className="text-3xl font-bold">
                Obrigado por fazer parte da The Agathos Bookstore 🎉
              </h1>

              <p className="text-slate-700">
                Recebemos suas sugestões — elas vão guiar o primeiro lote de
                títulos em português aqui na Irlanda. Assim que o catálogo
                abrir, você receberá por e-mail seu{" "}
                <strong>cupom de 10%</strong> para comprar antes de todo mundo.
              </p>

              {/* Mini checklist */}
              <ul className="mx-auto max-w-md text-left text-slate-700 space-y-2">
                <li className="flex gap-2">
                  <span aria-hidden>✅</span>
                  <span>Seu interesse foi registrado com sucesso.</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>✅</span>
                  <span>
                    Vamos priorizar os livros mais pedidos pela comunidade.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden>✅</span>
                  <span>Enviaremos novidades e o cupom no lançamento.</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href="https://thalesleitedev.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Ver meu portfólio
                </a>

                <a
                  href="https://instagram.com/thalesleite.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  aria-label="Abrir Instagram do Thales Leite"
                >
                  Seguir @thalesleite.dev
                </a>

                <Link href="/" className="btn btn-outline">
                  Voltar à página inicial
                </Link>
              </div>

              {/* Small note */}
              <p className="text-xs text-slate-500 pt-2">
                Dúvidas ou indicações extras? Escreva para{" "}
                <a
                  className="underline hover:no-underline"
                  href="mailto:thalesaleite@gmail.com"
                >
                  thalesaleite@gmail.com
                </a>
                . Usaremos seus dados apenas para o lançamento e você pode sair
                da lista a qualquer momento.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}

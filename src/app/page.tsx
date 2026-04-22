// src/app/page.tsx
import Link from "next/link"
import InterestForm from "@/components/marketing/InterestForm"
import { Benefits } from "@/components/marketing/Benefits"
import { Steps } from "@/components/marketing/Steps"
import { SocialProof } from "@/components/marketing/SocialProof"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { Pill } from "@/components/ui/Pills"

export default function LandingPage() {
  return (
    <main>
      {/* HERO */}
      <Section className="hero section pt-12 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Pill>
              Entrega local · Curadoria independente · Sem taxas surpresa
            </Pill>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Livros em português, do Brasil direto pra Irlanda 🇮🇪
            </h1>

            <p className="text-muted">
              Estou montando o primeiro catálogo da Agathos Books — uma livraria
              feita para quem ama o verdadeiro, o bom e o belo. Diga quais
              livros você quer ver por aqui e ganhe{" "}
              <strong>10% de desconto</strong> no lançamento.
            </p>

            <div className="flex justify-center">
              <Link href="#interesse" className="cta">
                Quero indicar meus livros 📚
              </Link>
            </div>

            <p className="text-xs text-muted">
              Entrega local, curadoria seleção cuidadosa, sem taxas surpresa.
            </p>
          </div>
        </Container>
      </Section>

      {/* BENEFÍCIOS */}
      <Benefits />

      {/* COMO FUNCIONA */}
      <Steps />

      {/* FORMULÁRIO */}
      <Section id="interesse" className="section">
        <Container>
          <h2 className="text-lg font-semibold mb-2">
            Ajude a montar o catálogo da The Agathos Bookstore ✍️
          </h2>
          <p className="text-sm text-muted mb-4">
            Leva 1 minuto. Você recebe 10% de desconto no lançamento.
          </p>
          <InterestForm />
        </Container>
      </Section>

      {/* PROVA SOCIAL */}
      <SocialProof />

      {/* RODAPÉ */}
      <footer className="py-6">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center space-y-2">
            <p className="text-slate-700">
              Desenvolvido por <span className="font-medium">Thales Leite</span>{" "}
              — iniciativa independente
            </p>

            <p className="text-sm text-slate-600 space-x-2">
              <a
                className="underline hover:no-underline"
                href="mailto:thalesaleite@gmail.com"
              >
                📧 thalesaleite@gmail.com
              </a>
              <span>·</span>
              <a
                className="underline hover:no-underline"
                href="https://www.instagram.com/thalesleite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                📸 @thalesleite.dev
              </a>
              <span>·</span>
              <a
                className="underline hover:no-underline"
                href="https://thalesleitedev.com/"
                target="_blank"
                rel="noreferrer"
              >
                🌐 thalesleitedev.com
              </a>
            </p>

            <p className="text-xs text-slate-500">
              Os seus dados serão utilizados exclusivamente para lhe avisar do
              lançamento. A opção de sair da lista estará sempre disponível.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  )
}

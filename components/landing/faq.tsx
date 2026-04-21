const faqs = [
  {
    question: "O Pappi serve só para delivery?",
    answer:
      "Não. O Pappi foi pensado para delivery, food service e operações comerciais que precisam organizar pedidos, estoque, financeiro e rotina operacional em um só lugar.",
  },
  {
    question: "Preciso trocar tudo o que já uso hoje?",
    answer:
      "Não necessariamente. A ideia do Pappi é evoluir a operação com clareza, permitindo integrar processos e substituir etapas soltas conforme o negócio ganha maturidade.",
  },
  {
    question: "O sistema ajuda apenas com relatórios?",
    answer:
      "Não. Além de dashboards e relatórios, o Pappi ajuda no operacional do dia a dia com alertas, automações e leitura mais prática do que está acontecendo na loja.",
  },
  {
    question: "É útil para operação pequena também?",
    answer:
      "Sim. O produto foi desenhado para ser simples de usar em operações menores e robusto o suficiente para acompanhar crescimento sem virar um sistema pesado.",
  },
]

export function LandingFaq() {
  return (
    <section className="border-y border-border bg-background py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-background px-4 py-1 text-sm font-medium text-primary shadow-sm">
            FAQ
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Perguntas que normalmente aparecem antes da decisão.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            Respostas objetivas para quem quer entender se o Pappi faz sentido para a operação.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-[28px] border border-border bg-muted p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

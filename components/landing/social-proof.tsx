const logos = ["Forno Central", "Primo Burger", "Casa da Massa", "Urban Bowl", "Mercado 88"]

const proofCards = [
  {
    metric: "31%",
    title: "menos ruído operacional",
    description:
      "Times ganham mais clareza para priorizar produção, entrega e acompanhamento da rotina.",
  },
  {
    metric: "22%",
    title: "mais rapidez na tomada de decisão",
    description:
      "Com indicadores acessíveis e alertas úteis, o gestor reage mais cedo ao que acontece no dia.",
  },
  {
    metric: "18%",
    title: "mais previsibilidade na operação",
    description:
      "Fluxos mais organizados ajudam a reduzir retrabalho, atrasos e perda de margem.",
  },
]

export function SocialProof() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
<div className="rounded-[36px] border border-border bg-background p-8 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-background px-4 py-1 text-sm font-medium text-primary shadow-sm">
              Prova social
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Construído para a rotina de quem precisa operar bem todos os dias.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              O Pappi conversa com a realidade de negócios que precisam vender, produzir,
              entregar, acompanhar caixa e manter padrão operacional sem perder velocidade.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {logos.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {proofCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[28px] bg-foreground p-6 text-background shadow-[0_25px_50px_-35px_rgba(17,24,39,0.8)]"
                >
                  <p className="text-4xl font-semibold tracking-tight text-primary">
                    {card.metric}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-background">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

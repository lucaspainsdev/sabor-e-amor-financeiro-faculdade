import Link from "next/link";
import { hojeISO, resumoDoDia } from "@/lib/data";
import { formatarDataBR } from "@/lib/formato";
import CardResumo from "@/components/CardResumo";

export default async function DashboardPage() {
  const hoje = hojeISO();
  const resumo = await resumoDoDia(hoje);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-verde">Hoje, {formatarDataBR(hoje)}</h1>
        <p className="text-foreground/70">Resumo do dia</p>
      </div>

      <Link
        href="/despesa"
        className="rounded-2xl bg-vermelho text-white text-center font-bold text-lg py-5 hover:bg-vermelho-escuro transition-colors"
      >
        🥬 Lançar despesa do mercado
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CardResumo titulo="Vendas hoje" valor={resumo.totalVendas} cor="verde" />
        <CardResumo titulo="Despesas hoje" valor={resumo.totalDespesas} cor="vermelho" />
        <CardResumo titulo="Saldo do dia" valor={resumo.saldo} cor="amarelo" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/venda"
          className="rounded-2xl border-2 border-verde-claro bg-white text-verde text-center font-medium py-4 hover:bg-verde-claro transition-colors"
        >
          💰 Lançar venda do dia
        </Link>
        <Link
          href="/fechamento"
          className="rounded-2xl border-2 border-verde-claro bg-white text-verde text-center font-medium py-4 hover:bg-verde-claro transition-colors"
        >
          🧾 Fechar caixa
        </Link>
      </div>

      {resumo.lancamentos.length > 0 && (
        <div>
          <h2 className="font-bold text-verde mb-2">Lançamentos de hoje</h2>
          <ul className="flex flex-col gap-2">
            {resumo.lancamentos.map((lancamento) => (
              <li
                key={lancamento.id}
                className="flex items-center justify-between rounded-xl border border-verde-claro bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-verde">
                    {lancamento.categoria}
                    {lancamento.descricao ? ` — ${lancamento.descricao}` : ""}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {lancamento.forma_pagamento}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    lancamento.tipo === "venda" ? "text-verde" : "text-vermelho-escuro"
                  }`}
                >
                  {lancamento.tipo === "venda" ? "+" : "-"}
                  {Number(lancamento.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

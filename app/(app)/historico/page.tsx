import Link from "next/link";
import { redirect } from "next/navigation";
import { excluirLancamento, hojeISO, listarLancamentos } from "@/lib/data";
import { formatarDataBR, formatarReais } from "@/lib/formato";

async function excluirAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const dataInicio = String(formData.get("dataInicio") ?? "");
  const dataFim = String(formData.get("dataFim") ?? "");
  await excluirLancamento(id);
  redirect(`/historico?dataInicio=${dataInicio}&dataFim=${dataFim}`);
}

function inicioDoMes(): string {
  const hoje = hojeISO();
  return `${hoje.slice(0, 7)}-01`;
}

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ dataInicio?: string; dataFim?: string }>;
}) {
  const params = await searchParams;
  const dataInicio = params.dataInicio || inicioDoMes();
  const dataFim = params.dataFim || hojeISO();

  const lancamentos = await listarLancamentos({ dataInicio, dataFim });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">Histórico</h1>

      <form method="get" className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde text-sm">De</span>
          <input
            type="date"
            name="dataInicio"
            defaultValue={dataInicio}
            className="rounded-xl border-2 border-verde-claro px-3 py-2 focus:border-vermelho focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde text-sm">Até</span>
          <input
            type="date"
            name="dataFim"
            defaultValue={dataFim}
            className="rounded-xl border-2 border-verde-claro px-3 py-2 focus:border-vermelho focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl border-2 border-verde-claro px-4 py-2 font-medium text-verde hover:bg-verde-claro transition-colors"
        >
          Filtrar
        </button>
      </form>

      {lancamentos.length === 0 ? (
        <p className="text-foreground/70">Nenhum lançamento nesse período.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {lancamentos.map((lancamento) => (
            <li
              key={lancamento.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-verde-claro bg-white px-4 py-3"
            >
              <div className="flex-1">
                <p className="font-medium text-verde">
                  {lancamento.categoria}
                  {lancamento.descricao ? ` — ${lancamento.descricao}` : ""}
                </p>
                <p className="text-xs text-foreground/60">
                  {formatarDataBR(lancamento.data)} · {lancamento.forma_pagamento}
                </p>
              </div>
              <span
                className={`font-bold whitespace-nowrap ${
                  lancamento.tipo === "venda" ? "text-verde" : "text-vermelho-escuro"
                }`}
              >
                {lancamento.tipo === "venda" ? "+" : "-"}
                {formatarReais(Number(lancamento.valor))}
              </span>
              <div className="flex flex-col gap-1 items-end">
                <Link
                  href={`/historico/${lancamento.id}`}
                  className="text-xs text-verde underline underline-offset-2"
                >
                  Editar
                </Link>
                <form action={excluirAction}>
                  <input type="hidden" name="id" value={lancamento.id} />
                  <input type="hidden" name="dataInicio" value={dataInicio} />
                  <input type="hidden" name="dataFim" value={dataFim} />
                  <button
                    type="submit"
                    className="text-xs text-vermelho-escuro underline underline-offset-2"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

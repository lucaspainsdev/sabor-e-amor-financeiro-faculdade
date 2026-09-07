import { redirect } from "next/navigation";
import { getFechamento, hojeISO, resumoDoDia, salvarFechamento, upsertVendasDoDia } from "@/lib/data";
import { formatarDataBR, formatarReais } from "@/lib/formato";

async function salvarFechamentoAction(formData: FormData) {
  "use server";

  const data = String(formData.get("data"));
  const dinheiro = Number(String(formData.get("dinheiro_recebido") ?? "0").replace(",", "."));
  const ifood = Number(String(formData.get("ifood_recebido") ?? "0").replace(",", "."));
  const observacao = String(formData.get("observacao") ?? "").trim();

  await upsertVendasDoDia(data, { dinheiro, ifood });
  await salvarFechamento({ data, saldo_inicial: 0, dinheiro_contado: 0, observacao: observacao || null });

  redirect(`/fechamento?data=${data}`);
}

export default async function FechamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data: dataParam } = await searchParams;
  const data = dataParam || hojeISO();

  const [resumo, fechamento] = await Promise.all([
    resumoDoDia(data),
    getFechamento(data),
  ]);

  const totalVendas = resumo.vendasDinheiro + resumo.vendasIfood;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">Fechamento de caixa</h1>

      <form method="get" className="flex items-end gap-3">
        <label className="flex flex-col gap-2 flex-1">
          <span className="font-medium text-verde">Data</span>
          <input
            type="date"
            name="data"
            defaultValue={data}
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="rounded-xl border-2 border-verde-claro px-4 py-3 font-medium text-verde hover:bg-verde-claro transition-colors"
        >
          Ver
        </button>
      </form>

      <form action={salvarFechamentoAction} className="flex flex-col gap-6">
        <input type="hidden" name="data" value={data} />

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Caixa aplicativo</span>
          <input
            type="number"
            name="dinheiro_recebido"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={resumo.vendasDinheiro || undefined}
            placeholder="0,00"
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Total recebido pelo iFood</span>
          <input
            type="number"
            name="ifood_recebido"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={resumo.vendasIfood || undefined}
            placeholder="0,00"
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Observação (opcional)</span>
          <input
            type="text"
            name="observacao"
            defaultValue={fechamento?.observacao ?? ""}
            placeholder="Ex: dia fraco, feriado, evento..."
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="rounded-xl bg-vermelho text-white text-lg font-bold py-4 hover:bg-vermelho-escuro transition-colors"
        >
          Salvar fechamento
        </button>
      </form>

      {fechamento && (
        <div className="rounded-2xl border border-verde-claro bg-white p-4 flex flex-col gap-2">
          <h2 className="font-bold text-verde">Resumo — {formatarDataBR(data)}</h2>
          <div className="flex justify-between text-sm">
            <span>Caixa aplicativo</span>
            <span className="font-medium text-verde">+ {formatarReais(resumo.vendasDinheiro)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>iFood</span>
            <span className="font-medium text-verde">+ {formatarReais(resumo.vendasIfood)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Despesas</span>
            <span className="font-medium text-vermelho-escuro">- {formatarReais(resumo.totalDespesas)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-verde-claro">
            <span className="font-bold text-verde">Resultado do dia</span>
            <span className={`text-xl font-bold ${resumo.saldo >= 0 ? "text-verde" : "text-vermelho-escuro"}`}>
              {resumo.saldo >= 0 ? "+" : ""}{formatarReais(resumo.saldo)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

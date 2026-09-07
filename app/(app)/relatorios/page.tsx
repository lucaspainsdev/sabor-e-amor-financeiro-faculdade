import { hojeISO, relatorioPorCategoria, totaisPorPeriodo } from "@/lib/data";
import { formatarReais } from "@/lib/formato";
import CardResumo from "@/components/CardResumo";
import GraficoPizza from "@/components/GraficoPizza";
import GraficoBarras from "@/components/GraficoBarras";

function inicioDoMes(): string {
  const hoje = hojeISO();
  return `${hoje.slice(0, 7)}-01`;
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ dataInicio?: string; dataFim?: string }>;
}) {
  const params = await searchParams;
  const dataInicio = params.dataInicio || inicioDoMes();
  const dataFim = params.dataFim || hojeISO();

  const [porCategoria, totais] = await Promise.all([
    relatorioPorCategoria(dataInicio, dataFim),
    totaisPorPeriodo(dataInicio, dataFim),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">Relatórios</h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CardResumo titulo="Total de vendas" valor={totais.totalVendas} cor="verde" />
        <CardResumo titulo="Total de despesas" valor={totais.totalDespesas} cor="vermelho" />
        <CardResumo titulo="Saldo do período" valor={totais.saldo} cor="amarelo" />
      </div>

      <div className="rounded-2xl border border-verde-claro bg-white p-4">
        <h2 className="font-bold text-verde mb-2">Vendas x Despesas</h2>
        <GraficoBarras totalVendas={totais.totalVendas} totalDespesas={totais.totalDespesas} />
      </div>

      <div className="rounded-2xl border border-verde-claro bg-white p-4">
        <h2 className="font-bold text-verde mb-2">Pra onde foi o dinheiro (despesas por categoria)</h2>
        <GraficoPizza dados={porCategoria} />
        {porCategoria.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1">
            {porCategoria.map((item) => (
              <li key={item.categoria} className="flex justify-between text-sm">
                <span>{item.categoria}</span>
                <span className="font-medium">{formatarReais(item.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

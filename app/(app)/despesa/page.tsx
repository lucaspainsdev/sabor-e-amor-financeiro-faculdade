import { redirect } from "next/navigation";
import { CATEGORIAS_DESPESA, FORMAS_PAGAMENTO } from "@/lib/categorias";
import { criarLancamento, hojeISO } from "@/lib/data";
import SeletorOpcoes from "@/components/SeletorOpcoes";

async function salvarDespesaAction(formData: FormData) {
  "use server";

  const valor = Number(String(formData.get("valor")).replace(",", "."));
  const categoria = String(formData.get("categoria"));
  const forma_pagamento = String(formData.get("forma_pagamento")) as
    | "Dinheiro"
    | "Cartão/Pix";
  const data = String(formData.get("data"));
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (!valor || valor <= 0) {
    redirect(`/despesa?erro=${encodeURIComponent("Informe um valor válido.")}`);
  }

  await criarLancamento({
    tipo: "despesa",
    data,
    valor,
    categoria,
    forma_pagamento,
    descricao: descricao || null,
  });

  redirect("/?salvo=despesa");
}

export default async function DespesaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const hoje = hojeISO();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">Lançar despesa</h1>

      <form action={salvarDespesaAction} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-verde">Onde foi a compra?</span>
          <SeletorOpcoes
            nome="categoria"
            colunas={3}
            opcoes={CATEGORIAS_DESPESA.map((c) => ({
              valor: c.nome,
              rotulo: c.nome,
              emoji: c.emoji,
            }))}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Valor (R$)</span>
          <input
            type="number"
            name="valor"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            required
            autoFocus
            placeholder="0,00"
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="font-medium text-verde">Como pagou?</span>
          <SeletorOpcoes
            nome="forma_pagamento"
            opcoes={FORMAS_PAGAMENTO.map((f) => ({ valor: f, rotulo: f }))}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Data</span>
          <input
            type="date"
            name="data"
            defaultValue={hoje}
            required
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Descrição (opcional)</span>
          <input
            type="text"
            name="descricao"
            placeholder="Ex: tomate, alface, carvão..."
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        {erro && (
          <p className="rounded-xl bg-vermelho/10 text-vermelho-escuro px-4 py-2 text-sm">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="rounded-xl bg-vermelho text-white text-lg font-bold py-4 hover:bg-vermelho-escuro transition-colors"
        >
          Salvar despesa
        </button>
      </form>
    </div>
  );
}

import { redirect } from "next/navigation";
import {
  CATEGORIA_VENDA_DINHEIRO,
  CATEGORIA_VENDA_MAQUININHA,
} from "@/lib/categorias";
import { criarLancamento, hojeISO } from "@/lib/data";

async function salvarVendaAction(formData: FormData) {
  "use server";

  const data = String(formData.get("data"));
  const maquininha = Number(String(formData.get("maquininha") ?? "0").replace(",", "."));
  const dinheiro = Number(String(formData.get("dinheiro") ?? "0").replace(",", "."));

  if ((!maquininha || maquininha <= 0) && (!dinheiro || dinheiro <= 0)) {
    redirect(`/venda?erro=${encodeURIComponent("Informe pelo menos um valor.")}`);
  }

  if (maquininha > 0) {
    await criarLancamento({
      tipo: "venda",
      data,
      valor: maquininha,
      categoria: CATEGORIA_VENDA_MAQUININHA,
      forma_pagamento: "Cartão/Pix",
    });
  }

  if (dinheiro > 0) {
    await criarLancamento({
      tipo: "venda",
      data,
      valor: dinheiro,
      categoria: CATEGORIA_VENDA_DINHEIRO,
      forma_pagamento: "Dinheiro",
    });
  }

  redirect("/?salvo=venda");
}

export default async function VendaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const hoje = hojeISO();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">Lançar venda do dia</h1>
      <p className="text-foreground/70">
        Lança o total que entrou no dia, separado por maquininha (cartão/pix) e
        dinheiro no caixa.
      </p>

      <form action={salvarVendaAction} className="flex flex-col gap-6">
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
          <span className="font-medium text-verde">💳 Total na maquininha (cartão/pix)</span>
          <input
            type="number"
            name="maquininha"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0,00"
            autoFocus
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">💵 Total em dinheiro</span>
          <input
            type="number"
            name="dinheiro"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="0,00"
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
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
          Salvar venda
        </button>
      </form>
    </div>
  );
}

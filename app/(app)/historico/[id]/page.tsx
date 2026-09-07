import { notFound, redirect } from "next/navigation";
import { atualizarLancamento, getLancamento } from "@/lib/data";
import { FORMAS_PAGAMENTO } from "@/lib/categorias";

async function salvarEdicaoAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const valor = Number(String(formData.get("valor")).replace(",", "."));
  const categoria = String(formData.get("categoria"));
  const forma_pagamento = String(formData.get("forma_pagamento")) as
    | "Dinheiro"
    | "Cartão/Pix";
  const data = String(formData.get("data"));
  const descricao = String(formData.get("descricao") ?? "").trim();

  await atualizarLancamento(id, {
    valor,
    categoria,
    forma_pagamento,
    data,
    descricao: descricao || null,
  });

  redirect("/historico");
}

export default async function EditarLancamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lancamento = await getLancamento(id);

  if (!lancamento) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-verde">
        Editar {lancamento.tipo === "venda" ? "venda" : "despesa"}
      </h1>

      <form action={salvarEdicaoAction} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={lancamento.id} />

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Categoria</span>
          <input
            type="text"
            name="categoria"
            defaultValue={lancamento.categoria}
            required
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Valor (R$)</span>
          <input
            type="number"
            name="valor"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            defaultValue={lancamento.valor}
            required
            className="rounded-xl border-2 border-verde-claro px-4 py-4 text-2xl text-center focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Forma de pagamento</span>
          <select
            name="forma_pagamento"
            defaultValue={lancamento.forma_pagamento}
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          >
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma} value={forma}>
                {forma}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Data</span>
          <input
            type="date"
            name="data"
            defaultValue={lancamento.data}
            required
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium text-verde">Descrição (opcional)</span>
          <input
            type="text"
            name="descricao"
            defaultValue={lancamento.descricao ?? ""}
            className="rounded-xl border-2 border-verde-claro px-4 py-3 text-lg focus:border-vermelho focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="rounded-xl bg-vermelho text-white text-lg font-bold py-4 hover:bg-vermelho-escuro transition-colors"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}

import { getSupabaseAdmin } from "./supabase";
import { CATEGORIA_VENDA_DINHEIRO, CATEGORIA_VENDA_IFOOD } from "./categorias";
import type { FormaPagamento } from "./categorias";

export type Lancamento = {
  id: string;
  tipo: "despesa" | "venda";
  data: string;
  valor: number;
  categoria: string;
  forma_pagamento: FormaPagamento;
  descricao: string | null;
  created_at: string;
};

export type Fechamento = {
  id: string;
  data: string;
  saldo_inicial: number;
  dinheiro_contado: number;
  observacao: string | null;
};

export function hojeISO(): string {
  const agora = new Date();
  const offsetMs = agora.getTimezoneOffset() * 60 * 1000;
  return new Date(agora.getTime() - offsetMs).toISOString().slice(0, 10);
}

export async function criarLancamento(input: {
  tipo: "despesa" | "venda";
  data: string;
  valor: number;
  categoria: string;
  forma_pagamento: FormaPagamento;
  descricao?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("lancamentos").insert({
    tipo: input.tipo,
    data: input.data,
    valor: input.valor,
    categoria: input.categoria,
    forma_pagamento: input.forma_pagamento,
    descricao: input.descricao ?? null,
  });

  if (error) throw new Error(error.message);
}

export async function atualizarLancamento(
  id: string,
  input: Partial<{
    data: string;
    valor: number;
    categoria: string;
    forma_pagamento: FormaPagamento;
    descricao: string | null;
  }>
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("lancamentos").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function excluirLancamento(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("lancamentos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getLancamento(id: string): Promise<Lancamento | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function listarLancamentos(filtro?: {
  dataInicio?: string;
  dataFim?: string;
  tipo?: "despesa" | "venda";
}): Promise<Lancamento[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("lancamentos")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  if (filtro?.dataInicio) query = query.gte("data", filtro.dataInicio);
  if (filtro?.dataFim) query = query.lte("data", filtro.dataFim);
  if (filtro?.tipo) query = query.eq("tipo", filtro.tipo);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function resumoDoDia(data: string) {
  const lancamentos = await listarLancamentos({ dataInicio: data, dataFim: data });

  const totalVendas = lancamentos
    .filter((l) => l.tipo === "venda")
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const vendasDinheiro = lancamentos
    .filter((l) => l.tipo === "venda" && l.categoria === CATEGORIA_VENDA_DINHEIRO)
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const vendasIfood = lancamentos
    .filter((l) => l.tipo === "venda" && l.categoria === CATEGORIA_VENDA_IFOOD)
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const vendasCartao = totalVendas - vendasDinheiro - vendasIfood;

  const despesasDinheiro = lancamentos
    .filter((l) => l.tipo === "despesa" && l.forma_pagamento === "Dinheiro")
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const despesasCartao = totalDespesas - despesasDinheiro;

  return {
    lancamentos,
    totalVendas,
    totalDespesas,
    vendasDinheiro,
    vendasIfood,
    vendasCartao,
    despesasDinheiro,
    despesasCartao,
    saldo: totalVendas - totalDespesas,
  };
}

export async function getFechamento(data: string): Promise<Fechamento | null> {
  const supabase = getSupabaseAdmin();
  const { data: fechamento, error } = await supabase
    .from("fechamentos_caixa")
    .select("*")
    .eq("data", data)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return fechamento;
}

export async function salvarFechamento(input: {
  data: string;
  saldo_inicial: number;
  dinheiro_contado: number;
  observacao?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("fechamentos_caixa")
    .upsert(
      {
        data: input.data,
        saldo_inicial: input.saldo_inicial,
        dinheiro_contado: input.dinheiro_contado,
        observacao: input.observacao ?? null,
      },
      { onConflict: "data" }
    );

  if (error) throw new Error(error.message);
}

export async function upsertVendasDoDia(
  data: string,
  canais: { dinheiro: number; ifood: number }
) {
  const supabase = getSupabaseAdmin();
  await supabase.from("lancamentos").delete().eq("data", data).eq("tipo", "venda");

  const inserir = [];
  if (canais.dinheiro > 0) {
    inserir.push({ tipo: "venda", data, valor: canais.dinheiro, categoria: CATEGORIA_VENDA_DINHEIRO, forma_pagamento: "Dinheiro" });
  }
  if (canais.ifood > 0) {
    inserir.push({ tipo: "venda", data, valor: canais.ifood, categoria: CATEGORIA_VENDA_IFOOD, forma_pagamento: "Cartão/Pix" });
  }
  if (inserir.length > 0) {
    const { error } = await supabase.from("lancamentos").insert(inserir);
    if (error) throw new Error(error.message);
  }
}

export async function relatorioPorCategoria(dataInicio: string, dataFim: string) {
  const lancamentos = await listarLancamentos({ dataInicio, dataFim, tipo: "despesa" });

  const porCategoria = new Map<string, number>();
  for (const l of lancamentos) {
    porCategoria.set(l.categoria, (porCategoria.get(l.categoria) ?? 0) + Number(l.valor));
  }

  return Array.from(porCategoria.entries())
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

export async function totaisPorPeriodo(dataInicio: string, dataFim: string) {
  const lancamentos = await listarLancamentos({ dataInicio, dataFim });

  const totalVendas = lancamentos
    .filter((l) => l.tipo === "venda")
    .reduce((soma, l) => soma + Number(l.valor), 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((soma, l) => soma + Number(l.valor), 0);

  return { totalVendas, totalDespesas, saldo: totalVendas - totalDespesas };
}

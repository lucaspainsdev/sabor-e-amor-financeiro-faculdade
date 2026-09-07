export type CategoriaDespesa = {
  nome: string;
  emoji: string;
};

export const CATEGORIAS_DESPESA: CategoriaDespesa[] = [
  { nome: "Hortifruti", emoji: "🥬" },
  { nome: "Carnes/Frios", emoji: "🥩" },
  { nome: "Mercado", emoji: "🛒" },
  { nome: "Bebidas", emoji: "🥤" },
  { nome: "Gás/Limpeza", emoji: "🧴" },
  { nome: "Contas", emoji: "📄" },
  { nome: "Funcionários", emoji: "👤" },
  { nome: "Outros", emoji: "📦" },
];

export const FORMAS_PAGAMENTO = ["Dinheiro", "Cartão/Pix"] as const;

export type FormaPagamento = (typeof FORMAS_PAGAMENTO)[number];

export const CATEGORIA_VENDA_MAQUININHA = "Maquininha";
export const CATEGORIA_VENDA_DINHEIRO = "Dinheiro em caixa";
export const CATEGORIA_VENDA_IFOOD = "iFood";

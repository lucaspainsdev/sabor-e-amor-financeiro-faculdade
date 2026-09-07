"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatarReais } from "@/lib/formato";

export default function GraficoBarras({
  totalVendas,
  totalDespesas,
}: {
  totalVendas: number;
  totalDespesas: number;
}) {
  const dados = [
    { nome: "Vendas", valor: totalVendas, cor: "#2f5d34" },
    { nome: "Despesas", valor: totalDespesas, cor: "#e6332a" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" />
        <YAxis tickFormatter={(valor) => formatarReais(valor)} width={90} />
        <Tooltip formatter={(valor) => formatarReais(Number(valor))} />
        <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
          {dados.map((item) => (
            <Cell key={item.nome} fill={item.cor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

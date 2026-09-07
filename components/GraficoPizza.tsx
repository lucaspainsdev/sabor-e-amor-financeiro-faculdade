"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatarReais } from "@/lib/formato";

const CORES = ["#e6332a", "#2f5d34", "#f4c542", "#c4241c", "#8aa893", "#a8762c"];

export default function GraficoPizza({
  dados,
}: {
  dados: { categoria: string; total: number }[];
}) {
  if (dados.length === 0) {
    return <p className="text-foreground/70">Sem despesas nesse período.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="total"
          nameKey="categoria"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(props) =>
            `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {dados.map((_, indice) => (
            <Cell key={indice} fill={CORES[indice % CORES.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(valor) => formatarReais(Number(valor))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

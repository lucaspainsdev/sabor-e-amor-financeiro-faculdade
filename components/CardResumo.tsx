import { formatarReais } from "@/lib/formato";

export default function CardResumo({
  titulo,
  valor,
  cor = "verde",
}: {
  titulo: string;
  valor: number;
  cor?: "verde" | "vermelho" | "amarelo";
}) {
  const corTexto =
    cor === "vermelho"
      ? "text-vermelho-escuro"
      : cor === "amarelo"
      ? "text-amarelo"
      : "text-verde";

  return (
    <div className="rounded-2xl border border-verde-claro bg-white p-4 flex flex-col gap-1">
      <span className="text-sm text-foreground/70">{titulo}</span>
      <span className={`text-2xl font-bold ${corTexto}`}>{formatarReais(valor)}</span>
    </div>
  );
}

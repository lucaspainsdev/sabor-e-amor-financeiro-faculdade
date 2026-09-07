import Link from "next/link";
import { sair } from "@/lib/auth";

const ITENS = [
  { href: "/", label: "Início", emoji: "🏠" },
  { href: "/despesa", label: "Despesa", emoji: "🥬" },
  { href: "/fechamento", label: "Fechar caixa", emoji: "🧾" },
  { href: "/historico", label: "Histórico", emoji: "📋" },
  { href: "/relatorios", label: "Relatórios", emoji: "📊" },
];

export default function Navegacao() {
  return (
    <header className="border-b border-verde-claro bg-white sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-verde text-lg">
          Sabor &amp; Amor
        </Link>
        <form
          action={async () => {
            "use server";
            await sair();
          }}
        >
          <button
            type="submit"
            className="text-sm text-vermelho-escuro underline underline-offset-2"
          >
            Sair
          </button>
        </form>
      </div>
      <nav className="max-w-3xl mx-auto px-2 pb-2 grid grid-cols-5 gap-2">
        {ITENS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs sm:text-sm font-medium text-verde hover:bg-verde-claro transition-colors"
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

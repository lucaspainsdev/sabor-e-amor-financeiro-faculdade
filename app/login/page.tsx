import Image from "next/image";
import { redirect } from "next/navigation";
import { entrarComPin, estaAutenticado } from "@/lib/auth";

async function entrarAction(formData: FormData) {
  "use server";

  const pin = String(formData.get("pin") ?? "").trim();
  const resultado = await entrarComPin(pin);

  if (!resultado.ok) {
    redirect(`/login?erro=${encodeURIComponent(resultado.erro ?? "Erro ao entrar.")}`);
  }

  redirect("/");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await estaAutenticado()) {
    redirect("/");
  }

  const { erro } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6 text-center">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Sabor & Amor Marmitaria"
            width={220}
            height={220}
            priority
          />
        </div>

        <form action={entrarAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-left">
            <span className="font-medium text-verde">Digite o PIN</span>
            <input
              type="password"
              name="pin"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
              className="rounded-xl border-2 border-verde-claro px-4 py-4 text-center text-3xl tracking-[0.5em] focus:border-vermelho focus:outline-none"
              placeholder="······"
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
            Entrar
          </button>

          <p className="text-xs text-foreground/60">
            Primeiro acesso? O PIN que você digitar agora vai ser salvo como o PIN de entrada.
          </p>
        </form>
      </div>
    </main>
  );
}

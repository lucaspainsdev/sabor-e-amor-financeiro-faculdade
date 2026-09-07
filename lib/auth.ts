import { createHash } from "crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "./supabase";

const SESSION_COOKIE = "sa_sessao";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function sessionToken(pinHash: string) {
  return hash(`${pinHash}:sessao`);
}

/**
 * Tenta entrar com o PIN informado.
 *
 * Se ainda não existe PIN configurado (primeiro acesso), o PIN informado
 * passa a ser o PIN de acesso do app.
 */
export async function entrarComPin(pin: string): Promise<{ ok: boolean; erro?: string }> {
  if (!/^\d+$/.test(pin) || pin.length < 4 || pin.length > 6) {
    return { ok: false, erro: "O PIN deve ter entre 4 e 6 números." };
  }

  const supabase = getSupabaseAdmin();
  const { data: config } = await supabase
    .from("config")
    .select("pin_hash")
    .eq("id", 1)
    .maybeSingle();

  const pinHash = hash(pin);

  if (!config) {
    const { error } = await supabase
      .from("config")
      .insert({ id: 1, pin_hash: pinHash });

    if (error) {
      return { ok: false, erro: "Não foi possível salvar o PIN. Tente novamente." };
    }
  } else if (config.pin_hash !== pinHash) {
    return { ok: false, erro: "PIN incorreto." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken(pinHash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true };
}

export async function sair() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function estaAutenticado(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessao = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessao) return false;

  const supabase = getSupabaseAdmin();
  const { data: config } = await supabase
    .from("config")
    .select("pin_hash")
    .eq("id", 1)
    .maybeSingle();

  if (!config) return false;

  return sessao === sessionToken(config.pin_hash);
}

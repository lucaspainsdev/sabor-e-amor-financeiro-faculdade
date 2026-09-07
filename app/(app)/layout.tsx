import { redirect } from "next/navigation";
import { estaAutenticado } from "@/lib/auth";
import Navegacao from "@/components/Navegacao";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await estaAutenticado())) {
    redirect("/login");
  }

  return (
    <>
      <Navegacao />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">{children}</main>
    </>
  );
}

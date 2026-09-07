type Opcao = {
  valor: string;
  rotulo: string;
  emoji?: string;
};

export default function SeletorOpcoes({
  nome,
  opcoes,
  padrao,
  colunas = 2,
}: {
  nome: string;
  opcoes: Opcao[];
  padrao?: string;
  colunas?: 2 | 3;
}) {
  return (
    <div className={`grid gap-3 ${colunas === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {opcoes.map((opcao, indice) => (
        <label key={opcao.valor} className="cursor-pointer">
          <input
            type="radio"
            name={nome}
            value={opcao.valor}
            defaultChecked={
              padrao ? opcao.valor === padrao : indice === 0
            }
            className="peer sr-only"
            required
          />
          <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-verde-claro bg-white p-4 text-center text-verde font-medium peer-checked:border-vermelho peer-checked:bg-vermelho peer-checked:text-white transition-colors">
            {opcao.emoji && <span className="text-2xl">{opcao.emoji}</span>}
            <span>{opcao.rotulo}</span>
          </div>
        </label>
      ))}
    </div>
  );
}

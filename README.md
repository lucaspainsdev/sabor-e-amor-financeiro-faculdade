# Sistema financeiro — Sabor & Amor Marmitaria

App pra lançar despesas (compras do mercado) e vendas do dia, fechar o
caixa e ver relatórios de pra onde o dinheiro está indo.

## Rodando localmente

1. Instale as dependências (já feito se você acabou de clonar/criar o projeto):

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env.local` e preencha com os dados do seu
   projeto Supabase (veja o passo a passo abaixo).

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000). No primeiro acesso,
   digite um PIN de 4 números — ele vai ser salvo como o PIN de entrada.

## Passo a passo: criar o banco de dados (Supabase)

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Clique em **New project**, escolha um nome (ex: `sabor-e-amor`) e uma senha
   pro banco (guarde essa senha, mas ela não é usada pelo app).
3. Quando o projeto terminar de ser criado, vá em **SQL Editor** (menu
   lateral) → **New query**.
4. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql)
   deste projeto, cole no editor e clique em **Run**. Isso cria as tabelas
   `lancamentos`, `fechamentos_caixa` e `config`.
5. Vá em **Project Settings** (ícone de engrenagem) → **API**. Você vai
   precisar de dois valores:
   - **Project URL** → vai virar `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (em "Project API keys", clique em "Reveal" — é uma
     chave secreta, nunca compartilhe) → vai virar `SUPABASE_SERVICE_ROLE_KEY`
6. Cole esses dois valores no seu `.env.local` (baseado no `.env.example`).

## Passo a passo: publicar online (Vercel)

1. Suba esse projeto pro GitHub (`git push`).
2. Crie uma conta gratuita em [vercel.com](https://vercel.com) (pode entrar
   com a conta do GitHub).
3. Clique em **Add New** → **Project**, e selecione o repositório do GitHub.
4. Em **Root Directory**, selecione a pasta `sistema-financeiro` (já que o
   app fica dentro dela, não na raiz do repositório).
5. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Clique em **Deploy**. Em poucos minutos a Vercel gera um link
   (`algo.vercel.app`) que funciona em qualquer celular ou computador.

Depois do primeiro deploy, qualquer novo `git push` na branch principal
publica uma atualização automaticamente.

## Como usar no dia a dia

- **Lançar despesa** — toda vez que voltar do mercado, escolhe a categoria
  (Hortifruti, Carnes/Frios, etc.), digita o valor e como pagou (dinheiro ou
  cartão/pix). Leva uns 10 segundos.
- **Lançar venda** — no fim do dia (ou quando der), lança o total que saiu na
  maquininha e o total em dinheiro que entrou no caixa.
- **Fechar caixa** — no fim do dia, informa quanto tinha de dinheiro no início
  e quanto sobrou contado. O sistema calcula se bateu ou não, e quanto faltou
  ou sobrou.
- **Histórico** — lista todos os lançamentos, com opção de editar ou excluir.
- **Relatórios** — mostra total de vendas x despesas e um gráfico de pra onde
  o dinheiro das despesas está indo (por categoria), no período escolhido.

## Estrutura

- `app/(app)/` — páginas protegidas por login (dashboard, despesa, venda,
  fechamento, histórico, relatórios)
- `app/login/` — tela de entrada por PIN
- `lib/` — acesso ao banco (Supabase), autenticação, categorias e formatação
- `components/` — componentes de UI reutilizáveis
- `supabase/schema.sql` — script de criação das tabelas

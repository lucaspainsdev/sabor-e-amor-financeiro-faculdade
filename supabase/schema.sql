-- Schema do sistema financeiro Sabor & Amor Marmitaria
-- Rodar esse script no SQL Editor do Supabase (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

-- Lançamentos: despesas (compras do mercado, etc.) e vendas (entradas do dia)
create table if not exists lancamentos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('despesa', 'venda')),
  data date not null default current_date,
  valor numeric(10, 2) not null check (valor >= 0),
  categoria text not null,
  forma_pagamento text not null check (forma_pagamento in ('Dinheiro', 'Cartão/Pix')),
  descricao text,
  created_at timestamptz not null default now()
);

create index if not exists lancamentos_data_idx on lancamentos (data);
create index if not exists lancamentos_tipo_idx on lancamentos (tipo);

-- Fechamento de caixa diário
create table if not exists fechamentos_caixa (
  id uuid primary key default gen_random_uuid(),
  data date not null unique,
  saldo_inicial numeric(10, 2) not null default 0,
  dinheiro_contado numeric(10, 2) not null default 0,
  observacao text,
  created_at timestamptz not null default now()
);

-- Configuração do app (PIN de acesso)
create table if not exists config (
  id int primary key default 1,
  pin_hash text not null,
  constraint config_single_row check (id = 1)
);

-- Habilitar Row Level Security.
-- Como o app usa apenas a service role key no servidor (não expõe a anon key
-- pra escrita), basta bloquear acesso direto via anon key.
alter table lancamentos enable row level security;
alter table fechamentos_caixa enable row level security;
alter table config enable row level security;

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.enforce_category_integrity()
returns trigger
language plpgsql
as $$
begin
  if tg_table_name = 'transactions' then
    if not exists (
      select 1
      from public.categories as categories
      where categories.id = new.category_id
        and categories.type = new.type
        and (
          categories.user_id is null
          or categories.user_id = new.user_id
        )
    ) then
      raise exception 'Transaction category must exist, match the transaction type, and belong to the same user or be default.';
    end if;
  elsif tg_table_name = 'category_rules' then
    if not exists (
      select 1
      from public.categories as categories
      where categories.id = new.suggested_category_id
        and (
          (new.user_id is null and categories.user_id is null)
          or categories.user_id = new.user_id
        )
    ) then
      raise exception 'Category rule must target a default category or a category owned by the same user.';
    end if;
  end if;

  return new;
end;
$$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  preferred_currency text not null default 'MYR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(user_id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text not null,
  icon text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category_id uuid not null references public.categories(id),
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.category_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(user_id) on delete cascade,
  keyword text not null,
  suggested_category_id uuid not null references public.categories(id),
  priority integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index categories_default_lookup_idx
on public.categories (name, type, is_default)
where user_id is null;

create index transactions_user_date_idx on public.transactions (user_id, transaction_date desc);
create index transactions_user_type_idx on public.transactions (user_id, type);
create index category_rules_user_priority_idx on public.category_rules (user_id, priority asc);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_transactions_updated_at
before update on public.transactions
for each row
execute function public.set_updated_at();

create trigger set_category_rules_updated_at
before update on public.category_rules
for each row
execute function public.set_updated_at();

create trigger enforce_transaction_category_integrity
before insert or update on public.transactions
for each row
execute function public.enforce_category_integrity();

create trigger enforce_category_rule_integrity
before insert or update on public.category_rules
for each row
execute function public.enforce_category_integrity();

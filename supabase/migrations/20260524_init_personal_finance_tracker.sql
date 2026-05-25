create extension if not exists "pgcrypto";

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_value text;
  display_name_value text;
begin
  email_value := new.email;
  display_name_value := nullif(split_part(coalesce(email_value, ''), '@', 1), '');

  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(display_name_value, 'CashNest user')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

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

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.category_rules enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "categories_select_default_or_own"
on public.categories
for select
to authenticated
using (user_id is null or auth.uid() = user_id);

create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check (
  auth.uid() = user_id
  and is_default = false
);

create policy "categories_update_own"
on public.categories
for update
to authenticated
using (auth.uid() = user_id and is_default = false)
with check (auth.uid() = user_id and is_default = false);

create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using (auth.uid() = user_id and is_default = false);

create policy "transactions_select_own"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

create policy "transactions_insert_own"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "transactions_update_own"
on public.transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "transactions_delete_own"
on public.transactions
for delete
to authenticated
using (auth.uid() = user_id);

create policy "category_rules_select_default_or_own"
on public.category_rules
for select
to authenticated
using (user_id is null or auth.uid() = user_id);

create policy "category_rules_insert_own"
on public.category_rules
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "category_rules_update_own"
on public.category_rules
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "category_rules_delete_own"
on public.category_rules
for delete
to authenticated
using (auth.uid() = user_id);

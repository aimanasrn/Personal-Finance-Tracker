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

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (user_id, display_name)
select
  users.id,
  coalesce(nullif(split_part(coalesce(users.email, ''), '@', 1), ''), 'CashNest user')
from auth.users as users
left join public.profiles as profiles
  on profiles.user_id = users.id
where profiles.user_id is null;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.category_rules enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "categories_select_default_or_own" on public.categories;
create policy "categories_select_default_or_own"
on public.categories
for select
to authenticated
using (user_id is null or auth.uid() = user_id);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check (
  auth.uid() = user_id
  and is_default = false
);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
on public.categories
for update
to authenticated
using (auth.uid() = user_id and is_default = false)
with check (auth.uid() = user_id and is_default = false);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using (auth.uid() = user_id and is_default = false);

drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
on public.transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
on public.transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
on public.transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
on public.transactions
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "category_rules_select_default_or_own" on public.category_rules;
create policy "category_rules_select_default_or_own"
on public.category_rules
for select
to authenticated
using (user_id is null or auth.uid() = user_id);

drop policy if exists "category_rules_insert_own" on public.category_rules;
create policy "category_rules_insert_own"
on public.category_rules
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "category_rules_update_own" on public.category_rules;
create policy "category_rules_update_own"
on public.category_rules
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "category_rules_delete_own" on public.category_rules;
create policy "category_rules_delete_own"
on public.category_rules
for delete
to authenticated
using (auth.uid() = user_id);

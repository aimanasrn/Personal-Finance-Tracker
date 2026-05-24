insert into public.categories (name, type, color, icon, is_default)
values
  ('Salary', 'income', '#15755b', 'wallet', true),
  ('Freelance', 'income', '#1f9d7a', 'briefcase', true),
  ('Food', 'expense', '#f97316', 'utensils', true),
  ('Transport', 'expense', '#0284c7', 'car', true),
  ('Shopping', 'expense', '#db2777', 'shopping-bag', true),
  ('Bills', 'expense', '#7c3aed', 'receipt', true);

insert into public.category_rules (keyword, suggested_category_id, priority)
select keyword_rules.keyword, categories.id, keyword_rules.priority
from (
  values
    ('salary', 'Salary', 5),
    ('grab', 'Transport', 10),
    ('mamak', 'Food', 20),
    ('shopee', 'Shopping', 15)
) as keyword_rules(keyword, category_name, priority)
join public.categories as categories
  on categories.user_id is null
 and categories.name = keyword_rules.category_name
 and categories.is_default = true;

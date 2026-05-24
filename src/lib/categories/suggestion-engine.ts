import {
  defaultCategories,
  defaultKeywordRules,
  type DefaultCategoryDefinition,
} from "./default-categories";

export type SuggestedCategoryLookupKey = Pick<
  DefaultCategoryDefinition,
  "name" | "type" | "isDefault"
>;

export type CategorySuggestion = {
  lookupKey: SuggestedCategoryLookupKey;
  matchedKeyword: (typeof defaultKeywordRules)[number]["keyword"];
  priority: (typeof defaultKeywordRules)[number]["priority"];
};

const prioritizedKeywordRules = [...defaultKeywordRules].sort(
  (left, right) => left.priority - right.priority,
);

export function suggestCategory(title: string): CategorySuggestion | null {
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedTitle.length === 0) {
    return null;
  }

  const matchedRule = prioritizedKeywordRules.find((rule) =>
    normalizedTitle.includes(rule.keyword.toLowerCase()),
  );

  if (!matchedRule) {
    return null;
  }

  const matchedCategory = defaultCategories.find(
    (category) => category.name === matchedRule.category,
  );

  if (!matchedCategory) {
    return null;
  }

  return {
    lookupKey: {
      name: matchedCategory.name,
      type: matchedCategory.type,
      isDefault: matchedCategory.isDefault
    },
    matchedKeyword: matchedRule.keyword,
    priority: matchedRule.priority
  };
}

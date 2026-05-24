import type { TransactionType } from "@/lib/db/types";

export type DefaultCategoryDefinition = {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  isDefault: true;
};

export type DefaultKeywordRule = {
  keyword: string;
  category: string;
  priority: number;
};

export const defaultCategories = [
  { name: "Salary", type: "income", color: "#15755b", icon: "wallet", isDefault: true },
  { name: "Freelance", type: "income", color: "#1f9d7a", icon: "briefcase", isDefault: true },
  { name: "Food", type: "expense", color: "#f97316", icon: "utensils", isDefault: true },
  { name: "Transport", type: "expense", color: "#0284c7", icon: "car", isDefault: true },
  { name: "Shopping", type: "expense", color: "#db2777", icon: "shopping-bag", isDefault: true },
  { name: "Bills", type: "expense", color: "#7c3aed", icon: "receipt", isDefault: true }
] as const satisfies readonly DefaultCategoryDefinition[];

export const defaultKeywordRules = [
  { keyword: "salary", category: "Salary", priority: 5 },
  { keyword: "grab", category: "Transport", priority: 10 },
  { keyword: "mamak", category: "Food", priority: 20 },
  { keyword: "shopee", category: "Shopping", priority: 15 }
] as const satisfies readonly DefaultKeywordRule[];

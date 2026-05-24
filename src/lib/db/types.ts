export type UUID = string;

export type ISODateString = string;

export type ISODateTimeString = string;

export type DatabaseNumericString = string;

export type TransactionType = "income" | "expense";

export type ProfileRecord = {
  id: UUID;
  user_id: UUID;
  display_name: string;
  preferred_currency: string;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
};

export type CategoryRecord = {
  id: UUID;
  user_id: UUID | null;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
};

export type TransactionRecord = {
  id: UUID;
  user_id: UUID;
  title: string;
  amount: DatabaseNumericString;
  type: TransactionType;
  category_id: UUID;
  transaction_date: ISODateString;
  notes: string | null;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
};

export type CategoryRuleRecord = {
  id: UUID;
  user_id: UUID | null;
  keyword: string;
  suggested_category_id: UUID;
  priority: number;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
};

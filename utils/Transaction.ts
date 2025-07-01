export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  // Recurring transactions
  isRecurring?: boolean; // true if recurring
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly'; // frequency
  recurrenceEndDate?: string; // optional end date (YYYY-MM-DD)
  nextOccurrence?: string; // next date to auto-generate
};

export type Category = {
  key: string;
  label: string;
  icon: string;
};
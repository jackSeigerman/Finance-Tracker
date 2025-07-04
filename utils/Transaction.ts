export type Transaction = {
  id: string;
  description: string;
  amountCents: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
};

export type Category = {
  key: string;
  label: string;
  icon: string;
};

// Helper to format cents to string with two decimals
export function formatCents(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}
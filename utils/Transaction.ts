export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
};

export type Category = {
  key: string;
  label: string;
  icon: string;
};
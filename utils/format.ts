export const formatCurrency = (amount: number | string): string => {
  return `$${parseFloat(amount.toString()).toFixed(2)}`;
};

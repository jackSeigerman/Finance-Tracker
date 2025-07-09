export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: '₣', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
];

export const getCurrencyByCode = (code: string): CurrencyOption => {
  return CURRENCIES.find(currency => currency.code === code) || CURRENCIES[0];
};

export const getCurrencySymbol = (code: string): string => {
  return getCurrencyByCode(code).symbol;
};

export const formatCurrency = (
  amount: number | string,
  currencyCode: string = 'USD',
  symbolAfter: boolean = false
): string => {
  const value = parseFloat(amount.toString()).toFixed(2);
  const symbol = getCurrencySymbol(currencyCode);
  
  return symbolAfter
    ? `${value} ${symbol}`
    : `${symbol}${value}`;
};
export const getCurrencyFormatExample = (
  currencyCode: string,
  symbolAfter: boolean = false
): string => {
  const symbol = getCurrencySymbol(currencyCode);
  return symbolAfter ? `100 ${symbol}` : `${symbol}100`;
};

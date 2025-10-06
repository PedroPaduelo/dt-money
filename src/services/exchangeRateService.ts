export interface ExchangeRate {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export async function getDollarExchangeRate(): Promise<ExchangeRate> {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }
    
    const data = await response.json();
    return data.USDBRL;
  } catch (error) {
    console.error('Error fetching dollar exchange rate:', error);
    throw error;
  }
}
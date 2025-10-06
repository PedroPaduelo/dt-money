import { useEffect, useState } from 'react';

// Interface definida localmente
interface ExchangeRate {
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

interface ExchangeRateResponse {
  USDBRL: ExchangeRate;
}

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      
      if (!response.ok) {
        throw new Error('Falha ao buscar cotação do dólar');
      }
      
      const data: ExchangeRateResponse = await response.json();
      
      if (!data.USDBRL) {
        throw new Error('Dados da cotação não encontrados');
      }
      
      setExchangeRate(data.USDBRL);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar cotação');
      console.error('Erro ao buscar cotação do dólar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { exchangeRate, loading, error, refetch: fetchExchangeRate };
}
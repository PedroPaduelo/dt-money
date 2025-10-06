import { useState, useEffect } from 'react';
import { getDollarExchangeRate, ExchangeRate } from '../services/exchangeRateService';

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDollarExchangeRate();
      setExchangeRate(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar cotação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    
    // Atualizar a cotação a cada 5 minutos
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    exchangeRate,
    loading,
    error,
    lastUpdated,
    refetch: fetchExchangeRate
  };
}
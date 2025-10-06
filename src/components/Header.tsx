import { useExchangeRate } from '../hooks/useExchangeRate';

interface HeaderProps {
  onNewTransaction: () => void
  onLoadMockData?: () => void
}

function Header({ onNewTransaction, onLoadMockData }: HeaderProps) {
  const { exchangeRate, loading, error, lastUpdated, refetch } = useExchangeRate();

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVariationColor = (pctChange: string) => {
    const change = parseFloat(pctChange);
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getVariationArrow = (pctChange: string) => {
    const change = parseFloat(pctChange);
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <header className="bg-background py-6 border-b">
      <div className="max-w-[1120px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10">
              <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.9999 19.0647C39.9999 29.5562 31.0425 38.1293 19.9999 38.1293C8.9574 38.1293 0 29.5562 0 19.0647C0 8.57311 8.9574 0 19.9999 0C31.0425 0 39.9999 8.57311 39.9999 19.0647Z" fill="#00B37E"/>
                <path d="M19.9999 3.79102C11.0425 3.79102 3.77772 10.6868 3.77772 19.0647C3.77772 27.4425 11.0425 34.3383 19.9999 34.3383C28.9574 34.3383 36.2222 27.4425 36.2222 19.0647C36.2222 10.6868 28.9574 3.79102 19.9999 3.79102Z" fill="#00875F"/>
                <path d="M26.6666 12.5928L18.8888 20.7441L13.3333 15.4677" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-title">DT Money</h1>
          </div>

          {/* Cotação do Dólar */}
          <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-medium">USD/BRL</span>
              {loading ? (
                <div className="text-sm text-gray-400">Carregando...</div>
              ) : error ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-500">Erro</span>
                  <button
                    onClick={refetch}
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                    title="Tentar novamente"
                  >
                    Tentar
                  </button>
                </div>
              ) : exchangeRate ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">
                      {formatCurrency(exchangeRate.bid)}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-medium ${getVariationColor(exchangeRate.pctChange)}`}>
                        {getVariationArrow(exchangeRate.pctChange)} {Math.abs(parseFloat(exchangeRate.pctChange)).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  {lastUpdated && (
                    <div className="text-xs text-gray-400">
                      {formatTime(lastUpdated)}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {onLoadMockData && (
            <button
              onClick={onLoadMockData}
              className="bg-orange-500 hover:bg-orange-600 transition-colors px-5 py-3 rounded-md text-textBase font-medium"
              title="Carregar dados de exemplo"
            >
              Carregar dados mockados
            </button>
          )}
          <button
            onClick={onNewTransaction}
            className="bg-orange-500 hover:bg-orange-600 transition-colors px-5 py-3 rounded-md text-white font-medium"
          >
            Nova transação
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
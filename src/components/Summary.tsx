interface SummaryProps {
  income: number
  outcome: number
  total: number
}

function Summary({ income, outcome, total }: SummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <section className="mt-8 grid grid-cols-3 gap-8">
      <div className="bg-shapeTertiary rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-textBase text-sm">Entradas</span>
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0Z" fill="#00B37E"/>
              <path d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z" fill="#00875F"/>
              <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <strong className="text-headline-lg font-bold text-titles">{formatCurrency(income)}</strong>
      </div>

      <div className="bg-shapeTertiary rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-textBase text-sm">Saídas</span>
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0Z" fill="#F75A68"/>
              <path d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z" fill="#F75A68"/>
              <path d="M22 16L18 12L10 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <strong className="text-headline-lg font-bold text-titles">{formatCurrency(outcome)}</strong>
      </div>

      <div className="bg-igniteDark rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-textBase text-sm">Total</span>
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="#00B37E"/>
              <path d="M11 21V11L21 16L11 21Z" fill="white"/>
            </svg>
          </div>
        </div>
        <strong className="text-headline-lg font-bold text-titles">{formatCurrency(total)}</strong>
      </div>
    </section>
  )
}

export default Summary
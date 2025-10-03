import { useState, useEffect, useMemo } from 'react'

interface Budget {
  id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
}

interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface BudgetManagerProps {
  budgets: Budget[]
  transactions: Transaction[]
  onAddBudget: (budget: Omit<Budget, 'id'>) => void
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void
  onDeleteBudget: (id: string) => void
}

export default function BudgetManager({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}: BudgetManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const budgetUtilization = useMemo(() => {
    const utilization: { [key: string]: { spent: number; budget: number; percentage: number } } = {}

    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => t.category === budget.category && t.price < 0)
        .reduce((sum, t) => sum + Math.abs(t.price), 0)

      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
      utilization[budget.category] = {
        spent,
        budget: budget.amount,
        percentage
      }
    })

    return utilization
  }, [budgets, transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'text-brandRed', bg: 'bg-red-900/20' }
    if (percentage >= 80) return { color: 'text-yellow-500', bg: 'bg-yellow-900/20' }
    return { color: 'text-igniteLight', bg: 'bg-green-900/20' }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const budgetData = {
      category,
      amount: Number(amount),
      period
    }

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData)
    } else {
      onAddBudget(budgetData)
    }

    setIsModalOpen(false)
    setEditingBudget(null)
    setCategory('')
    setAmount('')
    setPeriod('monthly')
  }

  const uniqueCategories = Array.from(new Set(
    transactions
      .filter(t => t.price < 0)
      .map(t => t.category)
  ))

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-titles">Orçamentos</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-igniteMid hover:bg-igniteLight transition-colors px-4 py-2 rounded-lg text-white font-medium text-sm"
        >
          Novo Orçamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const utilization = budgetUtilization[budget.category]
          const status = utilization ? getBudgetStatus(utilization.percentage) : { color: 'text-gray300', bg: 'bg-gray-900/20' }

          return (
            <div key={budget.id} className="bg-shapeSecondary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-titles">{budget.category}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBudget(budget)
                      setCategory(budget.category)
                      setAmount(budget.amount.toString())
                      setPeriod(budget.period)
                      setIsModalOpen(true)
                    }}
                    className="text-gray300 hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.333 2L13.9997 4.66667L5.66634 13L2.99967 13L2.99967 10.3333L11.333 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget.id)}
                    className="text-gray300 hover:text-brandRed transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.33301 4V2.66667C5.33301 2.29848 5.47944 1.94554 5.72949 1.69549C5.97954 1.44544 6.33248 1.29901 6.70067 1.29901H9.36634C9.73453 1.29901 10.0875 1.44544 10.3375 1.69549C10.5876 1.94554 10.734 2.29848 10.734 2.66667V4M12.6663 4V13.3333C12.6663 13.7015 12.5199 14.0545 12.2699 14.3045C12.0198 14.5546 11.6669 14.701 11.2987 14.701H4.76801C4.39982 14.701 4.04688 14.5546 3.79683 14.3045C3.54678 14.0545 3.40035 13.7015 3.40035 13.3333V4H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray300 mb-1">
                    <span>Orçamento {budget.period === 'monthly' ? 'Mensal' : 'Anual'}</span>
                    <span>{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="w-full bg-shapeTertiary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        utilization?.percentage >= 100 ? 'bg-brandRed' :
                        utilization?.percentage >= 80 ? 'bg-yellow-500' : 'bg-igniteLight'
                      }`}
                      style={{ width: `${Math.min(utilization?.percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>

                {utilization && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray300">Gasto</span>
                    <span className={`font-medium ${status.color}`}>
                      {formatCurrency(utilization.spent)} ({utilization.percentage.toFixed(1)}%)
                    </span>
                  </div>
                )}

                {utilization && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray300">Saldo</span>
                    <span className={`font-medium ${utilization.spent > budget.amount ? 'text-brandRed' : 'text-igniteLight'}`}>
                      {formatCurrency(budget.amount - utilization.spent)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {budgets.length === 0 && (
        <div className="bg-shapeSecondary rounded-lg p-8 text-center">
          <p className="text-gray300">Nenhum orçamento cadastrado</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-shapePrimary rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-titles mb-4">
              {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-textBase text-sm mb-2">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase focus:outline-none focus:ring-2 focus:ring-igniteLight"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-textBase text-sm mb-2">Valor</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-igniteLight"
                  placeholder="0,00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-textBase text-sm mb-2">Período</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                  className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase focus:outline-none focus:ring-2 focus:ring-igniteLight"
                >
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-shapeSecondary text-textBase rounded-lg hover:bg-shapeTertiary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-igniteLight text-white rounded-lg hover:bg-igniteMid transition-colors"
                >
                  {editingBudget ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
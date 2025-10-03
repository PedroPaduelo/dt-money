import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts'

interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface FinancialReportsProps {
  transactions: Transaction[]
}

const COLORS = ['#00B37E', '#F75A68', '#00875F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']

export default function FinancialReports({ transactions }: FinancialReportsProps) {
  const monthlyData = useMemo(() => {
    const monthlyTotals: { [key: string]: { income: number; outcome: number } } = {}

    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { income: 0, outcome: 0 }
      }

      if (transaction.price > 0) {
        monthlyTotals[monthKey].income += transaction.price
      } else {
        monthlyTotals[monthKey].outcome += Math.abs(transaction.price)
      }
    })

    return Object.entries(monthlyTotals)
      .map(([month, data]) => ({
        month,
        income: data.income,
        outcome: data.outcome,
        total: data.income - data.outcome
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [transactions])

  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}

    transactions
      .filter(t => t.price < 0)
      .forEach(transaction => {
        const category = transaction.category
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(transaction.price)
      })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (transactions.length === 0) {
    return (
      <div className="mt-12 bg-shapeSecondary rounded-lg p-8 text-center">
        <p className="text-gray300">Adicione transações para ver os relatórios</p>
      </div>
    )
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="bg-shapeSecondary rounded-lg p-6">
        <h3 className="text-xl font-bold text-titles mb-6">Evolução Mensal</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#323238" />
              <XAxis
                dataKey="month"
                stroke="#C4C4CC"
                tickFormatter={(value) => {
                  const [year, month] = value.split('-')
                  return `${month}/${year.slice(2)}`
                }}
              />
              <YAxis stroke="#C4C4CC" tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(value), '']}
                labelFormatter={(label) => {
                  const [year, month] = label.split('-')
                  return `${month}/${year}`
                }}
                contentStyle={{
                  backgroundColor: '#29292E',
                  border: '1px solid #323238',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#00B37E"
                strokeWidth={2}
                name="Receitas"
              />
              <Line
                type="monotone"
                dataKey="outcome"
                stroke="#F75A68"
                strokeWidth={2}
                name="Despesas"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Saldo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-shapeSecondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-titles mb-6">Despesas por Categoria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-shapeSecondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-titles mb-6">Comparativo Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#323238" />
                <XAxis
                  dataKey="month"
                  stroke="#C4C4CC"
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}/${year.slice(2)}`
                  }}
                />
                <YAxis stroke="#C4C4CC" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), '']}
                  labelFormatter={(label) => {
                    const [year, month] = label.split('-')
                    return `${month}/${year}`
                  }}
                  contentStyle={{
                    backgroundColor: '#29292E',
                    border: '1px solid #323238',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#00B37E" name="Receitas" />
                <Bar dataKey="outcome" fill="#F75A68" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-shapeSecondary rounded-lg p-6">
        <h3 className="text-xl font-bold text-titles mb-6">Resumo das Categorias</h3>
        <div className="space-y-4">
          {categoryData.slice(0, 10).map((category, index) => {
            const percentage = ((category.amount / categoryData.reduce((sum, c) => sum + c.amount, 0)) * 100)
            return (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-textBase font-medium">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-titles font-medium">{formatCurrency(category.amount)}</div>
                  <div className="text-gray300 text-sm">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
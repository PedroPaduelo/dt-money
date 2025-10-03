import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface TransactionChartProps {
  transactions: Transaction[]
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  // Agrupar transações por categoria
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category

    if (!acc[category]) {
      acc[category] = {
        category,
        receitas: 0,
        despesas: 0
      }
    }

    if (transaction.price > 0) {
      acc[category].receitas += transaction.price
    } else {
      acc[category].despesas += Math.abs(transaction.price)
    }

    return acc
  }, {} as Record<string, { category: string; receitas: number; despesas: number }>)

  const chartData = Object.values(categoryData)

  return (
    <div className="bg-shapeSecondary p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-titles">Transações por Categoria</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#323238" />
          <XAxis dataKey="category" stroke="#C4C4CC" tick={{ fill: '#C4C4CC' }} />
          <YAxis stroke="#C4C4CC" tick={{ fill: '#C4C4CC' }} />
          <Tooltip
            formatter={(value: number) => `R$ ${value.toFixed(2)}`}
            contentStyle={{
              backgroundColor: '#29292E',
              border: '1px solid #323238',
              color: '#E1E1E6'
            }}
            labelStyle={{ color: '#E1E1E6' }}
          />
          <Legend wrapperStyle={{ color: '#C4C4CC' }} />
          <Bar dataKey="receitas" fill="#00B37E" name="Receitas" />
          <Bar dataKey="despesas" fill="#F75A68" name="Despesas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

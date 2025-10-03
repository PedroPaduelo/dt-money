interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface Budget {
  id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
}

// Gera uma data aleatória nos últimos 3 meses
const getRandomDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString().split('T')[0]
}

export const mockTransactions: Transaction[] = [
  // Receitas
  {
    id: '1',
    description: 'Salário Mensal',
    price: 5000,
    category: 'Salário',
    date: getRandomDate(30),
    type: 'income'
  },
  {
    id: '2',
    description: 'Freelance - Desenvolvimento Web',
    price: 1500,
    category: 'Venda',
    date: getRandomDate(45),
    type: 'income'
  },
  {
    id: '3',
    description: 'Bônus',
    price: 800,
    category: 'Salário',
    date: getRandomDate(60),
    type: 'income'
  },
  {
    id: '4',
    description: 'Consultoria',
    price: 2000,
    category: 'Venda',
    date: getRandomDate(20),
    type: 'income'
  },

  // Despesas - Alimentação
  {
    id: '5',
    description: 'Supermercado',
    price: -450,
    category: 'Alimentação',
    date: getRandomDate(10),
    type: 'outcome'
  },
  {
    id: '6',
    description: 'Restaurante',
    price: -120,
    category: 'Alimentação',
    date: getRandomDate(5),
    type: 'outcome'
  },
  {
    id: '7',
    description: 'Padaria',
    price: -80,
    category: 'Alimentação',
    date: getRandomDate(3),
    type: 'outcome'
  },
  {
    id: '8',
    description: 'iFood',
    price: -65,
    category: 'Alimentação',
    date: getRandomDate(2),
    type: 'outcome'
  },

  // Despesas - Transporte
  {
    id: '9',
    description: 'Combustível',
    price: -200,
    category: 'Transporte',
    date: getRandomDate(7),
    type: 'outcome'
  },
  {
    id: '10',
    description: 'Uber',
    price: -45,
    category: 'Transporte',
    date: getRandomDate(4),
    type: 'outcome'
  },
  {
    id: '11',
    description: 'Manutenção do carro',
    price: -350,
    category: 'Transporte',
    date: getRandomDate(25),
    type: 'outcome'
  },

  // Despesas - Casa
  {
    id: '12',
    description: 'Aluguel',
    price: -1200,
    category: 'Casa',
    date: getRandomDate(5),
    type: 'outcome'
  },
  {
    id: '13',
    description: 'Conta de Luz',
    price: -150,
    category: 'Casa',
    date: getRandomDate(15),
    type: 'outcome'
  },
  {
    id: '14',
    description: 'Conta de Água',
    price: -80,
    category: 'Casa',
    date: getRandomDate(20),
    type: 'outcome'
  },
  {
    id: '15',
    description: 'Internet',
    price: -100,
    category: 'Casa',
    date: getRandomDate(12),
    type: 'outcome'
  },

  // Despesas - Lazer
  {
    id: '16',
    description: 'Cinema',
    price: -60,
    category: 'Lazer',
    date: getRandomDate(8),
    type: 'outcome'
  },
  {
    id: '17',
    description: 'Streaming (Netflix)',
    price: -35,
    category: 'Lazer',
    date: getRandomDate(5),
    type: 'outcome'
  },
  {
    id: '18',
    description: 'Academia',
    price: -90,
    category: 'Saúde',
    date: getRandomDate(10),
    type: 'outcome'
  },

  // Despesas - Saúde
  {
    id: '19',
    description: 'Plano de Saúde',
    price: -280,
    category: 'Saúde',
    date: getRandomDate(5),
    type: 'outcome'
  },
  {
    id: '20',
    description: 'Farmácia',
    price: -120,
    category: 'Saúde',
    date: getRandomDate(15),
    type: 'outcome'
  },

  // Despesas - Educação
  {
    id: '21',
    description: 'Curso Online',
    price: -200,
    category: 'Educação',
    date: getRandomDate(30),
    type: 'outcome'
  },
  {
    id: '22',
    description: 'Livros',
    price: -85,
    category: 'Educação',
    date: getRandomDate(20),
    type: 'outcome'
  },

  // Despesas - Itens
  {
    id: '23',
    description: 'Roupa',
    price: -250,
    category: 'Itens',
    date: getRandomDate(40),
    type: 'outcome'
  },
  {
    id: '24',
    description: 'Eletrônicos',
    price: -800,
    category: 'Itens',
    date: getRandomDate(50),
    type: 'outcome'
  }
]

export const mockBudgets: Budget[] = [
  {
    id: 'budget-1',
    category: 'Alimentação',
    amount: 800,
    period: 'monthly'
  },
  {
    id: 'budget-2',
    category: 'Transporte',
    amount: 600,
    period: 'monthly'
  },
  {
    id: 'budget-3',
    category: 'Casa',
    amount: 1600,
    period: 'monthly'
  },
  {
    id: 'budget-4',
    category: 'Lazer',
    amount: 300,
    period: 'monthly'
  },
  {
    id: 'budget-5',
    category: 'Saúde',
    amount: 500,
    period: 'monthly'
  },
  {
    id: 'budget-6',
    category: 'Educação',
    amount: 400,
    period: 'monthly'
  }
]

// Função auxiliar para popular o banco de dados com dados mockados
export const populateWithMockData = async (
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>,
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>
) => {
  try {
    // Adiciona transações mockadas
    for (const transaction of mockTransactions) {
      const { id, ...transactionData } = transaction
      await addTransaction(transactionData)
    }

    // Adiciona orçamentos mockados
    for (const budget of mockBudgets) {
      const { id, ...budgetData } = budget
      await addBudget(budgetData)
    }

    console.log('Dados mockados adicionados com sucesso!')
  } catch (error) {
    console.error('Erro ao adicionar dados mockados:', error)
  }
}

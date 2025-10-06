import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Header from './components/Header'
import Summary from './components/Summary'
import Transactions from './components/Transactions'
import NewTransactionModal from './components/NewTransactionModal'
import BudgetManager from './components/BudgetManager'
import TransactionChart from './components/TransactionChart'
import { useIndexedDB } from './hooks/useIndexedDB'
import { populateWithMockData } from './data/mockData'
import { AppSidebar } from './components/app-sidebar'

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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getCategories,
    addCategory,
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    isReady
  } = useIndexedDB()

  useEffect(() => {
    if (isReady) {
      loadTransactions()
      loadCategories()
      loadBudgets()
      initializeDefaultCategories()
    }
  }, [isReady])

  const initializeDefaultCategories = async () => {
    try {
      const existingCategories = await getCategories()
      if (existingCategories.length === 0) {
        const defaultCategories = [
          { name: 'Salário', type: 'income' as const, color: '#00B37F' },
          { name: 'Venda', type: 'income' as const, color: '#00B37F' },
          { name: 'Alimentação', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Transporte', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Casa', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Lazer', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Saúde', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Educação', type: 'outcome' as const, color: '#F75A68' },
          { name: 'Itens', type: 'outcome' as const, color: '#F75A68' }
        ]

        for (const cat of defaultCategories) {
          await addCategory(cat)
        }
        loadCategories()
      }
    } catch (error) {
      console.error('Error initializing categories:', error)
    }
  }

  const loadTransactions = async (filters?: any) => {
    try {
      const data = await getTransactions(filters)
      setTransactions(data)
      setFilteredTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data.map(cat => cat.name))
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadBudgets = async () => {
    try {
      const data = await getBudgets()
      setBudgets(data)
    } catch (error) {
      console.error('Error loading budgets:', error)
    }
  }

  const handleSaveTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      if (editingTransaction && editingTransaction.id) {
        await updateTransaction(editingTransaction.id, newTransaction)
      } else {
        await addTransaction(newTransaction)
      }
      await loadTransactions()
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      await addBudget(budget)
      await loadBudgets()
    } catch (error) {
      console.error('Error adding budget:', error)
    }
  }

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      await updateBudget(id, updates)
      await loadBudgets()
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id)
      await loadBudgets()
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      await loadTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleSearch = (filters: any) => {
    loadTransactions(filters)
  }

  const handleNewTransaction = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleLoadMockData = async () => {
    if (confirm('Deseja carregar dados mockados? Isso adicionará transações e orçamentos de exemplo.')) {
      await populateWithMockData(addTransaction, addBudget)
      await loadTransactions()
      await loadBudgets()
    }
  }

  const summary = transactions.reduce((acc, transaction) => {
    if (transaction.price > 0) {
      acc.income += transaction.price
    } else {
      acc.outcome += Math.abs(transaction.price)
    }
    acc.total = acc.income - acc.outcome
    return acc
  }, { income: 0, outcome: 0, total: 0 })

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <main className="max-w-[1120px] mx-auto px-4">
          <div className="mb-6">
            <SidebarTrigger />
          </div>
          <Header 
            onNewTransaction={handleNewTransaction} 
            onLoadMockData={handleLoadMockData} 
          />
          <Summary
            income={summary.income}
            outcome={summary.outcome}
            total={summary.total}
          />
          <TransactionChart transactions={transactions} />
          <Transactions
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onSearch={handleSearch}
            categories={categories}
            key={JSON.stringify(filteredTransactions)}
          />
          <BudgetManager
            budgets={budgets}
            transactions={transactions}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        </main>

        <NewTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTransaction(null)
          }}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction}
        />
      </div>
    </SidebarProvider>
  )
}

export default App
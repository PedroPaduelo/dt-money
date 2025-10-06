import { useState } from "react"
import { Menu, X } from "lucide-react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Summary from "./Summary"
import Transactions from "./Transactions"
import NewTransactionModal from "./NewTransactionModal"
import BudgetManager from "./BudgetManager"
import TransactionChart from "./TransactionChart"
import { useIndexedDB } from "../hooks/useIndexedDB"
import { populateWithMockData } from "../data/mockData"

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

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  // ... (keep all existing functions from App.tsx)
  
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - Always visible on desktop, toggle on mobile */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:relative z-40 h-full`}>
        <Sidebar className={`${!isSidebarOpen ? 'lg:translate-x-0' : ''}`} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1120px] mx-auto px-4 py-6">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden mb-6 pt-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Menu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">DT Money</h1>
                  <p className="text-xs text-gray-500">Sistema Financeiro</p>
                </div>
              </div>
              <button
                onClick={handleNewTransaction}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Nova Transação
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <Header 
              onNewTransaction={handleNewTransaction} 
              onLoadMockData={handleLoadMockData} 
            />
          </div>

          {/* Main Content Area */}
          <main className="space-y-6">
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
        </div>

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
    </div>
  )
}

export default Layout
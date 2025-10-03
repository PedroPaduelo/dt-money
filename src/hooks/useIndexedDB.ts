import { useState, useEffect } from 'react'

interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface Category {
  id: string
  name: string
  type: 'income' | 'outcome'
  color: string
}

interface Budget {
  id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
}

const DB_NAME = 'dt-money-db'
const DB_VERSION = 2

export function useIndexedDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Error opening IndexedDB')
    }

    request.onsuccess = () => {
      setDb(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains('transactions')) {
        const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true })
        transactionsStore.createIndex('date', 'date', { unique: false })
        transactionsStore.createIndex('type', 'type', { unique: false })
        transactionsStore.createIndex('category', 'category', { unique: false })
      }

      if (!db.objectStoreNames.contains('categories')) {
        const categoriesStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true })
        categoriesStore.createIndex('type', 'type', { unique: false })
      }

      if (!db.objectStoreNames.contains('budgets')) {
        const budgetsStore = db.createObjectStore('budgets', { keyPath: 'id', autoIncrement: true })
        budgetsStore.createIndex('category', 'category', { unique: false })
      }
    }
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    return new Promise<string>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('transactions', 'readwrite')
        .objectStore('transactions')
        .add(transaction)

      request.onsuccess = () => {
        resolve(request.result as string)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const getTransactions = async (filters?: {
    query?: string
    category?: string
    type?: 'all' | 'income' | 'outcome'
    dateFrom?: string
    dateTo?: string
  }) => {
    return new Promise<Transaction[]>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('transactions', 'readonly')
        .objectStore('transactions')
        .getAll()

      request.onsuccess = () => {
        let transactions = request.result

        if (filters) {
          if (filters.query) {
            transactions = transactions.filter(t =>
              t.description.toLowerCase().includes(filters.query!.toLowerCase())
            )
          }
          if (filters.category && filters.category !== 'all') {
            transactions = transactions.filter(t => t.category === filters.category)
          }
          if (filters.type && filters.type !== 'all') {
            transactions = transactions.filter(t => t.type === filters.type)
          }
          if (filters.dateFrom) {
            transactions = transactions.filter(t => t.date >= filters.dateFrom!)
          }
          if (filters.dateTo) {
            transactions = transactions.filter(t => t.date <= filters.dateTo!)
          }
        }

        resolve(transactions)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('transactions', 'readwrite')
        .objectStore('transactions')
        .get(id)

      request.onsuccess = () => {
        const transaction = request.result
        const updatedTransaction = { ...transaction, ...updates }

        const updateRequest = db
          .transaction('transactions', 'readwrite')
          .objectStore('transactions')
          .put(updatedTransaction)

        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const deleteTransaction = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('transactions', 'readwrite')
        .objectStore('transactions')
        .delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const getCategories = async () => {
    return new Promise<Category[]>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('categories', 'readonly')
        .objectStore('categories')
        .getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const addCategory = async (category: Omit<Category, 'id'>) => {
    return new Promise<string>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('categories', 'readwrite')
        .objectStore('categories')
        .add(category)

      request.onsuccess = () => {
        resolve(request.result as string)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const getBudgets = async () => {
    return new Promise<Budget[]>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('budgets', 'readonly')
        .objectStore('budgets')
        .getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    return new Promise<string>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('budgets', 'readwrite')
        .objectStore('budgets')
        .add(budget)

      request.onsuccess = () => {
        resolve(request.result as string)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('budgets', 'readwrite')
        .objectStore('budgets')
        .get(id)

      request.onsuccess = () => {
        const budget = request.result
        const updatedBudget = { ...budget, ...updates }

        const updateRequest = db
          .transaction('budgets', 'readwrite')
          .objectStore('budgets')
          .put(updatedBudget)

        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  const deleteBudget = async (id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'))
        return
      }

      const request = db
        .transaction('budgets', 'readwrite')
        .objectStore('budgets')
        .delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  return {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getCategories,
    addCategory,
    getBudgets,
    isReady: !!db
  }
}
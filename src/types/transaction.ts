/**
 * Transaction and related type definitions
 */

// Base entity interface
export interface BaseEntity {
  id: string
}

// Transaction types
export type TransactionType = 'income' | 'outcome'

// Transaction interface
export interface Transaction extends BaseEntity {
  description: string
  price: number
  category: string
  date: string
  type: TransactionType
}

// Transaction creation data (without id)
export type CreateTransactionInput = Omit<Transaction, 'id'>

// Transaction update data (partial, without id)
export type UpdateTransactionInput = Partial<Omit<Transaction, 'id'>>

// Transaction filters
export interface TransactionFilters {
  query?: string
  category?: string
  type?: 'all' | TransactionType
  dateFrom?: string
  dateTo?: string
}

// Transaction statistics
export interface TransactionStats {
  income: number
  outcome: number
  total: number
}

// Category types
export type CategoryType = TransactionType

// Category interface
export interface Category extends BaseEntity {
  name: string
  type: CategoryType
  color: string
}

// Category creation data (without id)
export type CreateCategoryInput = Omit<Category, 'id'>

// Category update data (partial, without id)
export type UpdateCategoryInput = Partial<Omit<Category, 'id'>>

// Budget period types
export type BudgetPeriod = 'monthly' | 'yearly'

// Budget interface
export interface Budget extends BaseEntity {
  category: string
  amount: number
  period: BudgetPeriod
}

// Budget creation data (without id)
export type CreateBudgetInput = Omit<Budget, 'id'>

// Budget update data (partial, without id)
export type UpdateBudgetInput = Partial<Omit<Budget, 'id'>>

// Budget status
export interface BudgetStatus {
  spent: number
  remaining: number
  percentage: number
  isOverBudget: boolean
}

// Budget with status
export interface BudgetWithStatus extends Budget {
  status: BudgetStatus
}

// Date range
export interface DateRange {
  from: string
  to: string
}

// Monthly summary
export interface MonthlySummary {
  month: string
  income: number
  outcome: number
  total: number
  transactionCount: number
  categories: CategorySummary[]
}

// Category summary
export interface CategorySummary {
  category: string
  type: CategoryType
  amount: number
  transactionCount: number
  percentage: number
}

// Transaction validation errors
export interface TransactionValidationError {
  field: keyof Transaction
  message: string
  value?: any
}

// Transaction validation result
export interface TransactionValidationResult {
  isValid: boolean
  errors: TransactionValidationError[]
}

// Database operations result types
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateResult extends OperationResult<string> {
  data: string // ID of created entity
}

export interface ReadResult<T> extends OperationResult<T[]> {
  data: T[]
}

export interface UpdateResult extends OperationResult {
  message?: string
}

export interface DeleteResult extends OperationResult {
  message?: string
}

// Search options
export interface SearchOptions {
  query?: string
  sortBy?: keyof Transaction
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Export/Import types
export interface ExportData {
  version: string
  exportDate: string
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
}

export interface ImportResult {
  success: boolean
  imported: {
    transactions: number
    categories: number
    budgets: number
  }
  errors: string[]
  warnings: string[]
}

// Color palette for categories
export const DEFAULT_CATEGORY_COLORS = [
  '#00B37E', // Green
  '#DC2626', // Red
  '#2563EB', // Blue
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
] as const

export type CategoryColor = typeof DEFAULT_CATEGORY_COLORS[number]
import { useState, useMemo } from 'react'
import SearchFilters from './SearchFilters'
import TransactionActions from './TransactionActions'

interface TransactionsProps {
  transactions: Array<{
    id?: string
    description: string
    price: number
    category: string
    date: string
    type: 'income' | 'outcome'
  }>
  onEdit: (transaction: any) => void
  onDelete: (id: string) => void
  onSearch: (filters: any) => void
  categories: string[]
}

function Transactions({ transactions, onEdit, onDelete, onSearch, categories }: TransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return transactions.slice(startIndex, endIndex)
  }, [transactions, currentPage])

  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <section className="mt-12">
      <SearchFilters onSearch={onSearch} categories={categories} />

      <div className="bg-shapeSecondary rounded-lg">
        <div className="p-5 border-b border-shapeTertiary">
          <div className="grid grid-cols-[1fr_200px_240px_92px_60px] gap-2">
            <span className="text-textBase text-sm">Descrição</span>
            <span className="text-textBase text-sm">Preço</span>
            <span className="text-textBase text-sm">Categoria</span>
            <span className="text-textBase text-sm">Data</span>
            <span className="text-textBase text-sm">Ações</span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray300">Nenhuma transação encontrada</p>
          </div>
        ) : (
          paginatedTransactions.map((transaction) => (
            <div key={transaction.id} className="p-5 border-b border-shapeTertiary">
              <div className="grid grid-cols-[1fr_200px_240px_92px_60px] gap-2 items-center">
                <span className="text-textBase text-sm">{transaction.description}</span>
                <span className={`text-sm ${transaction.price > 0 ? 'text-igniteLight' : 'text-brandRed'}`}>
                  {formatCurrency(transaction.price)}
                </span>
                <span className="text-textBase text-sm">{transaction.category}</span>
                <span className="text-textBase text-sm">{formatDate(transaction.date)}</span>
                <TransactionActions
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="text-sm text-gray300">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, transactions.length)} de {transactions.length} transações
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray500 cursor-not-allowed'
                  : 'text-gray300 hover:text-white hover:bg-shapeSecondary'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="flex gap-2">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-igniteDark text-white'
                      : 'bg-shapeTertiary text-gray300 hover:bg-shapeSecondary hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray500 cursor-not-allowed'
                  : 'text-gray300 hover:text-white hover:bg-shapeSecondary'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Transactions
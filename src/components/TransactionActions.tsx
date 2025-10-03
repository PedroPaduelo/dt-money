import { useState } from 'react'

interface Transaction {
  id?: string
  description: string
  price: number
  category: string
  date: string
  type: 'income' | 'outcome'
}

interface TransactionActionsProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionActions({ transaction, onEdit, onDelete }: TransactionActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!transaction.id) return null

  return (
    <div className="relative group">
      <button className="text-gray300 hover:text-white transition-colors p-1">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5V6H10V5Z" fill="currentColor"/>
          <path d="M6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5V6H6V5Z" fill="currentColor"/>
          <path d="M14 5C14 4.44772 13.5523 4 13 4C12.4477 4 12 4.44772 12 5V6H14V5Z" fill="currentColor"/>
          <path d="M4 7C2.89543 7 2 7.89543 2 9V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V9C18 7.89543 17.1046 7 16 7H4Z" fill="currentColor"/>
        </svg>
      </button>

      <div className="absolute right-0 top-8 bg-shapeSecondary border border-shapeTertiary rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[200px]">
        <div className="p-4">
          <div className="mb-3 pb-3 border-b border-shapeTertiary">
            <p className="font-medium text-titles text-sm">{transaction.description}</p>
            <p className={`text-xs ${transaction.price > 0 ? 'text-igniteLight' : 'text-brandRed'}`}>
              {formatCurrency(transaction.price)}
            </p>
            <p className="text-xs text-gray300">{formatDate(transaction.date)}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onEdit(transaction)}
              className="w-full text-left px-3 py-2 text-sm text-textBase hover:bg-shapeTertiary rounded transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2L13.9997 4.66667L5.66634 13L2.99967 13L2.99967 10.3333L11.333 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Editar
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full text-left px-3 py-2 text-sm text-brandRed hover:bg-shapeTertiary rounded transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33301 4V2.66667C5.33301 2.29848 5.47944 1.94554 5.72949 1.69549C5.97954 1.44544 6.33248 1.29901 6.70067 1.29901H9.36634C9.73453 1.29901 10.0875 1.44544 10.3375 1.69549C10.5876 1.94554 10.734 2.29848 10.734 2.66667V4M12.6663 4V13.3333C12.6663 13.7015 12.5199 14.0545 12.2699 14.3045C12.0198 14.5546 11.6669 14.701 11.2987 14.701H4.76801C4.39982 14.701 4.04688 14.5546 3.79683 14.3045C3.54678 14.0545 3.40035 13.7015 3.40035 13.3333V4H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Excluir
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 bg-shapePrimary rounded-lg p-4 border border-brandRed">
            <p className="text-sm text-brandRed font-medium mb-3">Confirmar exclusão?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-3 py-2 text-xs text-textBase bg-shapeTertiary rounded hover:bg-shapeSecondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(transaction.id!)
                  setShowConfirm(false)
                }}
                className="flex-1 px-3 py-2 text-xs text-white bg-brandRed rounded hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
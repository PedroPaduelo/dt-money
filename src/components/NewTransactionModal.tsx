import { useState, useEffect } from 'react'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: {
    description: string
    price: number
    category: string
    date: string
    type: 'income' | 'outcome'
  }) => void
  editingTransaction?: {
    id?: string
    description: string
    price: number
    category: string
    date: string
    type: 'income' | 'outcome'
  }
}

export default function NewTransactionModal({ isOpen, onClose, onSave, editingTransaction }: NewTransactionModalProps) {
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<'income' | 'outcome'>('income')

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description)
      setPrice(Math.abs(editingTransaction.price).toString())
      setCategory(editingTransaction.category)
      setDate(editingTransaction.date)
      setType(editingTransaction.type)
    } else {
      setDescription('')
      setPrice('')
      setCategory('')
      setDate('')
      setType('income')
    }
  }, [editingTransaction, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const transactionData = {
      description,
      price: type === 'outcome' ? -Math.abs(Number(price)) : Number(price),
      category,
      date,
      type
    }

    onSave(transactionData)

    // Reset form
    setDescription('')
    setPrice('')
    setCategory('')
    setDate('')
    setType('income')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-shapePrimary rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-titles mb-6">
          {editingTransaction ? 'Editar transação' : 'Nova transação'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-textBase text-sm mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-igniteLight"
              placeholder="Descrição"
              required
            />
          </div>

          <div>
            <label className="block text-textBase text-sm mb-2">Preço</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-igniteLight"
              placeholder="0,00"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-textBase text-sm mb-2">Categoria</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-igniteLight"
              placeholder="Categoria"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-textBase text-sm mb-2">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-igniteLight"
                required
              />
            </div>

            <div>
              <label className="block text-textBase text-sm mb-2">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'outcome')}
                className="w-full px-4 py-3 bg-shapeSecondary border border-shapeTertiary rounded-lg text-textBase focus:outline-none focus:ring-2 focus:ring-igniteLight"
              >
                <option value="income">Entrada</option>
                <option value="outcome">Saída</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-shapeSecondary text-textBase rounded-lg hover:bg-shapeTertiary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-igniteLight text-white rounded-lg hover:bg-igniteMid transition-colors"
            >
              {editingTransaction ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
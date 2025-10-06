import { useState } from 'react'

interface SearchFiltersProps {
  onSearch: (filters: {
    query: string
    category: string
    type: 'all' | 'income' | 'outcome'
    dateFrom: string
    dateTo: string
  }) => void
  categories: string[]
}

export default function SearchFilters({ onSearch, categories }: SearchFiltersProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState<'all' | 'income' | 'outcome'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ query, category, type, dateFrom, dateTo })
  }

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setType('all')
    setDateFrom('')
    setDateTo('')
    onSearch({ query: '', category: 'all', type: 'all', dateFrom: '', dateTo: '' })
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar transação..."
              className="w-full bg-background rounded-lg px-4 py-3 text-textBase placeholder:text-placeholder text-sm"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background rounded-lg px-4 py-3 text-textBase text-sm"
            >
              <option value="all">Todas categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | 'income' | 'outcome')}
              className="w-full bg-background rounded-lg px-4 py-3 text-textBase text-sm"
            >
              <option value="all">Todos tipos</option>
              <option value="income">Entradas</option>
              <option value="outcome">Saídas</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Data inicial"
                className="w-full bg-background rounded-lg px-4 py-3 text-textBase text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Data final"
                className="w-full bg-background rounded-lg px-4 py-3 text-textBase text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-3 rounded-lg text-white font-medium text-sm"
          >
            Filtrar
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="bg-shapeSecondary hover:bg-shapeTertiary transition-colors px-6 py-3 rounded-lg text-textBase font-medium text-sm"
          >
            Limpar filtros
          </button>
        </div>
      </form>
    </div>
  )
}
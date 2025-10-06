import React, { useState, useEffect } from 'react';

// SVG inline para X (sem dependência externa)
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

// SVG inline para seta para cima (entrada)
const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

// SVG inline para seta para baixo (saída)
const TrendingDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
);

const NewTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('alimentacao');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load categories from IndexedDB
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const request = indexedDB.open('dtmoney', 1);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['categories'], 'readonly');
          const store = transaction.objectStore('categories');
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const defaultCategories = [
              { id: 'alimentacao', name: 'Alimentação', color: '#10b981' },
              { id: 'transporte', name: 'Transporte', color: '#f59e0b' },
              { id: 'moradia', name: 'Moradia', color: '#3b82f6' },
              { id: 'lazer', name: 'Lazer', color: '#8b5cf6' },
              { id: 'saude', name: 'Saúde', color: '#ef4444' },
              { id: 'educacao', name: 'Educação', color: '#06b6d4' },
              { id: 'outros', name: 'Outros', color: '#6b7280' }
            ];
            
            if (getAllRequest.result.length > 0) {
              setCategories(getAllRequest.result);
            } else {
              setCategories(defaultCategories);
            }
          };
        };
      } catch (error) {
        console.error('Error loading categories:', error);
        const defaultCategories = [
          { id: 'alimentacao', name: 'Alimentação', color: '#10b981' },
          { id: 'transporte', name: 'Transporte', color: '#f59e0b' },
          { id: 'moradia', name: 'Moradia', color: '#3b82f6' },
          { id: 'lazer', name: 'Lazer', color: '#8b5cf6' },
          { id: 'saude', name: 'Saúde', color: '#ef4444' },
          { id: 'educacao', name: 'Educação', color: '#06b6d4' },
          { id: 'outros', name: 'Outros', color: '#6b7280' }
        ];
        setCategories(defaultCategories);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description || !amount) return;
    
    setIsLoading(true);
    
    const transaction = {
      id: Date.now().toString(),
      description,
      amount: type === 'outcome' ? -Math.abs(parseFloat(amount)) : parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    };

    try {
      const request = indexedDB.open('dtmoney', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['transactions'], 'readwrite');
        const store = transaction.objectStore('transactions');
        
        store.add(transaction);
        
        transaction.oncomplete = () => {
          onSave(transaction);
          // Reset form
          setDescription('');
          setAmount('');
          setType('income');
          setCategory('alimentacao');
          setIsLoading(false);
          onClose();
        };
        
        transaction.onerror = () => {
          console.error('Error saving transaction');
          setIsLoading(false);
        };
      };
      
      request.onerror = () => {
        console.error('Error opening database');
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Nova Transação</h2>
            <p className="text-sm text-gray-400 mt-1">Adicione uma nova entrada ou saída</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  type === 'income'
                    ? 'bg-green-600 text-white border-2 border-green-600'
                    : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                }`}
              >
                <TrendingUpIcon />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType('outcome')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  type === 'outcome'
                    ? 'bg-red-600 text-white border-2 border-red-600'
                    : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                }`}
              >
                <TrendingDownIcon />
                Saída
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Compras no mercado..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Valor
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="R$ 0,00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
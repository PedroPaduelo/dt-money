import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id?: number;
  description: string;
  amount: number;
  type: 'income' | 'outcome';
  category: string;
  createdAt: Date;
}

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'outcome'>('income');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Carregar categorias do IndexedDB
    const loadCategories = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(['categories'], 'readonly');
        const store = transaction.objectStore('categories');
        const request = store.getAll();
        
        request.onsuccess = () => {
          const categoryList = request.result.map((cat: any) => cat.name);
          setCategories(categoryList);
          if (categoryList.length > 0) {
            setCategory(categoryList[0]);
          }
        };
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setType('income');
      setCategory('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      return;
    }

    const transactionAmount = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      return;
    }

    onSave({
      description,
      amount: transactionAmount,
      type,
      category
    });

    onClose();
  };

  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('dtmoney', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Nova Transação</h2>
            <p className="text-gray-400 text-sm mt-1">Adicione uma nova entrada ou saída</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Salário, Aluguel, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-lg">R$</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  type === 'income'
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType('outcome')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  type === 'outcome'
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Saída
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="" className="bg-gray-800">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
import React, { useState, useEffect } from 'react';

// SVG Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const CategoriesTable = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Salário', color: '#10b981', icon: '$', type: 'entrada' },
    { id: 2, name: 'Alimentação', color: '#ef4444', icon: '🍔', type: 'saida' },
    { id: 3, name: 'Transporte', color: '#f59e0b', icon: '🚗', type: 'saida' },
    { id: 4, name: 'Freelance', color: '#3b82f6', icon: '💼', type: 'entrada' },
    { id: 5, name: 'Aluguel', color: '#8b5cf6', icon: '🏠', type: 'saida' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData }
          : cat
      ));
    } else {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...categoryData
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Categorias</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>+</span>
          Nova Categoria
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Nome</th>
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Cor</th>
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Ícone</th>
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Tipo</th>
              <th className="text-left py-3 px-4 text-gray-300 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="py-3 px-4 text-white font-medium">{category.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-400 text-sm">{category.color}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-2xl">{category.icon}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category.type === 'entrada' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {category.type === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#10b981',
    icon: category?.icon || '📁',
    type: category?.type || 'entrada'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">
          {category ? 'Editar Categoria' : 'Nova Categoria'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Cor</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Ícone</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="📁">📁 Pasta</option>
              <option value="💼">💼 Trabalho</option>
              <option value="🍔">🍔 Comida</option>
              <option value="🚗">🚗 Carro</option>
              <option value="🏠">🏠 Casa</option>
              <option value="💰">💰 Dinheiro</option>
              <option value="🎮">🎮 Jogos</option>
              <option value="🛒">🛒 Compras</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tipo</label>
            <div className="flex gap-4">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  value="entrada"
                  checked={formData.type === 'entrada'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                Entrada
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  value="saida"
                  checked={formData.type === 'saida'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                Saída
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriesTable;
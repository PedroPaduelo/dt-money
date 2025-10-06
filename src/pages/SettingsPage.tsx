import { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';

const SettingsPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [settings, setSettings] = useState({
    currency: 'BRL',
    theme: 'dark',
    language: 'pt-BR',
    notifications: true,
    monthlyBudget: 5000
  });
  
  const { getCategories, addCategory, isReady } = useIndexedDB();

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady]);

  const loadData = async () => {
    try {
      const categoriesData = await getCategories();
      const categoryNames = categoriesData.map(cat => cat.name);
      setCategories(categoryNames);
      
      // Carregar configurações do localStorage
      const savedSettings = localStorage.getItem('dtmoney-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      console.log('SettingsPage - Dados carregados:', categoryNames);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setCategories(['Salário', 'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação']);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      try {
        await addCategory({ name: newCategory.trim() });
        setCategories([...categories, newCategory.trim()]);
        setNewCategory('');
        console.log('Categoria adicionada com sucesso:', newCategory.trim());
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
      }
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter(cat => cat !== category));
    console.log('Categoria removida:', category);
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('dtmoney-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Personalize sua experiência no DT Money</p>
      </div>
      
      {/* Configurações Gerais */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Configurações Gerais</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moeda
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Orçamento Mensal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">R$</span>
                <input
                  type="number"
                  value={settings.monthlyBudget}
                  onChange={(e) => handleSettingChange('monthlyBudget', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notificações
                </label>
                <p className="text-xs text-gray-400">Receber alertas sobre orçamentos</p>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gerenciamento de Categorias */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Categorias de Transações</h2>
        
        <div className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Nova categoria"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddCategory}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
            >
              <span className="text-white">{category}</span>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma categoria encontrada</p>
            <p className="text-gray-500 text-sm mt-1">Adicione categorias para organizar suas transações</p>
          </div>
        )}
      </div>

      {/* Exportar/Importar Dados */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Dados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Exportar Dados</h3>
            <p className="text-gray-400 text-sm mb-4">
              Faça backup dos seus dados financeiros
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Exportar para CSV
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Importar Dados</h3>
            <p className="text-gray-400 text-sm mb-4">
              Importe dados de outros sistemas
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Importar do OFX
            </button>
          </div>
        </div>
      </div>

      {/* Sobre */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Sobre</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Versão</span>
            <span className="text-white">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Desenvolvedor</span>
            <span className="text-white">DT Money Team</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Última atualização</span>
            <span className="text-white">06/10/2024</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex space-x-4">
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Documentação
            </button>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Suporte
            </button>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
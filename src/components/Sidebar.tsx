import { useState } from "react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

const Sidebar = ({ onCloseMobile }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Início',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      href: '#'
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      href: '#'
    },
    {
      id: 'summary',
      label: 'Resumo',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      href: '#'
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"></path>
          <path d="M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
          <path d="M9 12h6"></path>
        </svg>
      ),
      submenu: [
        { id: 'manage-budgets', label: 'Gerenciar Orçamentos', href: '#' },
        { id: 'goals', label: 'Metas', href: '#' }
      ]
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      submenu: [
        { id: 'expenses-by-category', label: 'Despesas por Categoria', href: '#' },
        { id: 'income-vs-expenses', label: 'Receitas vs Despesas', href: '#' },
        { id: 'monthly-evolution', label: 'Evolução Mensal', href: '#' }
      ]
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M12 23v-6m0-6V1m-4.22 13.22L3.54 9.96M22.46 14.04l-4.24-4.24"></path>
        </svg>
      ),
      submenu: [
        { id: 'categories', label: 'Categorias', href: '#' },
        { id: 'preferences', label: 'Preferências', href: '#' }
      ]
    }
  ];

  const handleMenuItemClick = (href: string) => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">DT</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">DT Money</h1>
            <p className="text-sm text-gray-500">Gestão Financeira</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.submenu) {
                  toggleExpanded(item.id);
                } else {
                  handleMenuItemClick(item.href);
                }
              }}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${item.submenu 
                  ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.submenu && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${expandedItems.includes(item.id) ? 'rotate-90' : ''}`}
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedItems.includes(item.id) && (
              <div className="mt-1 ml-4 space-y-1">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => handleMenuItemClick(subItem.href)}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                  >
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Usuário</p>
            <p className="text-xs text-gray-500 truncate">usuario@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
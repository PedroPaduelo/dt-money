import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Summary from "./Summary";
import Transactions from "./Transactions";
import CategoriesTable from "./CategoriesTable";

const Layout = ({ currentPage, setCurrentPage, isModalOpen, setIsModalOpen }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Salário", color: "#10b981", icon: "💰", type: "income" },
    { id: 2, name: "Alimentação", color: "#ef4444", icon: "🍔", type: "expense" },
    { id: 3, name: "Transporte", color: "#f59e0b", icon: "🚗", type: "expense" },
    { id: 4, name: "Moradia", color: "#3b82f6", icon: "🏠", type: "expense" },
    { id: 5, name: "Lazer", color: "#8b5cf6", icon: "🎮", type: "expense" },
    { id: 6, name: "Investimentos", color: "#06b6d4", icon: "📈", type: "income" },
  ]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#10b981",
    icon: "💰",
    type: "expense"
  });

  const handleCreateCategory = () => {
    if (newCategory.name.trim()) {
      const id = editingCategory ? editingCategory.id : Date.now();
      const categoryData = { ...newCategory, id };
      
      if (editingCategory) {
        setCategories(categories.map(cat => cat.id === id ? categoryData : cat));
      } else {
        setCategories([...categories, categoryData]);
      }
      
      setNewCategory({ name: "", color: "#10b981", icon: "💰", type: "expense" });
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Summary />
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Transações Recentes</h3>
              <Transactions />
            </div>
          </div>
        );
      case 'transactions':
        return <Transactions />;
      case 'summary':
        return <Summary />;
      case 'categories':
        return (
          <CategoriesTable 
            categories={categories}
            isModalOpen={isCategoryModalOpen}
            setIsModalOpen={setIsCategoryModalOpen}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            handleCreateCategory={handleCreateCategory}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
            editingCategory={editingCategory}
            setEditingCategory={setEditingCategory}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">Página em Desenvolvimento</h2>
            <p className="text-gray-400">Esta página estará disponível em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen}
      />
      
      <div className="lg:pl-64">
        <Header isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Layout;
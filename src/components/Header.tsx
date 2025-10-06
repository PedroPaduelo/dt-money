import React, { useState, useEffect } from "react";
import { useIndexedDB } from "../hooks/useIndexedDB";
import NewTransactionModal from "./NewTransactionModal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [summary, setSummary] = useState({
    income: 0,
    outcome: 0,
    total: 0,
    transactions: []
  });
  const { db, loading } = useIndexedDB();

  useEffect(() => {
    const date = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      if (db) {
        try {
          console.log("Carregando transações...");
          // Corrigido: Usando função correta getItems em vez de getAllItems
          const transactions = await db.getItems('transactions');
          console.log("Transações carregadas:", transactions);
          
          const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
            
          const outcome = transactions
            .filter((t) => t.type === "outcome")
            .reduce((sum, t) => sum + t.amount, 0);
            
          setSummary({
            income,
            outcome,
            total: income - outcome,
            transactions: transactions || [],
          });
        } catch (error) {
          console.error("Erro ao carregar transações:", error);
          setSummary({
            income: 0,
            outcome: 0,
            total: 0,
            transactions: [],
          });
        }
      }
    };

    loadTransactions();
  }, [db]);

  const handleSaveTransaction = async (transactionData) => {
    try {
      await db.addItem('transactions', {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });

      // Recarrega as transações para atualizar o resumo
      const transactions = await db.getItems('transactions');
      const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const outcome = transactions
        .filter((t) => t.type === "outcome")
        .reduce((sum, t) => sum + t.amount, 0);
        
      setSummary({
        income,
        outcome,
        total: income - outcome,
        transactions: transactions || [],
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            <span className="text-xl font-bold">$</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">DT Money</h1>
            <p className="text-sm text-gray-400">{currentDate}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="hidden sm:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Entradas:</span>
              <span className="text-green-400 font-semibold">
                {summary.income.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Saídas:</span>
              <span className="text-red-400 font-semibold">
                {summary.outcome.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Total:</span>
              <span
                className={`font-semibold ${
                  summary.total >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {summary.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Entradas:</span>
            <span className="text-green-400 font-semibold">
              {summary.income.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">Total:</span>
            <span
              className={`font-semibold ${
                summary.total >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {summary.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </header>
  );
};

export default Header;
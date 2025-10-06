import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import { useIndexedDB } from './hooks/useIndexedDB'
import Dashboard from './pages/Dashboard'
import TransactionsPage from './pages/TransactionsPage'
import SummaryPage from './pages/SummaryPage'
import BudgetsPage from './pages/BudgetsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const { isReady } = useIndexedDB()
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    if (isReady) {
      console.log('DT Money está pronto para uso!')
    }
  }, [isReady])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <TransactionsPage />
      case 'summary':
        return <SummaryPage />
      case 'budgets':
        return <BudgetsPage />
      case 'reports':
        return <ReportsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
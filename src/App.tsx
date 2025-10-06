import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

  useEffect(() => {
    if (isReady) {
      console.log('DT Money está pronto para uso!')
    }
  }, [isReady])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
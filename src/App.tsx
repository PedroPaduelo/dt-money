import { useEffect } from 'react'
import Layout from './components/Layout'
import { useIndexedDB } from './hooks/useIndexedDB'

function App() {
  const { isReady } = useIndexedDB()

  useEffect(() => {
    if (isReady) {
      console.log('DT Money está pronto para uso!')
    }
  }, [isReady])

  return <Layout />
}

export default App
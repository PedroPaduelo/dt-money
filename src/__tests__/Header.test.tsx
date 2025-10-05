import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Header from '../components/Header'

describe('Header Component', () => {
  const mockOnNewTransaction = vi.fn()
  const mockOnLoadMockData = vi.fn()

  it('renders header with title', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const title = screen.getByText('DT Money')
    expect(title).toBeInTheDocument()
  })

  it('renders new transaction button', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const newTransactionButton = screen.getByText('Nova transação')
    expect(newTransactionButton).toBeInTheDocument()
  })

  it('calls onNewTransaction when new transaction button is clicked', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const newTransactionButton = screen.getByText('Nova transação')
    newTransactionButton.click()
    
    expect(mockOnNewTransaction).toHaveBeenCalledTimes(1)
  })

  it('renders load mock data button when onNewTransaction is provided', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const loadMockButton = screen.getByText('Carregar dados mockados')
    expect(loadMockButton).toBeInTheDocument()
  })

  it('calls onNewTransaction when load mock data button is clicked', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const loadMockButton = screen.getByText('Carregar dados mockados')
    loadMockButton.click()
    
    expect(mockOnNewTransaction).toHaveBeenCalledTimes(1)
  })

  it('does not render load mock data button when onNewTransaction is not provided', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} />)
    
    const loadMockButton = screen.queryByText('Carregar dados mockados')
    expect(loadMockButton).not.toBeInTheDocument()
  })

  it('renders logo icon', () => {
    render(<Header onNewTransaction={mockOnNewTransaction} onNewTransaction={mockOnNewTransaction} />)
    
    const logo = document.querySelector('svg')
    expect(logo).toBeInTheDocument()
  })
})
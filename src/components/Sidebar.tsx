import * as React from "react"
import { ChevronDown, ChevronRight, Home, PieChart, DollarSign, FileText, Settings, CreditCard, TrendingUp, Target } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  children?: React.ReactNode
  defaultOpen?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  if (children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              {icon}
              <span>{label}</span>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 space-y-1">
          {children}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <a
      href={href || "#"}
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}

interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  return (
    <div className={`w-64 bg-white border-r border-gray-200 h-screen p-4 ${className}`}>
      <div className="space-y-6">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">DT Money</h1>
            <p className="text-xs text-gray-500">Sistema Financeiro</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="space-y-1">
          <SidebarItem
            icon={<Home className="h-4 w-4" />}
            label="Início"
            href="#"
          />
          
          <SidebarItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Transações"
            href="#"
          />
          
          <SidebarItem
            icon={<PieChart className="h-4 w-4" />}
            label="Resumo"
            href="#"
          />
          
          <SidebarItem
            icon={<Target className="h-4 w-4" />}
            label="Orçamentos"
            defaultOpen={true}
          >
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Gerenciar Orçamentos
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Metas
              </a>
            </div>
          </SidebarItem>
          
          <SidebarItem
            icon={<FileText className="h-4 w-4" />}
            label="Relatórios"
            defaultOpen={true}
          >
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Despesas por Categoria
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Receitas vs Despesas
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Evolução Mensal
              </a>
            </div>
          </SidebarItem>
          
          <SidebarItem
            icon={<Settings className="h-4 w-4" />}
            label="Configurações"
            defaultOpen={false}
          >
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Categorias
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                Preferências
              </a>
            </div>
          </SidebarItem>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200 pt-4">
            <p>© 2024 DT Money</p>
            <p className="mt-1">Sistema de controle financeiro</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
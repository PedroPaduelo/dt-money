import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  PieChart,
  CreditCard,
  Wallet,
  Target
} from "lucide-react"

const items = [
  {
    title: "Início",
    url: "#",
    icon: Home,
  },
  {
    title: "Transações",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Resumo",
    url: "#",
    icon: PieChart,
  },
  {
    title: "Orçamentos",
    url: "#",
    icon: Wallet,
    items: [
      {
        title: "Gerenciar Orçamentos",
        url: "#",
      },
      {
        title: "Metas",
        url: "#",
      },
    ],
  },
  {
    title: "Relatórios",
    url: "#",
    icon: TrendingUp,
    items: [
      {
        title: "Despesas por Categoria",
        url: "#",
      },
      {
        title: "Receitas vs Despesas",
        url: "#",
      },
      {
        title: "Evolução Mensal",
        url: "#",
      },
    ],
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "Categorias",
        url: "#",
      },
      {
        title: "Preferências",
        url: "#",
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">DT Money</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Controle Financeiro</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
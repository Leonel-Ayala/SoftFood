import { Link } from '@inertiajs/react';
// 1. Importamos los iconos exactos para un restaurante desde lucide-react
import { LayoutGrid, TrendingUp, Utensils, Users, Wallet } from 'lucide-react'; 
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// 2. Aquí construimos tu menú de SoftFood
const mainNavItems: NavItem[] = [
    {
        title: 'Panel Principal',
        href: dashboard(), // Mantiene la ruta base original del Starter Kit
        icon: LayoutGrid,
    },
    {
        title: 'Reportes de Venta',
        href: '/admin/reportes',
        icon: TrendingUp,
    },
    {
        title: 'Menú y Categorías',
        href: '/admin/menu',
        icon: Utensils,
    },
    {
        title: 'Gestión de Personal',
        href: '/admin/personal',
        icon: Users,
    },
    {
        title: 'Cierres de Caja',
        href: '/admin/caja',
        icon: Wallet,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* 3. Eliminamos el NavFooter viejo y dejamos solo el perfil del usuario */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    ShoppingBag,
    Tags,
    Truck,
    UtensilsCrossed,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard, login } from '@/routes';
import admin from '@/routes/admin';
import driver from '@/routes/driver';
import menu from '@/routes/menu';
import orders from '@/routes/orders';
import type { MaybeAuth, NavItem } from '@/types';
import { UserRole } from '@/types/enums';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: admin.dashboard(), icon: LayoutGrid },
    { title: 'Categories', href: admin.categories.index(), icon: Tags },
    {
        title: 'Menu Items',
        href: admin.menuItems.index(),
        icon: UtensilsCrossed,
    },
    { title: 'Orders', href: admin.orders.index(), icon: ShoppingBag },
    { title: 'Drivers', href: admin.drivers.index(), icon: Truck },
];

const driverNavItems: NavItem[] = [
    { title: 'Dashboard', href: driver.dashboard(), icon: LayoutGrid },
    { title: 'My Deliveries', href: driver.orders.index(), icon: Truck },
];

const customerNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Browse Menu', href: menu.index(), icon: UtensilsCrossed },
    { title: 'My Orders', href: orders.index(), icon: ShoppingBag },
];

const guestNavItems: NavItem[] = [
    { title: 'Browse Menu', href: menu.index(), icon: UtensilsCrossed },
    { title: 'Log in', href: login(), icon: LayoutGrid },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function useNavItemsForRole(): NavItem[] {
    const { auth } = usePage<{ auth: MaybeAuth }>().props;

    switch (auth.user?.role) {
        case UserRole.Admin:
            return adminNavItems;
        case UserRole.Driver:
            return driverNavItems;
        case UserRole.Customer:
            return customerNavItems;
        default:
            return guestNavItems;
    }
}

export function AppSidebar() {
    const mainNavItems = useNavItemsForRole();
    const { auth } = usePage<{ auth: MaybeAuth }>().props;
    const logoHref = auth.user ? dashboard() : menu.index();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

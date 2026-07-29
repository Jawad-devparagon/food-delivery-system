import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CartSheet } from '@/components/cart-sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType, MaybeAuth } from '@/types';
import { UserRole } from '@/types/enums';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth, cartCount } = usePage<{
        auth: MaybeAuth;
        cartCount: number;
    }>().props;

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {auth.user?.role === UserRole.Customer && (
                <div className="ml-auto">
                    <CartSheet count={cartCount} />
                </div>
            )}
        </header>
    );
}

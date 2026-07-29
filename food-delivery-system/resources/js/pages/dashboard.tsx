import { Head, Link } from '@inertiajs/react';
import { UtensilsCrossedIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import menu from '@/routes/menu';
import orders from '@/routes/orders';
import { OrderStatusBadgeVariant, OrderStatusLabels } from '@/types/enums';
import type { Order } from '@/types/models';

type PageProps = {
    recentOrders: Pick<
        Order,
        'id' | 'status' | 'payment_status' | 'total' | 'created_at'
    >[];
};

export default function Dashboard({ recentOrders }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Dashboard"
                        description="Welcome back! Here's what's cooking."
                    />
                    <Button asChild>
                        <Link href={menu.index()}>
                            <UtensilsCrossedIcon /> Browse menu
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent orders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                You haven&apos;t placed any orders yet.{' '}
                                <Link href={menu.index()} className="underline">
                                    Browse the menu
                                </Link>{' '}
                                to get started.
                            </p>
                        )}
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={orders.show(order.id)}
                                className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
                            >
                                <div>
                                    <p className="font-medium">
                                        Order #{order.id}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString()}{' '}
                                        &middot; ${order.total}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        OrderStatusBadgeVariant[order.status]
                                    }
                                >
                                    {OrderStatusLabels[order.status]}
                                </Badge>
                            </Link>
                        ))}
                        {recentOrders.length > 0 && (
                            <Button variant="outline" asChild size="sm">
                                <Link href={orders.index()}>
                                    View all orders
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};

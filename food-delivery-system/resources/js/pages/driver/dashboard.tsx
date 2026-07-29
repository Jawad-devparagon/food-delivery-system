import { Head, Link } from '@inertiajs/react';
import { CheckCircle2Icon, PackageIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import driver from '@/routes/driver';
import { OrderStatusBadgeVariant, OrderStatusLabels } from '@/types/enums';
import type { Order } from '@/types/models';

type PageProps = {
    stats: {
        activeDeliveries: number;
        deliveredToday: number;
    };
    activeOrders: Order[];
};

export default function DriverDashboard({ stats, activeOrders }: PageProps) {
    return (
        <>
            <Head title="Driver Dashboard" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Dashboard"
                    description="Your deliveries at a glance."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active deliveries
                            </CardTitle>
                            <PackageIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.activeDeliveries}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Delivered today
                            </CardTitle>
                            <CheckCircle2Icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold">
                                {stats.deliveredToday}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active orders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activeOrders.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No active deliveries right now.
                            </p>
                        )}
                        {activeOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={driver.orders.show(order.id)}
                                className="flex items-center justify-between rounded-md border p-3 hover:bg-accent"
                            >
                                <div>
                                    <p className="font-medium">
                                        Order #{order.id}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.user?.name}
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DriverDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: driver.dashboard() }],
};

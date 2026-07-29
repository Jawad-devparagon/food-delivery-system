import { Head, Link } from '@inertiajs/react';
import { MapPinIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import driver from '@/routes/driver';
import { OrderStatusBadgeVariant, OrderStatusLabels } from '@/types/enums';
import type { Order } from '@/types/models';

type PageProps = {
    orders: Order[];
};

export default function DriverOrdersIndex({ orders }: PageProps) {
    return (
        <>
            <Head title="My Deliveries" />

            <div className="space-y-6 p-4">
                <Heading
                    title="My Deliveries"
                    description="Orders assigned to you that still need action."
                />

                <div className="space-y-3">
                    {orders.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            You have no deliveries right now.
                        </p>
                    )}
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={driver.orders.show(order.id)}
                        >
                            <Card className="transition-colors hover:bg-accent">
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Order #{order.id} &middot;{' '}
                                            {order.user?.name}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPinIcon className="size-3.5" />
                                            {order.delivery_address}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            OrderStatusBadgeVariant[
                                                order.status
                                            ]
                                        }
                                    >
                                        {OrderStatusLabels[order.status]}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

DriverOrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: driver.dashboard() },
        { title: 'My Deliveries', href: driver.orders.index() },
    ],
};

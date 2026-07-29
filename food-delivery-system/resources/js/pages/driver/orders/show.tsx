import { Head, router, useHttp } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import driver from '@/routes/driver';
import {
    OrderStatus,
    OrderStatusBadgeVariant,
    OrderStatusLabels,
} from '@/types/enums';
import type { Order } from '@/types/models';

type PageProps = {
    order: Order;
};

const NEXT_STATUS: Partial<
    Record<OrderStatus, { status: OrderStatus; label: string }>
> = {
    [OrderStatus.Preparing]: {
        status: OrderStatus.OutForDelivery,
        label: 'Mark picked up',
    },
    [OrderStatus.OutForDelivery]: {
        status: OrderStatus.Delivered,
        label: 'Mark delivered',
    },
};

export default function DriverOrderShow({ order }: PageProps) {
    const next = NEXT_STATUS[order.status];

    const http = useHttp<{ status: OrderStatus }>({
        status: next?.status ?? order.status,
    });

    function advance() {
        if (!next) {
            return;
        }

        http.patch(driver.orders.updateStatus(order.id).url, {
            onSuccess: () => router.reload({ only: ['order'] }),
        });
    }

    return (
        <>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Order #${order.id}`}
                        description={order.user?.name}
                    />
                    <Badge variant={OrderStatusBadgeVariant[order.status]}>
                        {OrderStatusLabels[order.status]}
                    </Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Delivery details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>{order.user?.email}</p>
                        <p>{order.phone}</p>
                        <p>{order.delivery_address}</p>
                        {order.notes && (
                            <p className="text-muted-foreground">
                                &ldquo;{order.notes}&rdquo;
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            ${item.total}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-between border-t pt-4 font-medium">
                            <span>Total</span>
                            <span>${order.total}</span>
                        </div>
                    </CardContent>
                </Card>

                {next && (
                    <Button
                        onClick={advance}
                        disabled={http.processing}
                        size="lg"
                        className="w-full"
                    >
                        {next.label}
                    </Button>
                )}
            </div>
        </>
    );
}

DriverOrderShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: driver.dashboard() },
        { title: 'My Deliveries', href: driver.orders.index() },
    ],
};

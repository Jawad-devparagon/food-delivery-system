import { Head, Link } from '@inertiajs/react';
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
import checkout from '@/routes/checkout';
import orders from '@/routes/orders';
import {
    OrderStatusBadgeVariant,
    OrderStatusLabels,
    PaymentStatus,
    PaymentStatusBadgeVariant,
    PaymentStatusLabels,
} from '@/types/enums';
import type { Order } from '@/types/models';

type PageProps = {
    order: Order;
};

export default function CustomerOrderShow({ order }: PageProps) {
    return (
        <>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title={`Order #${order.id}`} />
                    <div className="flex gap-2">
                        <Badge variant={OrderStatusBadgeVariant[order.status]}>
                            {OrderStatusLabels[order.status]}
                        </Badge>
                        <Badge
                            variant={
                                PaymentStatusBadgeVariant[order.payment_status]
                            }
                        >
                            {PaymentStatusLabels[order.payment_status]}
                        </Badge>
                    </div>
                </div>

                {order.payment_status !== PaymentStatus.Paid && (
                    <Card className="border-amber-500/50">
                        <CardContent className="flex items-center justify-between py-4">
                            <p className="text-sm">
                                This order hasn&apos;t been paid yet.
                            </p>
                            <Button asChild size="sm">
                                <Link href={checkout.pay(order.id)}>
                                    Complete payment
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
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
                                            <TableCell>
                                                {item.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${item.total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>${order.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Delivery fee
                                    </span>
                                    <span>${order.delivery_fee}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${order.total}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>{order.delivery_address}</p>
                            <p>{order.phone}</p>
                            {order.notes && (
                                <p className="text-muted-foreground">
                                    &ldquo;{order.notes}&rdquo;
                                </p>
                            )}
                            {order.driver && (
                                <p className="pt-2 text-muted-foreground">
                                    Driver: {order.driver.name}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

CustomerOrderShow.layout = {
    breadcrumbs: [{ title: 'My Orders', href: orders.index() }],
};

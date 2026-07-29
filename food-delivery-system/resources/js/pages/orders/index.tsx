import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import menu from '@/routes/menu';
import orders from '@/routes/orders';
import {
    OrderStatusBadgeVariant,
    OrderStatusLabels,
    PaymentStatusBadgeVariant,
    PaymentStatusLabels,
} from '@/types/enums';
import type { Order, Paginated } from '@/types/models';

type PageProps = {
    orders: Paginated<Order>;
};

export default function CustomerOrdersIndex({ orders: paginated }: PageProps) {
    return (
        <>
            <Head title="My Orders" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="My Orders"
                        description="Your order history."
                    />
                    <Button variant="outline" asChild>
                        <Link href={menu.index()}>Browse menu</Link>
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Placed</TableHead>
                                <TableHead className="text-right">
                                    &nbsp;
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        You haven&apos;t placed any orders yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {paginated.data.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                OrderStatusBadgeVariant[
                                                    order.status
                                                ]
                                            }
                                        >
                                            {OrderStatusLabels[order.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                PaymentStatusBadgeVariant[
                                                    order.payment_status
                                                ]
                                            }
                                        >
                                            {
                                                PaymentStatusLabels[
                                                    order.payment_status
                                                ]
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${order.total}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={orders.show(order.id)}>
                                                View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

CustomerOrdersIndex.layout = {
    breadcrumbs: [{ title: 'My Orders', href: orders.index() }],
};

import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';
import {
    OrderStatusBadgeVariant,
    OrderStatusLabels,
    PaymentStatusBadgeVariant,
    PaymentStatusLabels,
} from '@/types/enums';
import type { Order, Paginated } from '@/types/models';

type PageProps = {
    orders: Paginated<Order>;
    filters: { status?: string };
};

export default function AdminOrdersIndex({ orders, filters }: PageProps) {
    function filterByStatus(status: string) {
        router.get(
            admin.orders.index().url,
            status === 'all' ? {} : { status },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Orders" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Orders"
                        description="Track and manage customer orders."
                    />
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={filterByStatus}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            {Object.entries(OrderStatusLabels).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Placed</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {orders.data.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id}
                                    </TableCell>
                                    <TableCell>{order.user?.name}</TableCell>
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
                                        ).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={admin.orders.show(
                                                    order.id,
                                                )}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {orders.last_page > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {orders.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        preserveState
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

AdminOrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: admin.dashboard() },
        { title: 'Orders', href: admin.orders.index() },
    ],
};

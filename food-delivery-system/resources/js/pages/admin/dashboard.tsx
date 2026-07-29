import { Head, Link } from '@inertiajs/react';
import {
    ClockIcon,
    DollarSignIcon,
    PackageIcon,
    TruckIcon,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Order } from '@/types/models';

type PageProps = {
    stats: {
        pendingOrders: number;
        activeOrders: number;
        deliveredToday: number;
        revenueToday: number;
        driverCount: number;
    };
    recentOrders: (Pick<
        Order,
        'id' | 'status' | 'payment_status' | 'total' | 'created_at'
    > & { user?: { name: string } })[];
};

export default function AdminDashboard({ stats, recentOrders }: PageProps) {
    const tiles = [
        {
            label: 'Pending orders',
            value: stats.pendingOrders,
            icon: ClockIcon,
        },
        {
            label: 'Active orders',
            value: stats.activeOrders,
            icon: PackageIcon,
        },
        {
            label: 'Delivered today',
            value: stats.deliveredToday,
            icon: TruckIcon,
        },
        {
            label: 'Revenue today',
            value: `$${stats.revenueToday.toFixed(2)}`,
            icon: DollarSignIcon,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Dashboard"
                    description="An overview of today's activity."
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {tiles.map((tile) => (
                        <Card key={tile.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {tile.label}
                                </CardTitle>
                                <tile.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-semibold">
                                    {tile.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground"
                                        >
                                            No orders yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Link
                                                href={admin.orders.show(
                                                    order.id,
                                                )}
                                                className="font-medium hover:underline"
                                            >
                                                #{order.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {order.user?.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    OrderStatusBadgeVariant[
                                                        order.status
                                                    ]
                                                }
                                            >
                                                {
                                                    OrderStatusLabels[
                                                        order.status
                                                    ]
                                                }
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
                                        <TableCell className="text-right">
                                            ${order.total}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Admin', href: admin.dashboard() }],
};

import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { OrderStatus } from '@/types/enums';
import {
    OrderStatusBadgeVariant,
    OrderStatusLabels,
    PaymentStatusBadgeVariant,
    PaymentStatusLabels,
} from '@/types/enums';
import type { Driver, Order } from '@/types/models';

type PageProps = {
    order: Order;
    drivers: Pick<Driver, 'id' | 'name'>[];
};

export default function AdminOrderShow({ order, drivers }: PageProps) {
    const statusForm = useForm({ status: order.status });
    const driverForm = useForm({
        driver_id: order.driver_id ? String(order.driver_id) : '',
    });

    function updateStatus(event: React.FormEvent) {
        event.preventDefault();
        statusForm.patch(admin.orders.updateStatus(order.id).url, {
            preserveScroll: true,
        });
    }

    function assignDriver(event: React.FormEvent) {
        event.preventDefault();
        driverForm.patch(admin.orders.assignDriver(order.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Order #${order.id}`}
                        description={`Placed by ${order.user?.name ?? 'a customer'}`}
                    />
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
                                        <TableHead>Price</TableHead>
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
                                            <TableCell>
                                                ${item.unit_price}
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

                    <div className="space-y-6">
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
                                <CardTitle>Update status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={updateStatus}
                                    className="space-y-3"
                                >
                                    <Select
                                        value={statusForm.data.status}
                                        onValueChange={(value) =>
                                            statusForm.setData(
                                                'status',
                                                value as OrderStatus,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(
                                                OrderStatusLabels,
                                            ).map(([value, label]) => (
                                                <SelectItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={statusForm.errors.status}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={statusForm.processing}
                                        className="w-full"
                                    >
                                        Update status
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assign driver</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={assignDriver}
                                    className="space-y-3"
                                >
                                    <Select
                                        value={driverForm.data.driver_id}
                                        onValueChange={(value) =>
                                            driverForm.setData(
                                                'driver_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a driver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {drivers.map((driver) => (
                                                <SelectItem
                                                    key={driver.id}
                                                    value={String(driver.id)}
                                                >
                                                    {driver.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={driverForm.errors.driver_id}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={
                                            driverForm.processing ||
                                            !driverForm.data.driver_id
                                        }
                                        className="w-full"
                                    >
                                        Assign driver
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminOrderShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: admin.dashboard() },
        { title: 'Orders', href: admin.orders.index() },
    ],
};

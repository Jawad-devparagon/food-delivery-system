import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import checkout from '@/routes/checkout';
import menu from '@/routes/menu';
import type { CartItem } from '@/types/models';

type PageProps = {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
};

export default function CheckoutIndex({
    items,
    subtotal,
    deliveryFee,
}: PageProps) {
    const form = useForm({
        delivery_address: '',
        phone: '',
        notes: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(checkout.store().url);
    }

    return (
        <>
            <Head title="Checkout" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Checkout"
                    description="Confirm your delivery details."
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Delivery details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                id="checkout-form"
                                onSubmit={submit}
                                className="space-y-4"
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="delivery_address">
                                        Delivery address
                                    </Label>
                                    <Textarea
                                        id="delivery_address"
                                        value={form.data.delivery_address}
                                        onChange={(e) =>
                                            form.setData(
                                                'delivery_address',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={form.errors.delivery_address}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.data.phone}
                                        onChange={(e) =>
                                            form.setData(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={form.errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">
                                        Notes (optional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={form.data.notes}
                                        onChange={(e) =>
                                            form.setData(
                                                'notes',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.menu_item_id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.quantity}&times; {item.name}
                                    </span>
                                    <span>${item.total.toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="space-y-1 border-t pt-3 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Delivery fee</span>
                                    <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>
                                        ${(subtotal + deliveryFee).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                disabled={form.processing}
                                className="w-full"
                            >
                                Continue to payment
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

CheckoutIndex.layout = {
    breadcrumbs: [
        { title: 'Menu', href: menu.index() },
        { title: 'Checkout', href: checkout.create() },
    ],
};

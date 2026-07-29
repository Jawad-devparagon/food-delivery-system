import { Link, router, useHttp } from '@inertiajs/react';
import {
    MinusIcon,
    PlusIcon,
    ShoppingCartIcon,
    Trash2Icon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import cart from '@/routes/cart';
import { create as createCheckout } from '@/routes/checkout';
import type { CartItem } from '@/types/models';

type CartResponse = {
    items: CartItem[];
    count: number;
    subtotal: number;
};

function CartLine({
    item,
    onUpdated,
}: {
    item: CartItem;
    onUpdated: (cart: CartResponse) => void;
}) {
    const http = useHttp<{ quantity: number }, CartResponse>({
        quantity: item.quantity,
    });

    function changeQuantity(quantity: number) {
        http.transform(() => ({ quantity }));
        http.patch(cart.update(item.menu_item_id).url, {
            onSuccess: onUpdated,
        });
    }

    function remove() {
        http.delete(cart.destroy(item.menu_item_id).url, {
            onSuccess: onUpdated,
        });
    }

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                </p>
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={http.processing}
                    onClick={() => changeQuantity(item.quantity - 1)}
                >
                    <MinusIcon className="size-3" />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={http.processing}
                    onClick={() => changeQuantity(item.quantity + 1)}
                >
                    <PlusIcon className="size-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={http.processing}
                    onClick={remove}
                >
                    <Trash2Icon className="size-3.5" />
                </Button>
            </div>
        </div>
    );
}

export function CartSheet({ count }: { count: number }) {
    const [open, setOpen] = useState(false);
    const [data, setLocalData] = useState<CartResponse | null>(null);

    const http = useHttp<Record<string, never>, CartResponse>({});

    function refresh() {
        http.get(cart.show().url, { onSuccess: setLocalData });
    }

    useEffect(() => {
        if (open) {
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function handleUpdated(response: CartResponse) {
        setLocalData(response);
        router.reload({ only: ['cartCount'] });
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCartIcon />
                    {count > 0 && (
                        <Badge className="absolute -top-1 -right-1 size-5 justify-center rounded-full p-0 text-[10px]">
                            {count}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Your cart</SheetTitle>
                </SheetHeader>

                <div className="flex-1 space-y-4 overflow-y-auto px-4">
                    {!data?.items.length && (
                        <p className="text-sm text-muted-foreground">
                            Your cart is empty.
                        </p>
                    )}
                    {data?.items.map((item) => (
                        <CartLine
                            key={item.menu_item_id}
                            item={item}
                            onUpdated={handleUpdated}
                        />
                    ))}
                </div>

                {!!data?.items.length && (
                    <SheetFooter>
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span>Subtotal</span>
                            <span>${data.subtotal.toFixed(2)}</span>
                        </div>
                        <Button asChild onClick={() => setOpen(false)}>
                            <Link href={createCheckout()}>Checkout</Link>
                        </Button>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}

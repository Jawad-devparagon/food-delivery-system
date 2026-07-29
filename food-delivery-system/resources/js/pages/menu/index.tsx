import { Head, Link, router, useHttp, usePage } from '@inertiajs/react';
import { PlusIcon, UtensilsCrossedIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login } from '@/routes';
import cart from '@/routes/cart';
import type { MaybeAuth } from '@/types';
import { UserRole } from '@/types/enums';
import type { Category, MenuItem } from '@/types/models';

type PageProps = {
    categories: (Category & { menu_items: MenuItem[] })[];
};

function AddToCartButton({ menuItem }: { menuItem: MenuItem }) {
    const http = useHttp<{ menu_item_id: number; quantity: number }>({
        menu_item_id: menuItem.id,
        quantity: 1,
    });

    function add() {
        http.post(cart.store().url, {
            onSuccess: () => router.reload({ only: ['cartCount'] }),
        });
    }

    return (
        <Button size="sm" onClick={add} disabled={http.processing}>
            <PlusIcon /> Add
        </Button>
    );
}

export default function MenuIndex({ categories }: PageProps) {
    const { auth } = usePage<{ auth: MaybeAuth }>().props;
    const canOrder = auth.user?.role === UserRole.Customer;
    const firstCategory = categories[0]?.slug;

    return (
        <>
            <Head title="Menu" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Our Menu"
                    description="Fresh dishes made to order, delivered to your door."
                />

                {!auth.user && (
                    <p className="text-sm text-muted-foreground">
                        <Link href={login()} className="underline">
                            Log in
                        </Link>{' '}
                        to add items to your cart.
                    </p>
                )}

                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        The menu is empty right now. Check back soon.
                    </p>
                )}

                {categories.length > 0 && (
                    <Tabs defaultValue={firstCategory}>
                        <TabsList>
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.slug}
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {categories.map((category) => (
                            <TabsContent
                                key={category.id}
                                value={category.slug}
                                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            >
                                {category.menu_items.map((menuItem) => (
                                    <Card key={menuItem.id}>
                                        <CardContent className="space-y-2">
                                            {menuItem.image_path ? (
                                                <img
                                                    src={`/storage/${menuItem.image_path}`}
                                                    alt={menuItem.name}
                                                    className="aspect-video w-full rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex aspect-video w-full items-center justify-center rounded-md bg-muted">
                                                    <UtensilsCrossedIcon className="size-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <p className="font-medium">
                                                {menuItem.name}
                                            </p>
                                            {menuItem.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {menuItem.description}
                                                </p>
                                            )}
                                        </CardContent>
                                        <CardFooter className="flex items-center justify-between">
                                            <span className="font-semibold">
                                                ${menuItem.price}
                                            </span>
                                            {canOrder && (
                                                <AddToCartButton
                                                    menuItem={menuItem}
                                                />
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </>
    );
}

MenuIndex.layout = {
    breadcrumbs: [{ title: 'Menu', href: '/menu' }],
};

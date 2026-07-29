import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import { MenuItemStatus, MenuItemStatusLabels } from '@/types/enums';
import type { Category, MenuItem } from '@/types/models';

type PageProps = {
    menuItems: MenuItem[];
    categories: Pick<Category, 'id' | 'name'>[];
};

type MenuItemForm = {
    category_id: string;
    name: string;
    description: string;
    price: string;
    status: MenuItemStatus;
    image: File | null;
};

function MenuItemFormDialog({
    menuItem,
    categories,
    open,
    onOpenChange,
}: {
    menuItem: MenuItem | null;
    categories: Pick<Category, 'id' | 'name'>[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isEditing = menuItem !== null;

    const form = useForm<MenuItemForm>({
        category_id: menuItem ? String(menuItem.category_id) : '',
        name: menuItem?.name ?? '',
        description: menuItem?.description ?? '',
        price: menuItem?.price ?? '',
        status: menuItem?.status ?? MenuItemStatus.Available,
        image: null,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        };

        if (isEditing) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(admin.menuItems.update(menuItem.id).url, options);
        } else {
            form.post(admin.menuItems.store().url, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit menu item' : 'New menu item'}
                        </DialogTitle>
                        <DialogDescription>
                            Menu items appear on the public menu once marked
                            available.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Category</Label>
                            <Select
                                value={form.data.category_id}
                                onValueChange={(value) =>
                                    form.setData('category_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="category_id"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.category_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={form.data.price}
                                    onChange={(e) =>
                                        form.setData('price', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={form.errors.price} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(value) =>
                                        form.setData(
                                            'status',
                                            value as MenuItemStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(
                                            MenuItemStatusLabels,
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
                                <InputError message={form.errors.status} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    form.setData(
                                        'image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <InputError message={form.errors.image} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'Save changes' : 'Create menu item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function MenuItemsIndex({ menuItems, categories }: PageProps) {
    const [dialogTarget, setDialogTarget] = useState<MenuItem | 'new' | null>(
        null,
    );

    const deleteForm = useForm({});

    function destroy(menuItem: MenuItem) {
        deleteForm.delete(admin.menuItems.destroy(menuItem.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Menu Items" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Menu Items"
                        description="Manage the dishes and drinks on your menu."
                    />
                    <Button
                        onClick={() => setDialogTarget('new')}
                        disabled={categories.length === 0}
                    >
                        <PlusIcon /> New Menu Item
                    </Button>
                </div>

                {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Create a category first before adding menu items.
                    </p>
                )}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {menuItems.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        No menu items yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {menuItems.map((menuItem) => (
                                <TableRow key={menuItem.id}>
                                    <TableCell>
                                        {menuItem.image_path ? (
                                            <img
                                                src={`/storage/${menuItem.image_path}`}
                                                alt={menuItem.name}
                                                className="size-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                                <ImageIcon className="size-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {menuItem.name}
                                    </TableCell>
                                    <TableCell>
                                        {menuItem.category?.name}
                                    </TableCell>
                                    <TableCell>${menuItem.price}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                menuItem.status ===
                                                MenuItemStatus.Available
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {
                                                MenuItemStatusLabels[
                                                    menuItem.status
                                                ]
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDialogTarget(menuItem)
                                            }
                                        >
                                            <PencilIcon />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Trash2Icon />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete {menuItem.name}?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This cannot be undone.
                                                        Items with existing
                                                        orders can&apos;t be
                                                        deleted.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            destroy(menuItem)
                                                        }
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <MenuItemFormDialog
                key={
                    dialogTarget === 'new'
                        ? 'new'
                        : (dialogTarget?.id ?? 'closed')
                }
                menuItem={dialogTarget === 'new' ? null : dialogTarget}
                categories={categories}
                open={dialogTarget !== null}
                onOpenChange={(open) => !open && setDialogTarget(null)}
            />
        </>
    );
}

MenuItemsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: admin.dashboard() },
        { title: 'Menu Items', href: admin.menuItems.index() },
    ],
};

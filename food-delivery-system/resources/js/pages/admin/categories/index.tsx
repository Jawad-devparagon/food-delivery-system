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
import { Switch } from '@/components/ui/switch';
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
import type { Category } from '@/types/models';

type PageProps = {
    categories: Category[];
};

type CategoryForm = {
    name: string;
    description: string;
    is_active: boolean;
    sort_order: number;
    image: File | null;
};

function CategoryFormDialog({
    category,
    open,
    onOpenChange,
}: {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isEditing = category !== null;

    const form = useForm<CategoryForm>({
        name: category?.name ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order ?? 0,
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
            form.post(admin.categories.update(category.id).url, options);
        } else {
            form.post(admin.categories.store().url, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit category' : 'New category'}
                        </DialogTitle>
                        <DialogDescription>
                            Categories group your menu items for customers to
                            browse.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
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
                                <Label htmlFor="sort_order">Sort order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={form.data.sort_order}
                                    onChange={(e) =>
                                        form.setData(
                                            'sort_order',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                <InputError message={form.errors.sort_order} />
                            </div>

                            <div className="flex items-center justify-between rounded-md border px-3 py-2">
                                <Label htmlFor="is_active" className="mb-0">
                                    Active
                                </Label>
                                <Switch
                                    id="is_active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) =>
                                        form.setData('is_active', checked)
                                    }
                                />
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
                            {isEditing ? 'Save changes' : 'Create category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function CategoriesIndex({ categories }: PageProps) {
    const [dialogTarget, setDialogTarget] = useState<Category | 'new' | null>(
        null,
    );

    const deleteForm = useForm({});

    function destroy(category: Category) {
        deleteForm.delete(admin.categories.destroy(category.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Categories" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Categories"
                        description="Organize your menu into categories."
                    />
                    <Button onClick={() => setDialogTarget('new')}>
                        <PlusIcon /> New Category
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sort</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        No categories yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {category.image_path ? (
                                            <img
                                                src={`/storage/${category.image_path}`}
                                                alt={category.name}
                                                className="size-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                                                <ImageIcon className="size-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>
                                    <TableCell>
                                        {category.menu_items_count ?? 0}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                category.is_active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {category.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{category.sort_order}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDialogTarget(category)
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
                                                        Delete {category.name}?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This cannot be undone.
                                                        Categories with ordered
                                                        items can&apos;t be
                                                        deleted.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            destroy(category)
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

            <CategoryFormDialog
                key={
                    dialogTarget === 'new'
                        ? 'new'
                        : (dialogTarget?.id ?? 'closed')
                }
                category={dialogTarget === 'new' ? null : dialogTarget}
                open={dialogTarget !== null}
                onOpenChange={(open) => !open && setDialogTarget(null)}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: admin.dashboard() },
        { title: 'Categories', href: admin.categories.index() },
    ],
};

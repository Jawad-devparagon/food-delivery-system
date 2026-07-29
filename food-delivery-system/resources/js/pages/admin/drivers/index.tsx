import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { PencilIcon, PlusIcon, Trash2Icon, TruckIcon } from 'lucide-react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';
import type { Driver } from '@/types/models';

type PageProps = {
    drivers: Driver[];
};

type DriverForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

function DriverFormDialog({
    driver,
    open,
    onOpenChange,
}: {
    driver: Driver | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isEditing = driver !== null;

    const form = useForm<DriverForm>({
        name: driver?.name ?? '',
        email: driver?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        };

        if (isEditing) {
            form.put(admin.drivers.update(driver.id).url, options);
        } else {
            form.post(admin.drivers.store().url, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit driver' : 'New driver'}
                        </DialogTitle>
                        <DialogDescription>
                            Drivers can log in and manage the deliveries
                            assigned to them.
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {isEditing
                                    ? 'New password (optional)'
                                    : 'Password'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                required={!isEditing}
                            />
                            <InputError message={form.errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required={!isEditing}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={form.processing}>
                            {isEditing ? 'Save changes' : 'Create driver'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function DriversIndex({ drivers }: PageProps) {
    const [dialogTarget, setDialogTarget] = useState<Driver | 'new' | null>(
        null,
    );

    const deleteForm = useForm({});

    function destroy(driver: Driver) {
        deleteForm.delete(admin.drivers.destroy(driver.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Drivers" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Drivers"
                        description="Manage the drivers who deliver orders."
                    />
                    <Button onClick={() => setDialogTarget('new')}>
                        <PlusIcon /> New Driver
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Deliveries</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drivers.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        No drivers yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {drivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <TruckIcon className="size-4 text-muted-foreground" />
                                            {driver.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{driver.email}</TableCell>
                                    <TableCell>
                                        {driver.deliveries_count ?? 0}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDialogTarget(driver)
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
                                                        Remove {driver.name}?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            destroy(driver)
                                                        }
                                                    >
                                                        Remove
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

            <DriverFormDialog
                key={
                    dialogTarget === 'new'
                        ? 'new'
                        : (dialogTarget?.id ?? 'closed')
                }
                driver={dialogTarget === 'new' ? null : dialogTarget}
                open={dialogTarget !== null}
                onOpenChange={(open) => !open && setDialogTarget(null)}
            />
        </>
    );
}

DriversIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: admin.dashboard() },
        { title: 'Drivers', href: admin.drivers.index() },
    ],
};

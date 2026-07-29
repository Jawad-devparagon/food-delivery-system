import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/components/ui/badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

export const UserRole = {
    Admin: 'admin',
    Customer: 'customer',
    Driver: 'driver',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserRoleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    customer: 'Customer',
    driver: 'Driver',
};

export const OrderStatus = {
    Pending: 'pending',
    Confirmed: 'confirmed',
    Preparing: 'preparing',
    OutForDelivery: 'out_for_delivery',
    Delivered: 'delivered',
    Cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export const OrderStatusBadgeVariant: Record<OrderStatus, BadgeVariant> = {
    pending: 'outline',
    confirmed: 'secondary',
    preparing: 'secondary',
    out_for_delivery: 'default',
    delivered: 'default',
    cancelled: 'destructive',
};

export const PaymentStatus = {
    Pending: 'pending',
    Paid: 'paid',
    Failed: 'failed',
    Refunded: 'refunded',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};

export const PaymentStatusBadgeVariant: Record<PaymentStatus, BadgeVariant> = {
    pending: 'outline',
    paid: 'default',
    failed: 'destructive',
    refunded: 'secondary',
};

export const MenuItemStatus = {
    Available: 'available',
    Unavailable: 'unavailable',
} as const;

export type MenuItemStatus =
    (typeof MenuItemStatus)[keyof typeof MenuItemStatus];

export const MenuItemStatusLabels: Record<MenuItemStatus, string> = {
    available: 'Available',
    unavailable: 'Unavailable',
};

import type {
    MenuItemStatus,
    OrderStatus,
    PaymentStatus,
    UserRole,
} from './enums';

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    is_active: boolean;
    sort_order: number;
    menu_items_count?: number;
    created_at: string;
    updated_at: string;
};

export type MenuItem = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    image_path: string | null;
    status: MenuItemStatus;
    category?: Pick<Category, 'id' | 'name'>;
    created_at: string;
    updated_at: string;
};

export type Driver = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    deliveries_count?: number;
    created_at: string;
};

export type OrderItem = {
    id: number;
    order_id: number;
    menu_item_id: number;
    name: string;
    unit_price: string;
    quantity: number;
    total: string;
    menu_item?: Pick<MenuItem, 'id' | 'name'>;
};

export type OrderCustomer = {
    id: number;
    name: string;
    email?: string;
};

export type Order = {
    id: number;
    user_id: number;
    driver_id: number | null;
    status: OrderStatus;
    payment_status: PaymentStatus;
    subtotal: string;
    delivery_fee: string;
    total: string;
    delivery_address: string;
    phone: string;
    notes: string | null;
    paid_at: string | null;
    delivered_at: string | null;
    created_at: string;
    updated_at: string;
    user?: OrderCustomer;
    driver?: Pick<Driver, 'id' | 'name'> | null;
    items?: OrderItem[];
};

export type CartItem = {
    menu_item_id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image_path: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

<?php

namespace App\Support;

use App\Enums\MenuItemStatus;
use App\Models\MenuItem;

class Cart
{
    private const SESSION_KEY = 'cart';

    public function add(int $menuItemId, int $quantity): void
    {
        $items = $this->raw();
        $items[$menuItemId] = ($items[$menuItemId] ?? 0) + $quantity;
        $this->put($items);
    }

    public function update(int $menuItemId, int $quantity): void
    {
        $items = $this->raw();

        if ($quantity <= 0) {
            unset($items[$menuItemId]);
        } else {
            $items[$menuItemId] = $quantity;
        }

        $this->put($items);
    }

    public function remove(int $menuItemId): void
    {
        $items = $this->raw();
        unset($items[$menuItemId]);
        $this->put($items);
    }

    public function clear(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    public function isEmpty(): bool
    {
        return $this->raw() === [];
    }

    public function count(): int
    {
        return array_sum($this->raw());
    }

    public function subtotal(): float
    {
        return round(array_sum(array_column($this->items(), 'total')), 2);
    }

    /**
     * Fresh line items priced from the database. Drops any cart entries whose
     * menu item no longer exists or has been made unavailable.
     *
     * @return list<array{menu_item_id: int, name: string, price: float, quantity: int, total: float, image_path: string|null}>
     */
    public function items(): array
    {
        $raw = $this->raw();

        if ($raw === []) {
            return [];
        }

        $menuItems = MenuItem::whereKey(array_keys($raw))
            ->where('status', MenuItemStatus::Available)
            ->get()
            ->keyBy('id');

        $valid = array_intersect_key($raw, $menuItems->all());

        if ($valid !== $raw) {
            $this->put($valid);
        }

        $items = [];

        foreach ($valid as $menuItemId => $quantity) {
            $menuItem = $menuItems->get($menuItemId);
            $price = (float) $menuItem->price;

            $items[] = [
                'menu_item_id' => $menuItem->id,
                'name' => $menuItem->name,
                'price' => $price,
                'quantity' => $quantity,
                'total' => round($price * $quantity, 2),
                'image_path' => $menuItem->image_path,
            ];
        }

        return $items;
    }

    /**
     * @return array<int, int> menu_item_id => quantity
     */
    private function raw(): array
    {
        return session(self::SESSION_KEY, []);
    }

    /**
     * @param  array<int, int>  $items
     */
    private function put(array $items): void
    {
        session([self::SESSION_KEY => $items]);
    }
}

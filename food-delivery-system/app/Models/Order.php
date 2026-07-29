<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $driver_id
 * @property OrderStatus $status
 * @property PaymentStatus $payment_status
 * @property string $subtotal
 * @property string $delivery_fee
 * @property string $total
 * @property string $delivery_address
 * @property string $phone
 * @property string|null $notes
 * @property string|null $stripe_payment_intent_id
 * @property Carbon|null $paid_at
 * @property Carbon|null $delivered_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id', 'driver_id', 'status', 'payment_status', 'subtotal', 'delivery_fee',
    'total', 'delivery_address', 'phone', 'notes', 'stripe_payment_intent_id',
    'paid_at', 'delivered_at',
])]
class Order extends Model
{
    /**
     * The customer who placed this order.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The driver assigned to deliver this order.
     *
     * @return BelongsTo<User, $this>
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * The line items on this order.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * The order total in the smallest currency unit (cents), for Stripe.
     */
    public function totalInCents(): int
    {
        return (int) round(((float) $this->total) * 100);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'subtotal' => 'decimal:2',
            'delivery_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }
}

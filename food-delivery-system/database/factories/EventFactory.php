<?php

namespace Database\Factories;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('now', '+1 month');

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'location' => fake()->optional()->address(),
            'status' => EventStatus::Scheduled,
            'all_day' => false,
            'starts_at' => $startsAt,
            'ends_at' => fake()->dateTimeBetween($startsAt, (clone $startsAt)->modify('+3 hours')),
        ];
    }

    /**
     * Indicate that the event has been cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => EventStatus::Cancelled,
        ]);
    }
}

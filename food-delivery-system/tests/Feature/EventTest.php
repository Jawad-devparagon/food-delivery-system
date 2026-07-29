<?php

use App\Enums\EventStatus;
use App\Models\Event;
use App\Models\User;
use Carbon\CarbonInterface;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('an event is created and casts dates', function () {
    $organizer = User::factory()->create();

    $event = Event::factory()->for($organizer, 'organizer')->create([
        'title' => 'Catering Kickoff',
        'starts_at' => '2026-08-01 09:00:00',
        'ends_at' => '2026-08-01 11:00:00',
    ]);

    expect($event->user_id)->toBe($organizer->id)
        ->and($event->status)->toBe(EventStatus::Scheduled)
        ->and($event->starts_at)->toBeInstanceOf(CarbonInterface::class)
        ->and($event->ends_at)->toBeInstanceOf(CarbonInterface::class)
        ->and($event->organizer->is($organizer))->toBeTrue();
});

test('a cancelled event has the cancelled status', function () {
    $event = Event::factory()->cancelled()->create();

    expect($event->status)->toBe(EventStatus::Cancelled);
});

test('a user can have many scheduled events', function () {
    $user = User::factory()->create();
    Event::factory()->for($user, 'organizer')->count(3)->create();

    expect($user->events)->toHaveCount(3);
});

<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all locations
        $locations = Location::all();
        Schema::disableForeignKeyConstraints();
        TimeSlot::truncate();
        Schema::enableForeignKeyConstraints();

        // Standard time slots for all locations
        $standardTimeSlots = [
            [
                'start' => '15:00',
                'end' => '18:00',
                'label' => 'Afternoon',
                'available' => true,
            ],
            [
                'start' => '18:00',
                'end' => '20:00',
                'label' => 'Night',
                'available' => true,
            ],
        ];

        // Create time slots for each location
        foreach ($locations as $location) {
            foreach ($standardTimeSlots as $slot) {
                TimeSlot::create([
                    'location_id' => $location->id,
                    'start' => $slot['start'],
                    'end' => $slot['end'],
                    'label' => $slot['label'],
                    'available' => $slot['available'],
                ]);
            }
        }
    }
}
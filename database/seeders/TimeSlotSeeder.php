<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;

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

        // Standard time slots for all locations
        $standardTimeSlots = [
            [
                'start' => '04:30',
                'end' => '05:30',
                'label' => 'Morning',
                'available' => true,
            ],
            [
                'start' => '05:30',
                'end' => '06:30',
                'label' => 'Sunrise',
                'available' => true,
            ],
            [
                'start' => '15:00',
                'end' => '16:00',
                'label' => 'Afternoon',
                'available' => true,
            ],
            [
                'start' => '20:00',
                'end' => '21:00',
                'label' => 'Night (Blue Fire)',
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
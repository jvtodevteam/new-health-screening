<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bondowosoCityId = City::where('name', 'Bondowoso')->first()->id;
        $banyuwangiCityId = City::where('name', 'Banyuwangi')->first()->id;

        $locations = [
            // Bondowoso locations
            [
                'city_id' => $bondowosoCityId,
                'name' => 'Baratha Hotel',
                'description' => 'Most popular entry point',
                'latitude' => -7.91303,
                'longitude' => 113.807867,
            ],
            [
                'city_id' => $bondowosoCityId,
                'name' => 'Riverside Homestay',
                'description' => 'Eastern entry point',
                'latitude' => -7.932059,
                'longitude' => 113.824877,
            ],
            [
                'city_id' => $bondowosoCityId,
                'name' => 'Grand Padis Hotel',
                'description' => 'Northern entry point',
                'latitude' => -7.915963,
                'longitude' => 113.819655,
            ],
            
            // Banyuwangi locations
            [
                'city_id' => $banyuwangiCityId,
                'name' => 'Luminor Hotel',
                'description' => 'City center hotel',
                'latitude' => -8.210083,
                'longitude' => 114.369759,
            ],
            [
                'city_id' => $banyuwangiCityId,
                'name' => 'Santika Hotel',
                'description' => 'Near shopping district',
                'latitude' => -8.219246,
                'longitude' => 114.364867,
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
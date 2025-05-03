<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cities = [
            [
                'name' => 'Bondowoso',
                'latitude' => -7.91303,
                'longitude' => 113.820867
            ],
            [
                'name' => 'Banyuwangi',
                'latitude' => -8.215083,
                'longitude' => 114.367759
            ]
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\MedicalStaff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MedicalStaffSeeder extends Seeder
{
    public function run()
    {
        MedicalStaff::create([
            'username' => 'dokter1',
            'phone' => '081234567890',
            'location_id' => 1, // Sesuaikan dengan ID lokasi yang ada
            'password' => Hash::make('password123'),
        ]);

        MedicalStaff::create([
            'username' => 'perawat1',
            'phone' => '081234567891',
            'location_id' => 1, // Sesuaikan dengan ID lokasi yang ada
            'password' => Hash::make('password123'),
        ]);
    }
}
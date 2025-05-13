<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            // Menambahkan foreign key untuk medical staff
            $table->foreignId('medical_staff_id')->nullable()->constrained('medical_staff');
            
            // Menambahkan kolom-kolom untuk hasil pemeriksaan kesehatan dalam bahasa Inggris
            $table->integer('systolic_blood_pressure')->nullable()->comment('mmHg');
            $table->integer('diastolic_blood_pressure')->nullable()->comment('mmHg');
            $table->integer('heart_rate')->nullable()->comment('bpm');
            $table->decimal('temperature', 4, 1)->nullable()->comment('Celsius');
            $table->integer('respiratory_rate')->nullable()->comment('breaths per minute');
            $table->integer('oxygen_saturation')->nullable()->comment('percentage');
            
            // Tambahkan timestamp untuk mencatat kapan pemeriksaan dilakukan
            $table->timestamp('examined_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            // Hapus kolom dalam urutan terbalik untuk menghindari masalah dependensi
            $table->dropColumn('examined_at');
            $table->dropColumn('oxygen_saturation');
            $table->dropColumn('respiratory_rate');
            $table->dropColumn('temperature');
            $table->dropColumn('heart_rate');
            $table->dropColumn('diastolic_blood_pressure');
            $table->dropColumn('systolic_blood_pressure');
            
            // Hapus foreign key
            $table->dropForeign(['medical_staff_id']);
            $table->dropColumn('medical_staff_id');
        });
    }
};
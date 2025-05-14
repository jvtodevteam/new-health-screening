<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'screening_id',
        'title',
        'name',
        'age',
        'nationality_id',
        'id_number',
        'has_medical_history',
        'allergies',
        'past_medical_history',
        'current_medications',
        'family_medical_history',
        // Kolom baru untuk pemeriksaan kesehatan
        'medical_staff_id',
        'systolic_blood_pressure',
        'diastolic_blood_pressure',
        'heart_rate',
        'temperature',
        'respiratory_rate',
        'oxygen_saturation',
        'examined_at',
        'unique_code'
    ];

    protected $casts = [
        'has_medical_history' => 'boolean',
        'temperature' => 'decimal:1',
        'examined_at' => 'datetime',
    ];

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }
    
    public function medicalStaff()
    {
        return $this->belongsTo(MedicalStaff::class);
    }
    
    public function hasBeenExamined()
    {
        return !is_null($this->examined_at);
    }
}
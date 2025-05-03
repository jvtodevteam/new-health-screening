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
    ];

    protected $casts = [
        'has_medical_history' => 'boolean',
    ];

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }
    
    public function nationality()
    {
        return $this->belongsTo(Nationality::class);
    }
}
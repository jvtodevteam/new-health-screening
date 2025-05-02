<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'start',
        'end',
        'label',
        'available',
    ];

    protected $casts = [
        'available' => 'boolean',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
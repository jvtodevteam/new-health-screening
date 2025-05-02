<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'description',
        'latitude',
        'longitude',
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
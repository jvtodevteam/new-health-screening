<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class MedicalStaff extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'phone',
        'location_id',
        'password', // Ditambahkan untuk autentikasi
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the location where the medical staff works.
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the screenings assigned to this medical staff.
     */
    public function screenings()
    {
        return $this->hasMany(Screening::class, 'medical_staff_id');
    }
}
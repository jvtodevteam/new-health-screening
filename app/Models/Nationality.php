<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nationality extends Model
{
    use HasFactory;

    protected $fillable = [
        'short_name',
        'long_name',
        'dial_code',
    ];

    /**
     * Get all participants with this nationality.
     */
    public function participants()
    {
        return $this->hasMany(Participant::class);
    }
}
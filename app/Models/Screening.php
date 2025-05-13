<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Screening extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'reference_id',
        'user_id',
        'location_id',
        'date',
        'time_slot_id',
        'status',
        'payment_method',
        'payment_id',
        'payment_url',
        'total',
    ];

    protected $casts = [
        'date' => 'date',
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }
    
    /**
     * Get medical staff who examined participants of this screening through the participants
     */
    public function medicalStaff()
    {
        return MedicalStaff::whereHas('participants', function($query) {
            $query->where('screening_id', $this->id);
        })->get();
    }
    
    /**
     * Check if all participants of this screening have been examined
     * 
     * @return bool
     */
    public function allParticipantsExamined()
    {
        return $this->participants()->whereNull('examined_at')->count() === 0 
            && $this->participants()->count() > 0;
    }
    
    /**
     * Get examination progress as percentage
     * 
     * @return int
     */
    public function examinationProgress()
    {
        $total = $this->participants()->count();
        
        if ($total === 0) {
            return 0;
        }
        
        $examined = $this->participants()->whereNotNull('examined_at')->count();
        
        return round(($examined / $total) * 100);
    }
}
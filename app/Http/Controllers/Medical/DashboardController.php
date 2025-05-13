<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $medicalStaff = auth()->guard('medical')->user();
        $location = $medicalStaff->location;
        
        $screeningsToday = $location->screenings()
            ->whereDate('date', now()->toDateString())
            ->with('participants')
            ->get();
            
        $examinedCount = 0;
        $totalParticipants = 0;
        
        foreach ($screeningsToday as $screening) {
            $totalParticipants += $screening->participants->count();
            $examinedCount += $screening->participants->filter(function ($participant) {
                return !is_null($participant->examined_at);
            })->count();
        }
        
        return Inertia::render('Medical/Dashboard', [
            'medicalStaff' => $medicalStaff,
            'location' => $location,
            'screeningsCount' => $screeningsToday->count(),
            'participantsCount' => $totalParticipants,
            'examinedCount' => $examinedCount,
            'progressPercentage' => $totalParticipants > 0 ? round(($examinedCount / $totalParticipants) * 100) : 0,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Screening;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScreeningController extends Controller
{
    public function index(Request $request)
    {
        $medicalStaff = auth()->guard('medical')->user();
        $location = $medicalStaff->location;
        
        $date = $request->date ?? now()->toDateString();
        
        $screenings = $location->screenings()
            ->whereDate('date', $date)
            ->with(['participants', 'timeSlot', 'user'])
            ->get()
            ->map(function ($screening) {
                return [
                    'id' => $screening->id,
                    'reference_id' => $screening->reference_id,
                    'date' => $screening->date->format('Y-m-d'),
                    'time' => $screening->timeSlot->label,
                    'user_name' => $screening->user->name,
                    'participants_count' => $screening->participants->count(),
                    'examined_count' => $screening->participants->filter(function ($participant) {
                        return !is_null($participant->examined_at);
                    })->count(),
                ];
            });
        
        return Inertia::render('Medical/Screenings/Index', [
            'screenings' => $screenings,
            'date' => $date,
            'location' => $location->only('id', 'name'),
        ]);
    }
    
    public function show(Screening $screening)
    {
        $medicalStaff = auth()->guard('medical')->user();
        
        // Pastikan screening ini berada di lokasi petugas medis
        if ($screening->location_id !== $medicalStaff->location_id) {
            abort(403, 'Anda tidak memiliki akses ke pemeriksaan ini');
        }
        
        $screening->load(['participants', 'timeSlot', 'user', 'location']);
        
        $participants = $screening->participants->map(function ($participant) {
            return [
                'id' => $participant->id,
                'name' => $participant->name,
                'age' => $participant->age,
                'examined' => !is_null($participant->examined_at),
                'examined_at' => $participant->examined_at ? $participant->examined_at->format('Y-m-d H:i:s') : null,
                'examiner' => $participant->medicalStaff ? $participant->medicalStaff->username : null,
            ];
        });
        
        return Inertia::render('Medical/Screenings/Show', [
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'date' => $screening->date->format('Y-m-d'),
                'time' => $screening->timeSlot->label,
                'location' => $screening->location->name,
                'user_name' => $screening->user->name,
            ],
            'participants' => $participants,
        ]);
    }
}
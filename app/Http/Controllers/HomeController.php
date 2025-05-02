<?php

namespace App\Http\Controllers;

use App\Models\Screening;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Get recent screenings for the logged in user
        $screenings = auth()->check() 
            ? auth()->user()->screenings()->with('participants', 'location', 'timeSlot')
                ->latest()
                ->take(3)
                ->get()
                ->map(function ($screening) {
                    return [
                        'id' => $screening->id,
                        'location' => $screening->location->name,
                        'date' => $screening->date->format('Y-m-d'),
                        'time' => $screening->timeSlot->start . ' - ' . $screening->timeSlot->end,
                        'status' => $screening->status,
                        'participants' => $screening->participants->map(function ($participant) {
                            return [
                                'name' => $participant->name,
                            ];
                        }),
                    ];
                })
            : [];
            
        // Get simple weather data (you would replace this with a real weather API)
        $weatherData = [
            'temperature' => 13,
            'condition' => 'showers',
            'precipitation' => '75%',
            'highLow' => '16° / 11°',
            'sunrise' => '05:23 AM',
            'sunset' => '17:45 PM',
        ];
            
        return Inertia::render('Home', [
            'screenings' => $screenings,
            'weatherData' => $weatherData,
        ]);
    }
}
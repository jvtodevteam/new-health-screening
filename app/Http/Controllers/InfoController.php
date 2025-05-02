<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InfoController extends Controller
{
    public function index()
    {
        // Get weather data (you would replace this with a real weather API)
        $weatherData = [
            'temperature' => 13,
            'condition' => 'showers',
            'precipitation' => '75%',
            'highLow' => '16° / 11°',
            'sunrise' => '05:23 AM',
            'sunset' => '17:45 PM',
        ];
        
        return Inertia::render('Info', [
            'weatherData' => $weatherData,
        ]);
    }
}
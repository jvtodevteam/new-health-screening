<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function updateLanguage(Request $request, $language)
    {
        // Validate language
        $validated = $request->validate([
            'language' => 'required|in:en,id,zh',
        ]);
        
        // Update user preference if logged in
        if (auth()->check()) {
            auth()->user()->update([
                'locale' => $language,
            ]);
        }
        
        // Set session locale
        session(['locale' => $language]);
        
        // Redirect back
        return redirect()->back();
    }
}
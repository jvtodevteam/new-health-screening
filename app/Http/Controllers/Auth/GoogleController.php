<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle(Request $request)
    {
        // Store the redirect URL in the session for later use
        if ($request->has('redirect_url')) {
            session(['redirect_url' => $request->redirect_url]);
        }
        
        $ref = request()->query('ref');
        session(['ref' => $ref]);
        
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user exists in our database
            $user = User::where('email', $googleUser->email)->first();
            
            // If user doesn't exist, create a new one
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => bcrypt(rand(1,10000)), // Random password as it won't be used
                ]);
            } else {
                // Update the Google ID if it's not already set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id
                    ]);
                }
            }
            
            // Log the user in
            Auth::login($user);
            
            // Get the redirect URL from the session
            $ref = session('ref');
            
            // Remove the ref parameter from the session
            session()->forget('ref');
            
            // Return appropriate view based on the ref parameter
            if ($ref === 'popup') {
                return response()->view('auth/close-and-notify', [], 200);
            } else {
                return redirect('/dashboard');
            }
            
        } catch (\Exception $e) {
            return response()->view('auth/close-with-error', [], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Medical\Auth;

use App\Http\Controllers\Controller;
use App\Models\MedicalStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Medical/Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::guard('medical')->attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended(route('medical.dashboard'));
        }

        return back()->withErrors([
            'username' => 'Kredensial yang diberikan tidak cocok dengan data kami.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('medical')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('medical.login');
    }
}
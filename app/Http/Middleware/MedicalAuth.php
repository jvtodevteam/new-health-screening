<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class MedicalAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah request saat ini adalah untuk medical login
        // Jika iya, lanjutkan ke middleware berikutnya
        if ($request->routeIs('medical.login')) {
            return $next($request);
        }
        
        if (!Auth::guard('medical')->check()) {
            return redirect()->route('medical.login');
        }

        return $next($request);
    }
}
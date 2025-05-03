<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle($request, Closure $next)
    {
        if (session()->has('locale')) {
            App::setLocale(session('locale'));
            \Inertia\Inertia::share('locale', session('locale'));
        } else {
            \Inertia\Inertia::share('locale', 'en');
        }
        
        return $next($request);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'address' => 'required|string',
            'reason' => 'required|string',
            'document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'location' => 'nullable|array',
            'location.lat' => 'nullable|numeric',
            'location.lng' => 'nullable|numeric',
        ]);
        
        // Handle document upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('partner-documents', 'public');
        }
        
        // Create partner application
        Partner::create([
            'business_name' => $validated['business_name'],
            'business_type' => $validated['business_type'],
            'contact_person' => $validated['contact_person'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'reason' => $validated['reason'],
            'document_path' => $documentPath,
            'status' => 'pending',
            'latitude' => $validated['location']['lat'] ?? null,
            'longitude' => $validated['location']['lng'] ?? null,
        ]);
        
        return redirect()->back()->with('success', 'Partner application submitted successfully!');
    }
}
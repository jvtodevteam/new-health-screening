<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Screening;
use App\Models\Nationality;
use App\Models\Organization;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    /**
     * Display a listing of participants pending examination.
     */
    public function index(Request $request)
    {
        $medicalStaff = Auth::guard('medical')->user();
        $date = $request->date ? Carbon::parse($request->date)->format('Y-m-d') : Carbon::today()->format('Y-m-d');
        
        // Get participants that haven't been examined yet
        $participants = Participant::whereNull('examined_at')
            ->whereHas('screening', function($query) use ($medicalStaff, $date) {
                $query->where('location_id', $medicalStaff->location_id)
                      ->where('status', 'complete')
                      ->whereDate('date', $date);
            })
            ->with(['screening.timeSlot'])
            ->get();
        // Prepare data for frontend
        $registrations = $participants->map(function($participant) {
            return [
                'id' => $participant->id,
                'reference_id' => $participant->screening->reference_id,
                'patient_name' => $participant->name,
                'age' => $participant->age,
                'screening_date' => Carbon::parse($participant->screening->date)->format('d M Y') . ' ' . 
                    optional($participant->screening->timeSlot)->label,
                'has_examination' => false, // All are false since we filtered to only get non-examined participants
            ];
        });
        
        return Inertia::render('Medical/Registrations/Index', [
            'registrations' => $registrations,
            'currentDate' => $date,
        ]);
    }
    
    /**
     * Show the form for editing and examining the participant.
     */
    public function edit(Request $request, Participant $participant)
    {
        $medicalStaff = Auth::guard('medical')->user();
        
        // Make sure the participant is in the medical staff's location
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id) {
            return redirect()->route('medical.registrations.index')
                ->with('error', 'Anda tidak memiliki akses ke data ini.');
        }
        
        // Load nationalities for dropdown
        $nationalities = Nationality::select('id','long_name as name')->orderBy('long_name')->get();
        
        // Load participant with relationships
        $participant->load(['nationality', 'screening']);

        $fromGroup = $request->has('from_group');
        
        return Inertia::render('Medical/Registrations/Edit', [
            'participant' => $participant,
            'registration' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'date' => Carbon::parse($screening->date)->format('Y-m-d'),
                'time' => optional($screening->timeSlot)->label,
            ],
            'nationalities' => $nationalities,
            'fromGroup' => $fromGroup,
        ]);
    }

    public function group(Request $request)
    {
        $medicalStaff = Auth::guard('medical')->user();
        $referenceId = $request->reference_id;
        
        // Get screening by reference ID
        $screening = Screening::where('reference_id', $referenceId)
            ->where('location_id', $medicalStaff->location_id)
            ->where('status', 'complete')
            ->with(['location', 'timeSlot', 'participants'])
            ->first();
        
        if (!$screening) {
            return redirect()->route('medical.registrations.index')
                ->with('error', 'Kode registrasi tidak valid atau tidak ditemukan di lokasi Anda.');
        }
        
        // Prepare screening data
        $screeningData = [
            'id' => $screening->id,
            'reference_id' => $screening->reference_id,
            'formatted_date' => Carbon::parse($screening->date)->format('d M Y') . ' ' . optional($screening->timeSlot)->label,
            'location_name' => optional($screening->location)->name,
        ];
        
        // Prepare participants data
        $participantsData = $screening->participants->map(function($participant) {
            return [
                'id' => $participant->id,
                'name' => $participant->name,
                'age' => $participant->age,
                'title' => $participant->title,
                'examined' => !is_null($participant->examined_at),
            ];
        });
        
        return Inertia::render('Medical/Registrations/Group', [
            'screening' => $screeningData,
            'participants' => $participantsData,
        ]);
    }
    
    /**
     * Update the participant and record examination.
     */
    public function update(Request $request, Participant $participant)
    {
        $medicalStaff = Auth::guard('medical')->user();
        
        // Make sure the participant is in the medical staff's location
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id) {
            return redirect()->route('medical.registrations.index')
                ->with('error', 'Anda tidak memiliki akses ke data ini.');
        }
        
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0|max:120',
            'title' => 'required|string|in:Mr,Mrs',
            'nationality_id' => 'required|exists:nationalities,id',
            'id_number' => 'required|string|max:50',
            'has_medical_history' => 'boolean',
            'allergies' => 'nullable|string',
            'past_medical_history' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'family_medical_history' => 'nullable|string',
            'systolic_blood_pressure' => 'required|integer|min:60|max:250',
            'diastolic_blood_pressure' => 'required|integer|min:40|max:150',
            'heart_rate' => 'required|integer|min:40|max:220',
            'temperature' => 'required|numeric|min:35|max:42',
            'respiratory_rate' => 'required|integer|min:8|max:60',
            'oxygen_saturation' => 'required|integer|min:70|max:100',
        ]);
        
        // If examination is being done for the first time, generate verification code
        if (is_null($participant->examined_at)) {
            // Generate a unique code that doesn't already exist
            do {
                $uniqueCode = strtoupper(Str::random(6));
            } while (Participant::where('unique_code', $uniqueCode)->exists());
            
            $validatedWithDefaults = array_merge($validated, [
                'medical_staff_id' => $medicalStaff->id,
                'examined_at' => now(),
                'unique_code' => $uniqueCode,
            ]);
        } else {
            $validatedWithDefaults = $validated;
        }
            
        // Update participant
        $participant->update($validatedWithDefaults);

        if ($request->from_group) {
            $screeningId = $participant->screening_id;
            $screening = Screening::find($screeningId);
            
            return redirect()->route('medical.registrations.group', ['reference_id' => $screening->reference_id])
                ->with('success', 'Data pemeriksaan berhasil disimpan.');
        }
     
        
        return redirect()->route('medical.registrations.index')
            ->with('success', 'Data pemeriksaan berhasil disimpan.');
    }
}
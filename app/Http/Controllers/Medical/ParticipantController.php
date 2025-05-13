<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function examine(Participant $participant)
    {
        $medicalStaff = auth()->guard('medical')->user();
        
        // Pastikan participant ini berada di lokasi petugas medis
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id) {
            abort(403, 'Anda tidak memiliki akses ke pemeriksaan peserta ini');
        }
        
        $participant->load(['nationality', 'screening.location']);
        
        return Inertia::render('Medical/Participants/Examine', [
            'participant' => [
                'id' => $participant->id,
                'name' => $participant->name,
                'age' => $participant->age,
                'gender' => $participant->title, // Asumsi title menyimpan gender
                'nationality' => $participant->nationality ? $participant->nationality->name : '',
                'id_number' => $participant->id_number,
                'has_medical_history' => $participant->has_medical_history,
                'allergies' => $participant->allergies,
                'past_medical_history' => $participant->past_medical_history,
                'current_medications' => $participant->current_medications,
                'family_medical_history' => $participant->family_medical_history,
                'systolic_blood_pressure' => $participant->systolic_blood_pressure,
                'diastolic_blood_pressure' => $participant->diastolic_blood_pressure,
                'heart_rate' => $participant->heart_rate,
                'temperature' => $participant->temperature,
                'respiratory_rate' => $participant->respiratory_rate,
                'oxygen_saturation' => $participant->oxygen_saturation,
                'examined_at' => $participant->examined_at,
            ],
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'location' => $screening->location->name,
            ],
        ]);
    }
    
    public function storeExamination(Request $request, Participant $participant)
    {
        $medicalStaff = auth()->guard('medical')->user();
        
        // Pastikan participant ini berada di lokasi petugas medis
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id) {
            abort(403, 'Anda tidak memiliki akses ke pemeriksaan peserta ini');
        }
        
        $validated = $request->validate([
            'systolic_blood_pressure' => 'required|integer|min:60|max:250',
            'diastolic_blood_pressure' => 'required|integer|min:40|max:150',
            'heart_rate' => 'required|integer|min:40|max:220',
            'temperature' => 'required|numeric|min:35|max:42',
            'respiratory_rate' => 'required|integer|min:8|max:60',
            'oxygen_saturation' => 'required|integer|min:70|max:100',
        ]);
        
        $participant->update([
            'medical_staff_id' => $medicalStaff->id,
            'systolic_blood_pressure' => $validated['systolic_blood_pressure'],
            'diastolic_blood_pressure' => $validated['diastolic_blood_pressure'],
            'heart_rate' => $validated['heart_rate'],
            'temperature' => $validated['temperature'],
            'respiratory_rate' => $validated['respiratory_rate'],
            'oxygen_saturation' => $validated['oxygen_saturation'],
            'examined_at' => now(),
        ]);
        
        return redirect()->route('medical.screenings.show', $screening->id)
            ->with('success', 'Pemeriksaan berhasil disimpan');
    }
}
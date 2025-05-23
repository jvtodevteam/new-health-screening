<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
    public function storeApi(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('Received examination results API request from screening.mountijen.com', [
            'participant_id' => $request->input('participant_id'),
            'status' => $request->input('examination_results.status')
        ]);

        try {
            // Begin transaction to ensure data consistency
            DB::beginTransaction();

            // Validate the incoming data structure
            $validator = Validator::make($request->all(), [
                'participant_id' => 'required|integer',
                'examination_results' => 'required|array',
                'examination_results.status' => 'required|string',
                'examination_results.screening_date' => 'required|date',
                'examination_results.vital_signs' => 'required|array',
                'examination_results.vital_signs.blood_pressure' => 'required|string',
                'examination_results.vital_signs.heart_rate' => 'required|string',
                'examination_results.vital_signs.temperature' => 'required|string',
                'examination_results.vital_signs.respiratory_rate' => 'required|string',
                'examination_results.vital_signs.oxygen_saturation' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Extract data from request
            $participantId = $request->input('participant_id'); // This is the reference from screening.mountijen forms table
            $examinationResults = $request->input('examination_results');

            // Find the participant by ID (using the reference from screening.mountijen.com)
            $participant = Participant::find($participantId);

            if (!$participant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Participant not found with ID: ' . $participantId,
                ], 404);
            }

            // Parse vital signs data
            $vitalSigns = $examinationResults['vital_signs'];

            // Parse blood pressure (format: "120/80" or similar)
            $bloodPressure = $vitalSigns['blood_pressure'];
            $bpParts = explode('/', $bloodPressure);
            $systolicBP = isset($bpParts[0]) ? (int) trim($bpParts[0]) : null;
            $diastolicBP = isset($bpParts[1]) ? (int) trim($bpParts[1]) : null;

            // Validate vital signs ranges
            $vitalSignsValidator = Validator::make([
                'systolic_blood_pressure' => $systolicBP,
                'diastolic_blood_pressure' => $diastolicBP,
                'heart_rate' => (int) $vitalSigns['heart_rate'],
                'temperature' => (float) $vitalSigns['temperature'],
                'respiratory_rate' => (int) $vitalSigns['respiratory_rate'],
                'oxygen_saturation' => (int) $vitalSigns['oxygen_saturation'],
            ], [
                'systolic_blood_pressure' => 'required|integer|min:60|max:250',
                'diastolic_blood_pressure' => 'required|integer|min:40|max:150',
                'heart_rate' => 'required|integer|min:40|max:220',
                'temperature' => 'required|numeric|min:35|max:42',
                'respiratory_rate' => 'required|integer|min:8|max:60',
                'oxygen_saturation' => 'required|integer|min:70|max:100',
            ]);

            if ($vitalSignsValidator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vital signs validation failed',
                    'errors' => $vitalSignsValidator->errors()
                ], 422);
            }

            // Update participant with examination results using existing columns
            $participant->update([
                // Vital signs - using existing columns
                'systolic_blood_pressure' => $systolicBP,
                'diastolic_blood_pressure' => $diastolicBP,
                'heart_rate' => (int) $vitalSigns['heart_rate'],
                'temperature' => (float) $vitalSigns['temperature'],
                'respiratory_rate' => (int) $vitalSigns['respiratory_rate'],
                'oxygen_saturation' => (int) $vitalSigns['oxygen_saturation'],
                'examined_at' => $examinationResults['screening_date'],

                // Medical history - using existing columns
                'allergies' => $examinationResults['medical_history']['allergies'] ?? $participant->allergies,
                'past_medical_history' => $examinationResults['medical_history']['past_medical_history'] ?? $participant->past_medical_history,
                'current_medications' => $examinationResults['medical_history']['current_medications'] ?? $participant->current_medications,
                'family_medical_history' => $examinationResults['medical_history']['family_medical_history'] ?? $participant->family_medical_history,
            ]);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Examination results updated successfully',
                'data' => [
                    'participant_id' => $participant->id,
                    'participant_name' => $participant->name,
                    'examination_status' => 'completed',
                    'updated_at' => $participant->updated_at,
                ]
            ], 200);
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            // Log the error
            Log::error('Error updating examination results from screening.mountijen.com API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing examination results: ' . $e->getMessage(),
            ], 500);
        }
    }
}

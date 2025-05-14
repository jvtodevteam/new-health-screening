<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Screening;
use App\Models\Organization;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExaminationController extends Controller
{
    /**
     * Display a listing of the completed examinations.
     */
    public function index(Request $request)
    {
        $medicalStaff = Auth::guard('medical')->user();
        $date = $request->date ? Carbon::parse($request->date)->format('Y-m-d') : Carbon::today()->format('Y-m-d');
        
        // Get all participants with completed examinations at current location
        $participants = Participant::whereNotNull('examined_at')
            ->whereHas('screening', function($query) use ($medicalStaff, $date) {
                $query->where('location_id', $medicalStaff->location_id)
                      ->whereDate('date', $date);
            })
            ->with(['screening', 'medicalStaff', 'nationality'])
            ->get();
        
        // Prepare data for frontend
        $examinations = $participants->map(function($participant) {
            return [
                'id' => $participant->id,
                'reference_id' => $participant->screening->reference_id,
                'patient_name' => $participant->name,
                'examined_date' => Carbon::parse($participant->examined_at)->format('d M Y H:i'),
                'systolic_blood_pressure' => $participant->systolic_blood_pressure,
                'diastolic_blood_pressure' => $participant->diastolic_blood_pressure,
                'temperature' => $participant->temperature,
                'medical_staff' => optional($participant->medicalStaff)->username,
                'unique_code' => $participant->unique_code,
            ];
        });
        
        return Inertia::render('Medical/Examinations/Index', [
            'examinations' => $examinations,
            'currentDate' => $date,
        ]);
    }
    
    /**
     * Display the QR code for the examination.
     */
    public function qrcode(Participant $participant)
    {
        $medicalStaff = Auth::guard('medical')->user();
        
        // Make sure the participant is in the medical staff's location and has been examined
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id || is_null($participant->examined_at)) {
            return redirect()->route('medical.examinations.index')
                ->with('error', 'Anda tidak memiliki akses ke data ini atau pemeriksaan belum dilakukan.');
        }
        
        // Load participant with relationships
        $participant->load(['nationality', 'screening', 'medicalStaff']);
        
        // Prepare examination data for QR code
        $examination = [
            'id' => $participant->id,
            'reference_id' => $screening->reference_id,
            'patient_name' => $participant->name,
            'examined_date' => Carbon::parse($participant->examined_at)->format('d M Y H:i'),
            'medical_staff' => optional($participant->medicalStaff)->username,
            'unique_code' => $participant->unique_code,
        ];
        
        return Inertia::render('Medical/Examinations/QrCode', [
            'examination' => $examination,
        ]);
    }
    
    /**
     * Display the printable health certificate.
     */
    public function print(Participant $participant)
    {
        $medicalStaff = Auth::guard('medical')->user();
        
        // Make sure the participant is in the medical staff's location and has been examined
        $screening = $participant->screening;
        if ($screening->location_id !== $medicalStaff->location_id || is_null($participant->examined_at)) {
            return redirect()->route('medical.examinations.index')
                ->with('error', 'Anda tidak memiliki akses ke data ini atau pemeriksaan belum dilakukan.');
        }
        
        // Load participant with relationships
        $participant->load(['nationality', 'screening', 'medicalStaff']);
        
        // Get organization data (can be from settings or hardcoded for now)
        $organization = [
            'name' => 'KLINIK KESEHATAN TERPADU',
            'address' => 'Jl. Kesehatan No. 123, Kota',
            'phone' => '021-12345678',
            'city' => 'Jakarta',
            'logo_url' => '/logo.svg',
        ];
        
        // In a real application, you might want to get this from a settings table
        // $organization = Organization::first();
        
        return Inertia::render('Medical/Examinations/Print', [
            'examination' => $participant,
            'medicalStaff' => $medicalStaff,
            'organization' => $organization,
        ]);
    }
    
    /**
     * Public endpoint to verify examination results via QR code.
     */
    public function verify($code)
    {
        $participant = Participant::where('unique_code', $code)
            ->whereNotNull('examined_at')
            ->with(['screening', 'medicalStaff', 'nationality'])
            ->first();
        
        if (!$participant) {
            return view('examinations.verification-failed');
        }
        
        // In a real app, you might want to create a public view for this
        // For now, we'll return the data directly
        return view('examinations.verification', [
            'participant' => $participant,
            'screening' => $participant->screening,
            'medicalStaff' => $participant->medicalStaff,
        ]);
    }
    public function verifyIdentity(Request $request, $code)
    {
        $participant = Participant::where('unique_code', $code)
            ->whereNotNull('examined_at')
            ->first();
        
        if (!$participant) {
            return redirect()->route('home')->with('error', 'Data pemeriksaan tidak ditemukan.');
        }
        
        // Verify ID number
        if ($request->id_number === $participant->id_number) {
            // Store verification status in session
            session(['id_verified' => $participant->id]);
            
            return redirect()->route('examinations.verify', ['code' => $code]);
        }
        
        // Only show error if a form was actually submitted
        if ($request->has('id_number')) {
            return back()->with('error', 'Nomor KTP/Passport tidak sesuai dengan data pemeriksaan.');
        }
        
        // If no form was submitted, just show the form
        return redirect()->route('examinations.verify', ['code' => $code]);
    }
}
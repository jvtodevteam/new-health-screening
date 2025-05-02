<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Screening;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Illuminate\Support\Str;

class ScreeningController extends Controller
{
    public function index()
    {
        // Get all screenings for the logged in user
        $screenings = Screening::with(['participants', 'location', 'timeSlot'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($screening) {
                    return [
                        'id' => $screening->id,
                        'reference_id' => $screening->reference_id,
                        'location' => $screening->location->name,
                        'date' => $screening->date->format('Y-m-d'),
                        'time' => $screening->timeSlot->start . ' - ' . $screening->timeSlot->end,
                        'status' => $screening->status,
                        'payment_method' => $screening->payment_method,
                        'payment_url' => $screening->payment_url,
                        'total' => $screening->total,
                        'participants' => $screening->participants->map(function ($participant) {
                            return [
                                'name' => $participant->name,
                                'title' => $participant->title,
                                'age' => $participant->age,
                                'nationality' => $participant->nationality,
                                'id_number' => $participant->id_number,
                                'has_medical_history' => $participant->has_medical_history,
                            ];
                        }),
                        'created_at' => $screening->created_at,
                    ];
                });
            
        return Inertia::render('Screening/ScreeningList', [
            'screenings' => $screenings
        ]);
    }

    public function create()
    {
        $locations = Location::select('id', 'name', 'city', 'description', 'latitude as lat', 'longitude as lng')
            ->get()
            ->groupBy('city');
            
        $timeSlots = TimeSlot::where('available', true)
            ->select('id', 'start', 'end', 'label')
            ->get();
            
        return Inertia::render('Screening/ScreeningForm', [
            'locations' => $locations,
            'timeSlots' => $timeSlots
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'date' => 'required|date|after_or_equal:today',
            'time_slot_id' => 'required|exists:time_slots,id',
            'participants' => 'required|array|min:1',
            'participants.*.title' => 'required|in:Mr,Mrs,Ms',
            'participants.*.name' => 'required|string|max:255',
            'participants.*.birth_year' => 'required|integer|min:1900|max:' . date('Y'),
            'participants.*.nationality' => 'required|string|max:255',
            'participants.*.id_number' => 'required|string|max:255',
            'participants.*.has_medical_history' => 'boolean',
            'payment_method' => 'required|string',
            'terms_agreed' => 'required|accepted',
        ]);
        
        // Calculate age from birth year
        foreach ($validated['participants'] as $key => $participant) {
            $validated['participants'][$key]['age'] = date('Y') - $participant['birth_year'];
        }
        
        // Calculate total
        $totalParticipants = count($validated['participants']);
        $screeningFee = 35000; // 35,000 IDR per participant
        $serviceFee = 5000;    // 5,000 IDR service fee
        $total = ($screeningFee * $totalParticipants) + $serviceFee;
        
        // Create reference ID
        $referenceId = 'IJN' . date('Ymd') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        // Create payment (this would interface with your payment gateway)
        $paymentData = $this->generatePayment([
            'payment_method' => $validated['payment_method'],
            'external_id' => $referenceId,
            'description' => 'Health Screening Payment for ' . $totalParticipants . ' participant(s)',
            'amount' => $total,
            'customer' => $validated['participants'][0]['name'],
            'quantity' => $totalParticipants,
            'price' => $screeningFee,
        ]);
        
        // Create screening record
        $screening = Screening::create([
            'reference_id' => $referenceId,
            'user_id' => 1,
            'location_id' => $validated['location_id'],
            'date' => $validated['date'],
            'time_slot_id' => $validated['time_slot_id'],
            'status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'payment_id' => $paymentData['id'] ?? null,
            'payment_url' => $paymentData['invoice_url'] ?? null,
            'total' => $total,
        ]);
        
        // Create participant records
        foreach ($validated['participants'] as $participantData) {
            $screening->participants()->create([
                'title' => $participantData['title'],
                'name' => $participantData['name'],
                'age' => $participantData['age'],
                'nationality' => $participantData['nationality'],
                'id_number' => $participantData['id_number'],
                'has_medical_history' => $participantData['has_medical_history'] ?? false,
                'allergies' => $participantData['allergies'] ?? null,
                'past_medical_history' => $participantData['past_medical_history'] ?? null,
                'current_medications' => $participantData['current_medications'] ?? null,
                'family_medical_history' => $participantData['family_medical_history'] ?? null,
            ]);
        }
        
        return redirect()->route('screenings.success', $screening);
    }
    protected function generatePayment($data)
    {
        // Replace this with actual API call to your payment gateway
        // This is just a placeholder implementation
        
        return [
            'id' => 'payment_' . Str::random(16),
            'invoice_url' => 'https://yourdomain.com/payments/' . Str::random(16),
        ];
    }

    public function show(Screening $screening)
    {        
        $screening->load('participants', 'location', 'timeSlot');
        
        return Inertia::render('Screening/ScreeningDetail', [
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'location' => $screening->location->name,
                'date' => $screening->date,
                'time' => $screening->timeSlot->start . ' - ' . $screening->timeSlot->end,
                'status' => $screening->status,
                'payment_method' => $screening->payment_method,
                'payment_url' => $screening->payment_url,
                'total' => $screening->total,
                'participants' => $screening->participants->map(function ($participant) {
                    return [
                        'title' => $participant->title,
                        'name' => $participant->name,
                        'age' => $participant->age,
                        'nationality' => $participant->nationality,
                        'id_number' => $participant->id_number,
                        'has_medical_history' => $participant->has_medical_history,
                        'allergies' => $participant->allergies,
                        'past_medical_history' => $participant->past_medical_history,
                        'current_medications' => $participant->current_medications,
                        'family_medical_history' => $participant->family_medical_history,
                    ];
                }),
            ]
        ]);
    }

    public function ticket(Screening $screening)
    {
        
        $screening->load('participants', 'location', 'timeSlot');
        
        return Inertia::render('Screening/ETicket', [
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'location' => $screening->location->name,
                'date' => $screening->date,
                'time' => $screening->timeSlot->start . ' - ' . $screening->timeSlot->end,
                'participants' => $screening->participants->map(function ($participant) {
                    return [
                        'title' => $participant->title,
                        'name' => $participant->name,
                        'age' => $participant->age,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Show success page after screening creation.
     *
     * @param  \App\Models\Screening  $screening
     * @return \Inertia\Response
     */
    public function success(Screening $screening)
    {
        return Inertia::render('Screening/SuccessScreen', [
            'screening' => [
                'id' => $screening->id,
                'payment_url' => $screening->payment_url,
            ]
        ]);
    }

    /**
     * Handle payment webhook.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function handlePaymentWebhook(Request $request)
    {
        // Validate the webhook signature
        // Process payment status update
        
        $paymentId = $request->input('payment_id');
        $status = $request->input('status');
        
        if ($status === 'paid') {
            $screening = Screening::where('payment_id', $paymentId)->first();
            
            if ($screening) {
                $screening->update(['status' => 'complete']);
            }
        }
        
        return response()->json(['success' => true]);
    }

    // function generatePayment(Request $request){
    //     Configuration::setXenditKey(env('XENDIT_KEY'));
    //     $paymentMethod = [];

    //     if($request->payment_method == 'cc'){
    //         $paymentMethod = ["CREDIT_CARD"];
    //     }
    //     else if($request->payment_method == 'qris'){
    //         $paymentMethod = ["QRIS"];
    //     }
    //     else if($request->payment_method == 'ovo'){
    //         $paymentMethod = ["OVO"];
    //     }
    //     else if($request->payment_method == 'bni'){
    //         $paymentMethod = ["BNI"];
    //     }
    //     else if($request->payment_method == 'bri'){
    //         $paymentMethod = ["BRI"];
    //     }
    //     else if($request->payment_method == 'bsi'){
    //         $paymentMethod = ["BSI"];
    //     }
    //     else if($request->payment_method == 'mandiri'){
    //         $paymentMethod = ["MANDIRI"];
    //     }
        
        
    //     $apiInstance = new InvoiceApi();
    //     $create_invoice_request = new CreateInvoiceRequest([
    //       'external_id' => $request->external_id,
    //       'description' => $request->description,
    //       'invoice_duration' => 86400,
    //       'amount' => $request->amount,
    //       'currency' => 'IDR',
    //       'customer' => [
    //         "given_names" => $request->customer,
    //       ],
    //       "items" => [
    //         [
    //             'name' => "Screening Payment",
    //             'quantity' => $request->quantity,
    //             'price' => $request->price,
    //         ]
    //     ],
    //       "fees" => [
    //         [
    //           "type" => "TAX",
    //           "value" => 0,
    //         ]
    //       ],
    //       "payment_methods" => $paymentMethod,
    //       "success_redirect_url" => url('payment-success/'.$request->external_id),   
    //     ]);

    //     $result = $apiInstance->createInvoice($create_invoice_request);
    //     return $result;
    // }

    // Laravel Controller Implementation with Blade View
    public function paymentSuccess($id)
    {
        // Clean any quotes from the ID
        $cleanId = trim($id, '"\'');
        
        // Here you can add any server-side logic if needed
        // For example, update payment status in your database
        
        // Return a view with the cleaned ID
        return view('payment-success', [
            'screeningId' => $cleanId
        ]);
    }
}

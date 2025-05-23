<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Location;
use App\Models\Nationality;
use App\Models\Screening;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        $screenings = auth()->check() ? auth()->user()
            ->screenings()->with(['participants', 'location', 'timeSlot'])
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
            }) : [];

        return Inertia::render('Screening/ScreeningList', [
            'screenings' => $screenings
        ]);
    }

    public function create()
    {
        // Get cities with their locations
        $cities = City::with(['locations' => function ($query) {
            $query->select('id', 'city_id', 'name', 'description', 'latitude', 'longitude');
        }])
            ->get()
            ->map(function ($city) {
                return [
                    'id' => $city->id,
                    'name' => $city->name,
                    'latitude' => $city->latitude,
                    'longitude' => $city->longitude,
                    'locations' => $city->locations->map(function ($location) {
                        // Load time slots for each location
                        $timeSlots = TimeSlot::where('location_id', $location->id)
                            ->where('available', true)
                            ->select('id', 'location_id', 'start', 'end', 'label')
                            ->get();

                        return [
                            'id' => $location->id,
                            'name' => $location->name,
                            'description' => $location->description,
                            'lat' => $location->latitude,
                            'lng' => $location->longitude,
                            'city_id' => $location->city_id,
                            'time_slots' => $timeSlots
                        ];
                    })
                ];
            })
            ->keyBy('name');

        // Get nationalities for the form
        $nationalities = Nationality::select('id', 'long_name as name', 'short_name as code')->get();
        if (session()->has('pending_screening_id')) {
            // Hapus dari session
            $pendingScreeningId = session('pending_screening_id');
            session()->forget('pending_screening_id');

            // Redirect ke halaman list screening
            return redirect()->route('screenings.index');
        }
        return Inertia::render('Form/ScreeningForm', [
            'cities' => $cities,
            'nationalities' => $nationalities
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
            'participants.*.nationality_id' => 'required|exists:nationalities,id', // Updated validation
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
        $serviceFee = 0;    // 5,000 IDR service fee
        $total = ($screeningFee * $totalParticipants) + $serviceFee;

        // Create reference ID
        $referenceId = 'IJN' . date('Ymd') . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        // Create payment (this would interface with your payment gateway)
        $paymentResult = null;
        if ($validated['payment_method'] != 'spot') {
            $paymentData = [
                'payment_method' => $validated['payment_method'],
                'external_id' => $referenceId,
                'description' => 'Health Screening Payment for ' . $totalParticipants . ' participant(s)',
                'amount' => $total,
                'customer' => $validated['participants'][0]['name'],
                'quantity' => $totalParticipants,
                'price' => $screeningFee,
            ];
            $paymentResult = $this->generatePayment($paymentData);
        }

        $storeData = [
            'reference_id' => $referenceId,
            'user_id' => auth()->id(),
            'location_id' => $validated['location_id'],
            'date' => $validated['date'],
            'time_slot_id' => $validated['time_slot_id'],
            'status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'payment_id' => $validated['payment_method'] != 'spot' ? ($paymentResult['id'] ?? null) : null,
            'payment_url' => $validated['payment_method'] != 'spot' ? ($paymentResult['invoice_url'] ?? null) : null,
            'total' => $total,
        ];

        if ($validated['payment_method'] == 'spot') {
            $storeData['status'] = 'complete';
        }



        // Create screening record
        $screening = Screening::create($storeData);

        // Create participant records
        $participantRecords = [];
        foreach ($validated['participants'] as $participantData) {
            // Get nationality name for backward compatibility
            $nationality = Nationality::find($participantData['nationality_id']);
            $nationalityName = $nationality->name ?? 'Unknown';
            $nationalityCode = $nationality->code ?? null;

            $participant = $screening->participants()->create([
                'title' => $participantData['title'],
                'name' => $participantData['name'],
                'age' => $participantData['age'],
                'nationality_id' => $participantData['nationality_id'],
                'nationality' => $nationalityName, // Store the name for backward compatibility
                'id_number' => $participantData['id_number'],
                'has_medical_history' => $participantData['has_medical_history'] ?? false,
                'allergies' => $participantData['allergies'] ?? null,
                'past_medical_history' => $participantData['past_medical_history'] ?? null,
                'current_medications' => $participantData['current_medications'] ?? null,
                'family_medical_history' => $participantData['family_medical_history'] ?? null,
            ]);

            // Add to array for API submission
            $participantRecords[] = [
                'id' => $participant->id,
                'title' => $participantData['title'],
                'name' => $participantData['name'],
                'age' => $participantData['age'],
                'birth_year' => $participantData['birth_year'],
                'nationality_id' => $participantData['nationality_id'],
                'nationality' => $nationalityName,
                'nationality_code' => $nationalityCode,
                'id_number' => $participantData['id_number'],
                'has_medical_history' => $participantData['has_medical_history'] ?? false,
                'allergies' => $participantData['allergies'] ?? null,
                'past_medical_history' => $participantData['past_medical_history'] ?? null,
                'current_medications' => $participantData['current_medications'] ?? null,
                'family_medical_history' => $participantData['family_medical_history'] ?? null,
            ];
        }

        // Get location and time slot info for API submission
        $location = Location::find($validated['location_id']);
        $timeSlot = TimeSlot::find($validated['time_slot_id']);

        // Get user info
        $user = auth()->user();

        // Prepare data for external API
        $apiData = [
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $referenceId,
                'user_id' => auth()->id(),
                'user_email' => $user ? $user->email : null,
                'user_name' => $user ? $user->name : null,
                'user_phone' => $user ? $user->phone : null,
                'location_id' => $validated['location_id'],
                'location_name' => $location ? $location->name : null,
                'location_address' => $location ? $location->address : null,
                'date' => $validated['date'],
                'time_slot_id' => $validated['time_slot_id'],
                'time_slot_start' => $timeSlot ? $timeSlot->start_time : null,
                'time_slot_end' => $timeSlot ? $timeSlot->end_time : null,
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'payment_id' => $validated['payment_method'] != 'spot' ? ($paymentResult['id'] ?? null) : null,
                'payment_status' => $validated['payment_method'] == 'spot' ? 'pending' : 'unpaid',
                'payment_url' => $validated['payment_method'] != 'spot' ? ($paymentResult['invoice_url'] ?? null) : null,
                'total' => $total,
                'created_at' => $screening->created_at->toIso8601String(),
            ],
            'participants' => $participantRecords
        ];

        // Post to external API
        try {
            $response = Http::post('https://screening.mountijen.com/admin/post-api', $apiData);
        } catch (\Exception $e) {
            // Log the error but continue with the process
            Log::error('Failed to sync screening ' . $referenceId . ' with external API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        session(['pending_screening_id' => $screening->id]);
        if (isset($paymentResult['invoice_url']) && !empty($paymentResult['invoice_url'])) {
            return Inertia::location($paymentResult['invoice_url']);
        }

        // Fallback ke halaman sukses jika tidak ada URL pembayaran
        return redirect()->route('screenings.index');
    }
    
    protected function generatePayment($paymentData)
    {
        Configuration::setXenditKey(env('XENDIT_KEY'));
        $paymentMethod = [];

        if ($paymentData['payment_method'] == 'card') {
            $paymentMethod = ["CREDIT_CARD"];
        } else if ($paymentData['payment_method'] == 'qris') {
            $paymentMethod = ["QRIS"];
        } else if ($paymentData['payment_method'] == 'ovo') {
            $paymentMethod = ["OVO"];
        } else if ($paymentData['payment_method'] == 'bni') {
            $paymentMethod = ["BNI"];
        } else if ($paymentData['payment_method'] == 'bri') {
            $paymentMethod = ["BRI"];
        } else if ($paymentData['payment_method'] == 'bsi') {
            $paymentMethod = ["BSI"];
        } else if ($paymentData['payment_method'] == 'mandiri') {
            $paymentMethod = ["MANDIRI"];
        }

        $apiInstance = new InvoiceApi();
        $create_invoice_request = new CreateInvoiceRequest([
            'external_id' => $paymentData['external_id'],
            'description' => $paymentData['description'],
            'invoice_duration' => 86400,
            'amount' => $paymentData['amount'],
            'currency' => 'IDR',
            'customer' => [
                "given_names" => $paymentData['customer'],
            ],
            "items" => [
                [
                    'name' => "Screening Payment",
                    'quantity' => $paymentData['quantity'],
                    'price' => $paymentData['price'],
                ]
            ],
            "fees" => [
                [
                    "type" => "TAX",
                    "value" => 0,
                ]
            ],
            "payment_methods" => $paymentMethod,
            "success_redirect_url" => route('screenings.show', $paymentData['external_id']),
        ]);

        $result = $apiInstance->createInvoice($create_invoice_request);
        return $result;
    }

    public function show($referenceId)
    {
        $screening = Screening::where('reference_id', $referenceId)->firstOrFail();
        $screening->load('participants', 'location', 'timeSlot');
        return Inertia::render('Screening/ScreeningDetail', [
            'screening' => [
                'id' => $screening->id,
                'reference_id' => $screening->reference_id,
                'location' => $screening->location->name,
                'date' => date('Y-m-d', strtotime($screening->date)),
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
                'date' => date('Y-m-d', strtotime($screening->date)),
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
        return Inertia::render('Form/SuccessScreen', [
            'screening' => [
                'reference_id' => $screening->reference_id,
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

        $referenceId = $request->input('reference_id');
        $status = $request->input('status');

        if ($status === 'paid') {
            $screening = Screening::where('reference_id', $referenceId)->first();

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

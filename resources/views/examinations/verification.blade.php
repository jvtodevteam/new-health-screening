<!-- resources/views/examinations/verification.blade.php -->
@php
    // Clear session on page load if refresh detected via URL parameter
    if (request()->has('clear_session')) {
        session()->forget('id_verified');
    }
    
    $isVerified = false;
    if (session('id_verified')) {
        $isVerified = session('id_verified') === $participant->id;
    }
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Examination Results Verification</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f5f7fb;
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            }
        }
        
        .scale-hover {
            transition: transform 0.2s;
        }
        
        .scale-hover:hover {
            transform: scale(1.02);
        }
        
        .print-only {
            display: none;
        }
        
        @media print {
            body {
                background-color: white !important;
            }
            
            .no-print {
                display: none !important;
            }
            
            .print-only {
                display: block;
            }
            
            .glass-card {
                box-shadow: none !important;
                border: 1px solid #e5e7eb !important;
            }
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
    <!-- Refresh Detection Script -->
    <script>
        // On page load, check if this is a refresh
        document.addEventListener('DOMContentLoaded', function() {
            // Check if this is a page refresh (not initial load)
            if (performance.navigation.type === 1) {
                // Get current URL
                let url = new URL(window.location.href);
                
                // Add the clear_session parameter
                url.searchParams.set('clear_session', '1');
                
                // Redirect to the same page with parameter
                window.location.href = url.toString();
            }
        });
    </script>

    <div class="max-w-3xl mx-auto px-4 py-8">
        <!-- Print Header (only visible when printing) -->
        <div class="print-only mb-4 text-center">
            <h1 class="text-2xl font-bold text-gray-900">Health Examination Results</h1>
            <p class="text-gray-600">Official Patient Verification Document</p>
        </div>
        
        <!-- Main Card -->
        <div class="glass-card shadow-xl rounded-2xl overflow-hidden transition-all duration-300">
            <!-- Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20"></div>
                <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
                
                <div class="flex justify-between items-center relative z-10">
                    <div>
                        <h1 class="text-2xl font-bold text-white">Health Examination Results</h1>
                        <p class="text-indigo-100 mt-1 flex items-center">
                            <i class="ri-shield-check-line mr-1"></i>
                            Patient Data Verification
                        </p>
                    </div>
                    <div class="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow text-sm font-bold flex items-center pulse-animation">
                        <i class="ri-fingerprint-line mr-2"></i>
                        {{ $participant->unique_code }}
                    </div>
                </div>
            </div>
            
            <!-- Verification Form -->
            @if (!$isVerified)
            <div class="p-5 sm:p-8">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <i class="ri-lock-line text-indigo-600 text-3xl"></i>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800">Identity Verification</h2>
                    <p class="text-gray-600 mt-2 max-w-md mx-auto">Enter your ID/Passport number to access and verify your health examination results</p>
                </div>
                
                <form action="{{ route('examinations.verify.identity', ['code' => $participant->unique_code]) }}" method="POST" class="max-w-md mx-auto">
                    @csrf
                    <div class="mb-6">
                        <label for="id_number" class="block text-sm font-medium text-gray-700 mb-2">ID/Passport Number</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="ri-id-card-line text-gray-400"></i>
                            </div>
                            <input 
                                type="text" 
                                id="id_number" 
                                name="id_number" 
                                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" 
                                placeholder="Enter your ID number"
                                required
                            >
                        </div>
                        @if (session('error'))
                            <div class="mt-2 flex items-center text-red-600">
                                <i class="ri-error-warning-line mr-1"></i>
                                <p class="text-sm">{{ session('error') }}</p>
                            </div>
                        @endif
                    </div>
                    
                    <div class="flex justify-center">
                        <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-200 flex items-center justify-center">
                            <i class="ri-shield-keyhole-line mr-2"></i>
                            Verify Identity
                        </button>
                    </div>
                    
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-500 flex items-center justify-center">
                            <i class="ri-lock-password-line text-gray-400 mr-2"></i>
                            Your data is secure and protected
                        </p>
                    </div>
                </form>
            </div>
            @else
            <!-- Success Banner -->
            <div class="bg-green-50 p-4 flex items-center no-print">
                <div class="flex-shrink-0">
                    <i class="ri-check-double-line text-green-600 text-xl"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">Identity successfully verified!</p>
                    <p class="text-xs text-green-700 mt-0.5">Your health examination results are displayed below</p>
                </div>
            </div>
            
            <!-- Patient Info -->
            <div class="p-5 sm:p-8 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-800 mb-5 flex items-center">
                    <i class="ri-user-3-line mr-2 text-indigo-600"></i>
                    Patient Information
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-user-3-line mr-2 text-indigo-500"></i>
                            Full Name
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ $participant->name }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-file-list-3-line mr-2 text-indigo-500"></i>
                            Reference ID
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ $screening->reference_id }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-calendar-line mr-2 text-indigo-500"></i>
                            Age
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ $participant->age }} years</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-user-settings-line mr-2 text-indigo-500"></i>
                            Gender
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ $participant->title === 'Mr' ? 'Male' : 'Female' }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-time-line mr-2 text-indigo-500"></i>
                            Examination Date
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ \Carbon\Carbon::parse($participant->examined_at)->format('d M Y H:i') }}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg scale-hover transition-all">
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-hospital-line mr-2 text-indigo-500"></i>
                            Medical Staff
                        </p>
                        <p class="font-semibold text-lg text-gray-800 mt-1">{{ $medicalStaff->username }}</p>
                    </div>
                </div>
            </div>
            
            <!-- Examination Results -->
            <div class="p-5 sm:p-8 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-800 mb-5 flex items-center">
                    <i class="ri-heart-pulse-line mr-2 text-indigo-600"></i>
                    Examination Results
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-heart-pulse-fill mr-2 text-red-500"></i>
                                Blood Pressure
                            </p>
                            <span class="bg-white text-xs text-red-600 font-medium px-2 py-1 rounded-full">Vital</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">{{ $participant->systolic_blood_pressure }}/{{ $participant->diastolic_blood_pressure }} <span class="text-sm font-normal text-gray-600">mmHg</span></p>
                        <p class="text-xs text-gray-500 mt-2">Systolic/Diastolic</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-heart-fill mr-2 text-indigo-500"></i>
                                Heart Rate
                            </p>
                            <span class="bg-white text-xs text-indigo-600 font-medium px-2 py-1 rounded-full">Vital</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">{{ $participant->heart_rate }} <span class="text-sm font-normal text-gray-600">bpm</span></p>
                        <p class="text-xs text-gray-500 mt-2">Beats Per Minute</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-temp-hot-line mr-2 text-amber-500"></i>
                                Body Temperature
                            </p>
                            <span class="bg-white text-xs text-amber-600 font-medium px-2 py-1 rounded-full">Vital</span>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">{{ $participant->temperature }} <span class="text-sm font-normal text-gray-600">°C</span></p>
                        <p class="text-xs text-gray-500 mt-2">Celsius</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-lungs-line mr-2 text-blue-500"></i>
                                Respiratory Rate
                            </p>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">{{ $participant->respiratory_rate }} <span class="text-sm font-normal text-gray-600">breaths/min</span></p>
                        <p class="text-xs text-gray-500 mt-2">Respiration Rate</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-bubble-chart-line mr-2 text-emerald-500"></i>
                                Oxygen Saturation
                            </p>
                        </div>
                        <p class="text-2xl font-bold text-gray-900">{{ $participant->oxygen_saturation }} <span class="text-sm font-normal text-gray-600">%</span></p>
                        <p class="text-xs text-gray-500 mt-2">SpO2</p>
                    </div>
                </div>
            </div>
            
            <!-- Medical History Information - NEW SECTION -->
            <div class="p-5 sm:p-8 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-800 mb-5 flex items-center">
                    <i class="ri-file-list-3-line mr-2 text-indigo-600"></i>
                    Medical History
                </h2>
                
                <div class="grid grid-cols-1 gap-4">
                    <!-- Allergies -->
                    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-alert-line mr-2 text-orange-500"></i>
                                Allergies
                            </p>
                            <span class="bg-white text-xs text-orange-600 font-medium px-2 py-1 rounded-full">Important</span>
                        </div>
                        <div class="bg-white bg-opacity-50 p-3 rounded-md">
                            <p class="text-gray-800">{{ $participant->allergies ?? 'No known allergies' }}</p>
                        </div>
                    </div>
                    
                    <!-- Past Medical History -->
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-history-line mr-2 text-purple-500"></i>
                                Past Medical History
                            </p>
                        </div>
                        <div class="bg-white bg-opacity-50 p-3 rounded-md">
                            <p class="text-gray-800">{{ $participant->past_medical_history ?? 'No significant past medical history' }}</p>
                        </div>
                    </div>
                    
                    <!-- Current Medications -->
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-medicine-bottle-line mr-2 text-blue-500"></i>
                                Current Medications
                            </p>
                        </div>
                        <div class="bg-white bg-opacity-50 p-3 rounded-md">
                            <p class="text-gray-800">{{ $participant->current_medications ?? 'No current medications' }}</p>
                        </div>
                    </div>
                    
                    <!-- Family Medical History -->
                    <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg shadow-sm scale-hover transition-all">
                        <div class="flex items-center mb-2">
                            <p class="text-sm text-gray-700 font-medium flex items-center">
                                <i class="ri-parent-line mr-2 text-teal-500"></i>
                                Family Medical History
                            </p>
                        </div>
                        <div class="bg-white bg-opacity-50 p-3 rounded-md">
                            <p class="text-gray-800">{{ $participant->family_medical_history ?? 'No significant family medical history' }}</p>
                        </div>
                    </div>
                </div>
            </div>
                        
            <!-- Verification Info -->
            <div class="p-5 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p class="text-sm text-gray-500 flex items-center">
                            <i class="ri-qr-code-line mr-2 text-indigo-500"></i>
                            Unique Code
                        </p>
                        <p class="font-semibold text-lg text-gray-900 mt-1">{{ $participant->unique_code }}</p>
                    </div>
                    
                    <div class="flex gap-2 items-center bg-white px-4 py-2 rounded-lg border border-gray-200">
                        <i class="ri-shield-check-fill text-green-500 text-xl"></i>
                        <div>
                            <p class="text-xs text-gray-500">Verified on</p>
                            <p class="font-medium text-sm">{{ now()->format('d M Y H:i:s') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            @endif
        </div>
        
        <div class="mt-8 text-center no-print">
            <p class="text-sm text-gray-500 flex items-center justify-center">
                <i class="ri-shield-check-line mr-2 text-indigo-500"></i>
                This document is an official digital copy of the health examination results and has been verified for authenticity.
            </p>
            
            <!-- Current Date -->
            <p class="text-xs text-gray-400 mt-3">
                {{ now()->format('d F Y') }}
            </p>
        </div>
    </div>
    
    <script>
        // Function to animate count up for numbers
        window.addEventListener('DOMContentLoaded', function() {
            if (document.querySelectorAll('.bg-green-50').length) {
                // If verified, animate vital signs
                const vitalElements = document.querySelectorAll('.text-2xl.font-bold');
                
                vitalElements.forEach(el => {
                    const finalValue = el.innerText.split(' ')[0]; // Get value without unit
                    animateValue(el, 0, parseInt(finalValue), 1500);
                });
            }
        });
        
        // Utility function to trigger saving as PDF
        function savePDF() {
            // In a real app, use a PDF library instead
            alert('In a real application, this would download a PDF of your examination results.');
            window.print(); // For demo, just trigger print dialog
        }
        
        // Animation function for vital signs
        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                
                // Keep the unit part (e.g., "mmHg", "bpm") if present
                const unitPart = obj.innerHTML.includes(' ') ? ' ' + obj.innerHTML.split(' ').slice(1).join(' ') : '';
                obj.innerHTML = value + unitPart;
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    </script>
</body>
</html>
import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import {
    MapPin,
    Calendar,
    Clock,
    User,
    Heart,
    Activity,
    TrendingUp,
    Home,
    Map,
    FileText,
    Settings,
    LogOut,
    Plus,
    ChevronRight,
    ArrowLeft,
    CloudSun,
    X,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Mail,
    Search,
    Upload,
    Download,
    Eye,
    Thermometer,
    Wind,
    Droplets,
    Footprints,
    Flashlight,
    Umbrella,
    Globe,
    Sunrise,
    Sunset,
    Play,
    CreditCard,
    Smartphone,
    FileImage,
    Maximize2
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import lang from "@/lang.json";

const App = () => {
    const [language, setLanguage] = useState("id");
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [selectedTime, setSelectedTime] = useState("morning");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const saveToLocalStorage = (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    };


    const loadFromLocalStorage = (key, defaultValue) => {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            
            // For screening IDs, clean any quotes
            if (key === "selectedScreeningId" || key === "currentPaymentScreeningId") {
                const parsed = JSON.parse(serializedValue);
                return parsed ? parsed.replace(/^["']|["']$/g, '') : parsed;
            }
            
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            return defaultValue;
        }
    };

    const [currentScreen, setCurrentScreen] = useState(() => {
        return loadFromLocalStorage("currentScreen", "home");
    });

    useEffect(() => {
        // Whenever currentScreen changes, save it to localStorage
        saveToLocalStorage("currentScreen", currentScreen);
    }, [currentScreen]);

    const [screeningData, setScreeningData] = useState(
        loadFromLocalStorage("screeningData", [])
    );
    const [selectedScreeningId, setSelectedScreeningId] = useState(
        loadFromLocalStorage("selectedScreeningId", null)
    );
    const [selectedLocation, setSelectedLocation] = useState(
        loadFromLocalStorage("selectedLocation", null)
    );
    const [selectedDate, setSelectedDate] = useState(
        loadFromLocalStorage(
            "selectedDate",
            new Date().toISOString().split("T")[0]
        )
    );
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(
        loadFromLocalStorage("selectedTimeSlot", null)
    );
    const [screeningTotal, setScreeningTotal] = useState(
        loadFromLocalStorage("screeningTotal", 0)
    );

    const [dateOptions, setDateOptions] = useState<
        { date: string; day: string; dayNum: string }[]
    >([]);
    useEffect(() => {
        const opts = [];
        for (let i = 0; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const weekday = d.toLocaleDateString(
                language === "id" ? "id-ID" : "en-US",
                { weekday: "short" }
            );
            opts.push({
                date: `${yyyy}-${mm}-${dd}`,
                day: weekday,
                dayNum: dd,
            });
        }
        setDateOptions(opts);
    }, [language]);

    const [participants, setParticipants] = useState(
        loadFromLocalStorage("participants", [
            {
                title: "Mr",
                name: "",
                age: "",
                nationality: "",
                idNumber: "",
                hasMedicalHistory: false,
                allergies: "",
                pastMedicalHistory: "",
                currentMedications: "",
                familyMedicalHistory: "",
            },
        ])
    );

    const addParticipant = () => {
        const newParticipants = [
            ...participants,
            {
                title: "Mr",
                name: "",
                age: "",
                nationality: "",
                idNumber: "",
                hasMedicalHistory: false,
                allergies: "",
                pastMedicalHistory: "",
                currentMedications: "",
                familyMedicalHistory: "",
            },
        ];
        setParticipantsWithStorage(newParticipants);
    };

    const removeParticipant = (index) => {
        if (participants.length > 1) {
            const newParticipants = participants.filter((_, i) => i !== index);
            setParticipantsWithStorage(newParticipants);
        }
    };

    const handleParticipantChange = (index, field, value) => {
        const newParticipants = [...participants];
        newParticipants[index] = {
            ...newParticipants[index],
            [field]: value,
        };
        setParticipantsWithStorage(newParticipants);
    };

    const setParticipantsWithStorage = (newParticipants) => {
        setParticipants(newParticipants);
        saveToLocalStorage("participants", newParticipants);
    };

    const setScreeningDataWithStorage = (newScreeningData) => {
        setScreeningData(newScreeningData);
        saveToLocalStorage("screeningData", newScreeningData);
    };

    const setSelectedScreeningIdWithStorage = (newId) => {
        // Clean any quotes from the ID before storing
        const cleanedId = newId ? newId.replace(/^["']|["']$/g, '') : newId;
        
        // Update the state
        setSelectedScreeningId(cleanedId);
        
        // Store in localStorage
        saveToLocalStorage("selectedScreeningId", cleanedId);
    };

    const setSelectedLocationWithStorage = (newLocation) => {
        setSelectedLocation(newLocation);
        saveToLocalStorage("selectedLocation", newLocation);
    };

    const setSelectedDateWithStorage = (newDate) => {
        setSelectedDate(newDate);
        saveToLocalStorage("selectedDate", newDate);
    };

    const setSelectedTimeSlotWithStorage = (newTimeSlot) => {
        setSelectedTimeSlot(newTimeSlot);
        saveToLocalStorage("selectedTimeSlot", newTimeSlot);
    };

    const setScreeningTotalWithStorage = (newTotal) => {
        setScreeningTotal(newTotal);
        saveToLocalStorage("screeningTotal", newTotal);
    };

    const resetFormInputs = () => {
        setParticipantsWithStorage([
            {
                title: "Mr",
                name: "",
                age: "",
                nationality: "",
                idNumber: "",
                hasMedicalHistory: false,
                allergies: "",
                pastMedicalHistory: "",
                currentMedications: "",
                familyMedicalHistory: "",
            },
        ]);
        setSelectedLocationWithStorage(null);
        setSelectedDateWithStorage(
            dateOptions[0]?.date ?? new Date().toISOString().split("T")[0]
        );
        setSelectedTimeSlotWithStorage(null);
        setSelectedPaymentMethod("");
    };

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showInfographicPopup, setShowInfographicPopup] = useState(false);
    const [showingRegistrationVideo, setShowingRegistrationVideo] = useState(false);
    const [selectedLocationFromMap, setSelectedLocationFromMap] =
        useState(null);
    const [showVideoPopup, setShowVideoPopup] = useState(false);
    const [showInfographicImagePopup, setShowInfographicImagePopup] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);

    const t = lang[language];

    const defaultIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Komponen untuk zoom ke lokasi
    function FlyToMarker({ coords }) {
        const map = useMap();
        if (coords) {
            map.flyTo([coords[0] - 0.008, coords[1]], 14);
        }
        return null;
    }

    const renderBottomNav = () => (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3 border-t">
            <button
                onClick={() => setCurrentScreen("home")}
                className={`flex flex-col items-center font-medium ${
                    currentScreen === "home"
                    // currentScreen === "form1" ||
                    // currentScreen === "form2" ||
                    // currentScreen === "form3" ||
                    // currentScreen === "form4" ||
                    // currentScreen === "form5"
                        ? "text-green-500"
                        : "text-gray-800"
                }`}
            >
                <Home size={20} />
                <span className="text-xs mt-1">{t.navHome}</span>
            </button>
            <button
                onClick={() => setCurrentScreen("screening")}
                className={`flex flex-col items-center font-medium ${
                    currentScreen === "screening"
                        ? "text-green-500"
                        : "text-gray-800"
                }`}
            >
                <Heart size={20} />
                <span className="text-xs mt-1">{t.navScreening}</span>
            </button>
            <button
                onClick={() => setCurrentScreen("info")}
                className={`flex flex-col items-center font-medium ${
                    currentScreen === "info" ? "text-green-500" : "text-gray-800"
                }`}
            >
                <Map size={20} />
                <span className="text-xs mt-1">{t.navInfo}</span>
            </button>
            <button
                onClick={() => setCurrentScreen("profile")}
                className={`flex flex-col items-center font-medium ${
                    currentScreen === "profile"
                        ? "text-green-500"
                        : "text-gray-800"
                }`}
            >
                <User size={20} />
                <span className="text-xs mt-1">{t.navProfile}</span>
            </button>
        </div>
    );

    // Updated submitScreeningData function with clear redirect tracking
    const submitScreeningData = async (e) => {
        // Prevent default form submission behavior if event is provided
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        // Set loading state to true at the beginning of the process
        setIsProcessingPayment(true);

        const SCREENING_FEE = 35000; // 35.000 rupiah per pax
        const SERVICE_FEE = 0; // 5.000 rupiah service fee

        // Calculate total based on participants and service fee
        const total = SCREENING_FEE * participants.length + SERVICE_FEE;

        // Create a pending screening with all details
        const newScreening = {
            id: `IJN${Date.now()}`,
            participants: [...participants],
            location: selectedLocation
                ? selectedLocation.name
                : "Baratha Hotel",
            date: `${selectedDate}`,
            time: selectedTimeSlot
                ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`
                : "04:30 AM",
            paymentMethod: selectedPaymentMethod,
            status: "pending",
            total: total,
            // Payment fields will be added after API call
        };

        // Prepare the API call parameters
        const getCustomerName = () => {
            // Get the name of the first participant or fallback to a default
            return participants[0]?.name || "Guest User";
        };

        // Set up the parameters for the payment API call
        const paymentParams = new URLSearchParams({
            payment_method: selectedPaymentMethod || "mandiri", // Use selected payment method or default to mandiri
            external_id: newScreening.id, // Use the screening ID as external_id
            description: `Health Screening Payment for ${participants.length} participant(s)`,
            amount: total.toString(),
            customer: getCustomerName(),
            quantity: participants.length.toString(),
            price: SCREENING_FEE.toString(), // Price per screening
        });

        try {
            // Make the API call to generate payment
            const response = await fetch(
                `/generate-payment?${paymentParams.toString()}`
            );

            if (!response.ok) {
                throw new Error("Payment generation failed");
            }

            const paymentData = await response.json();

            // Clean the URL of any quotes
            const cleanUrl = paymentData.invoice_url?.replace(/^["']|["']$/g, '') || null;
            
            // Add payment data to the screening record
            newScreening.paymentId = paymentData.id;
            newScreening.paymentUrl = cleanUrl;
            newScreening.paymentData = paymentData;
            
            // Now update state with localStorage including payment info
            const updatedScreeningData = [...screeningData, newScreening];
            setScreeningDataWithStorage(updatedScreeningData);
            setSelectedScreeningIdWithStorage(newScreening.id);
            setScreeningTotalWithStorage(total);
            
            // Also save separately for easy access in localStorage (permanent)
            saveToLocalStorage("pendingPaymentId", paymentData.id);
            saveToLocalStorage("currentPaymentScreeningId", newScreening.id);
            
            // Clear any previous redirect flags
            try {
                sessionStorage.removeItem("hasRedirectedToPayment");
                
                // Save payment URL in sessionStorage (temporary - will be cleared after browser close/redirect)
                sessionStorage.setItem("pendingPaymentUrl", cleanUrl);
            } catch (err) {
                console.error("Error managing sessionStorage:", err);
            }
            
            // Change to success screen instead of directly redirecting
            setCurrentScreen("success");
            
            // Reset processing state
            setIsProcessingPayment(false);
        } catch (error) {
            console.error("Error generating payment:", error);
            
            // Even in case of error, save the screening data without payment info
            const updatedScreeningData = [...screeningData, newScreening];
            setScreeningDataWithStorage(updatedScreeningData);
            setSelectedScreeningIdWithStorage(newScreening.id);
            setScreeningTotalWithStorage(total);
            
            // Reset and redirect
            sessionStorage.removeItem("pendingPaymentUrl");
            sessionStorage.removeItem("hasRedirectedToPayment");
            setIsProcessingPayment(false);
            setCurrentScreen("success");
        }
    };
    
    // SuccessScreen component with improved redirect handling
    const SuccessScreen = () => {
        // Reference to navigate function for redirecting
        const [hasRedirected, setHasRedirected] = useState(() => {
            try {
                return sessionStorage.getItem("hasRedirectedToPayment") === "true";
            } catch (e) {
                return false;
            }
        });
        
        // Get payment URL from sessionStorage
        const [pendingPaymentUrl, setPendingPaymentUrl] = useState(() => {
            try {
                return sessionStorage.getItem("pendingPaymentUrl");
            } catch (e) {
                console.error("Error reading from sessionStorage:", e);
                return null;
            }
        });
        
        // Get the current screening ID for details page
        const [screeningId, setScreeningId] = useState(() => {
            try {
                // Get ID from localStorage and clean any quotes
                const id = localStorage.getItem("currentPaymentScreeningId") || 
                        localStorage.getItem("selectedScreeningId");
                return id ? id.replace(/^["']|["']$/g, '') : null;
            } catch (e) {
                console.error("Error getting screening ID:", e);
                return null;
            }
        });
        
        // Timer state for countdown display
        const [countdown, setCountdown] = useState(2);
        
        // Countdown effect
        useEffect(() => {
            const countdownInterval = setInterval(() => {
                setCountdown(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);
            
            return () => clearInterval(countdownInterval);
        }, []);
        
        // Redirect effect
        useEffect(() => {
            const redirectTimer = setTimeout(() => {
                // If we've already redirected to payment once, go to details
                if (hasRedirected) {
                    // Clear session storage to reset the flow for future
                    try {
                        sessionStorage.removeItem("pendingPaymentUrl");
                        sessionStorage.removeItem("hasRedirectedToPayment");
                    } catch (e) {
                        console.error("Error clearing sessionStorage:", e);
                    }
                    
                    // Navigate to details page
                    if (screeningId) {
                        // Set the cleaned ID to prevent quote issues
                        setSelectedScreeningIdWithStorage(screeningId);
                        setCurrentScreen("details");
                    } else {
                        // Fallback if no screening ID
                        setCurrentScreen("screening");
                    }
                } 
                // First time seeing success page with payment URL
                else if (pendingPaymentUrl) {
                    try {
                        // Mark that we've redirected to payment
                        sessionStorage.setItem("hasRedirectedToPayment", "true");
                    } catch (e) {
                        console.error("Error setting sessionStorage:", e);
                    }
                    
                    // Redirect to payment URL
                    if (pendingPaymentUrl.startsWith('http://') || pendingPaymentUrl.startsWith('https://')) {
                        window.location.href = pendingPaymentUrl;
                    } else {
                        console.error("Invalid redirect URL format:", pendingPaymentUrl);
                        setCurrentScreen("details");
                    }
                } 
                // No payment URL at all
                else {
                    // Navigate to details page as fallback
                    if (screeningId) {
                        // Set the cleaned ID to prevent quote issues
                        setSelectedScreeningIdWithStorage(screeningId);
                        setCurrentScreen("details");
                    } else {
                        setCurrentScreen("screening");
                    }
                }
            }, 2000);
            
            // Clean up the timer
            return () => clearTimeout(redirectTimer);
        }, [hasRedirected, pendingPaymentUrl, screeningId]);

        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle size={32} className="text-green-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                    Submission Successful!
                </h2>
                
                <p className="text-gray-600 mb-6 text-center">
                    Your screening has been scheduled successfully.
                </p>
                
                <div className="w-full max-w-sm bg-green-50 rounded-lg p-4 mb-6 text-center">
                    <p className="text-green-700">
                        {hasRedirected
                            ? `Redirecting to details page in ${countdown} seconds...`
                            : `Redirecting to payment page in ${countdown} seconds...`}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${(countdown / 2) * 100}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV !== 'production' && (
                    <div className="text-xs text-gray-400 mt-4">
                        <p>Has redirected: {hasRedirected ? 'Yes' : 'No'}</p>
                        <p>Screening ID: {screeningId || 'None'}</p>
                    </div>
                )}
            </div>
        );
    };

    const OnboardingScreen = () => {

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
                <div className="mb-8 text-center">
                    <img src="/assets/img/logo-blue.png" className="mx-auto w-64" alt="" srcSet="" />
                    <h1 className="text-3xl font-bold text-white">
                        {t.appName}
                    </h1>
                    <p className="opacity-80 mt-2 text-white">{t.appTagline}</p>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                        className="w-3 h-3 rounded-full bg-white opacity-75 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    ></div>
                </div>
            </div>
        );
    };

    const LoginPopup = () => {
        const afterLogin = () => {
            setIsLoggedIn(true);
            setShowLoginPopup(false);
            submitScreeningData();
        };
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                <div className="bg-white rounded-t-xl w-full max-w-md animate-slide-up">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {t.loginToContinue}
                            </h2>
                            <button
                                onClick={() => setShowLoginPopup(false)}
                                className="text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <button
                                onClick={() => {
                                    afterLogin();
                                }}
                                className="w-full bg-green-500 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium"
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <span className="flex items-center justify-center">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                        {t.processing}
                                    </span>
                                ) : (
                                    <>
                                        <img
                                            src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png"
                                            alt="Google logo"
                                            className="w-5 h-5 rounded-full bg-white"
                                        />
                                        <span>{t.loginWithGoogle}</span>
                                    </>
                                )}
                            </button>

                            {/* Tambahkan tombol Apple */}
                            <button
                                onClick={() => {
                                    afterLogin();
                                }}
                                className="w-full bg-black text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium"
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <span className="flex items-center justify-center">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                        {t.processing}
                                    </span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="white" className="mr-2">
                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                        </svg>
                                        <span>{t.loginWithApple}</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    afterLogin();
                                }}
                                className="w-full border border-gray-300 bg-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-gray-700 font-medium"
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <span className="flex items-center justify-center">
                                        <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                                        {t.processing}
                                    </span>
                                ) : (
                                    <>
                                        <Mail
                                            size={18}
                                            className="text-gray-500"
                                        />
                                        <span>{t.loginWithEmail}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center text-gray-500 text-sm">
                            <p>{t.continueAgreement}</p>
                            <div className="flex justify-center space-x-1">
                                <button className="text-green-500">
                                    {t.terms}
                                </button>
                                <span>&</span>
                                <button className="text-green-500">
                                    {t.privacy}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const InfographicPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h3 className="font-bold text-lg">
                        {t.registrationGuide}
                    </h3>
                    <button
                        onClick={() => setShowInfographicPopup(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.howToRegister}</h2>
                            <p className="text-gray-600">
                                {language === "en" 
                                    ? "Follow these simple steps to complete your health screening registration" 
                                    : language === "id" 
                                        ? "Ikuti langkah-langkah sederhana ini untuk menyelesaikan pendaftaran pemeriksaan kesehatan Anda"
                                        : "按照以下简单步骤完成健康检查注册"}
                            </p>
                        </div>
                        
                        {/* Steps in infographic style */}
                        <div className="space-y-10">
                            {/* Step 1 */}
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl">1</div>
                                    <div className="w-1 h-20 bg-green-500 mx-auto mt-2 rounded-full"></div>
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.step1Title}</h3>
                                    <p className="text-gray-600 mb-3">{t.step1Desc}</p>
                                    <div className="bg-gray-100 rounded-lg p-4">
                                        <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                            <li>{language === "en" ? "Personal information" : language === "id" ? "Informasi pribadi" : "个人信息"}</li>
                                            <li>{language === "en" ? "Contact details" : language === "id" ? "Detail kontak" : "联系方式"}</li>
                                            <li>{language === "en" ? "Medical history" : language === "id" ? "Riwayat medis" : "医疗历史"}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Step 2 */}
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl">2</div>
                                    <div className="w-1 h-20 bg-green-500 mx-auto mt-2 rounded-full"></div>
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.step2Title}</h3>
                                    <p className="text-gray-600 mb-3">{t.step2Desc}</p>
                                    <div className="bg-gray-100 rounded-lg p-4">
                                        <div className="flex flex-wrap justify-between">
                                            <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2 mr-2">
                                                <MapPin size={16} className="text-green-500 inline mr-1" />
                                                <span className="text-sm">{language === "en" ? "Location" : language === "id" ? "Lokasi" : "地点"}</span>
                                            </div>
                                            <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2 mr-2">
                                                <Calendar size={16} className="text-green-500 inline mr-1" />
                                                <span className="text-sm">{language === "en" ? "Date" : language === "id" ? "Tanggal" : "日期"}</span>
                                            </div>
                                            <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2">
                                                <Clock size={16} className="text-green-500 inline mr-1" />
                                                <span className="text-sm">{language === "en" ? "Time" : language === "id" ? "Waktu" : "时间"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Step 3 */}
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl">3</div>
                                    <div className="w-1 h-20 bg-green-500 mx-auto mt-2 rounded-full"></div>
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.step3Title}</h3>
                                    <p className="text-gray-600 mb-3">{t.step3Desc}</p>
                                    <div className="bg-gray-100 rounded-lg p-4 flex justify-around flex-wrap">
                                        <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2 mx-1">
                                            <DollarSign size={16} className="text-green-500 inline mr-1" />
                                            <span className="text-sm">{language === "en" ? "Bank Transfer" : language === "id" ? "Transfer Bank" : "银行转账"}</span>
                                        </div>
                                        <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2 mx-1">
                                            <CreditCard size={16} className="text-green-500 inline mr-1" />
                                            <span className="text-sm">{language === "en" ? "Credit Card" : language === "id" ? "Kartu Kredit" : "信用卡"}</span>
                                        </div>
                                        <div className="px-3 py-2 bg-white rounded-lg shadow-sm mb-2 mx-1">
                                            <Smartphone size={16} className="text-green-500 inline mr-1" />
                                            <span className="text-sm">E-Wallet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Step 4 */}
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl">4</div>
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.step4Title}</h3>
                                    <p className="text-gray-600 mb-3">{t.step4Desc}</p>
                                    <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                                        <div className="flex">
                                            <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                                            <p className="text-green-800">
                                                {language === "en" 
                                                    ? "Your e-ticket will be available for download and can be shown at the screening location for quick check-in." 
                                                    : language === "id" 
                                                        ? "E-tiket Anda akan tersedia untuk diunduh dan dapat ditunjukkan di lokasi pemeriksaan untuk check-in cepat."
                                                        : "您的电子票可供下载，并可在检查地点出示以快速办理登记手续。"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Call to action button */}
                        <div className="text-center mt-10">
                            <button
                                onClick={() => {
                                    setShowInfographicPopup(false);
                                    setCurrentScreen("form1");
                                }}
                                className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                            >
                                {language === "en" ? "Start Registration" : language === "id" ? "Mulai Pendaftaran" : "开始注册"}
                                <ChevronRight size={20} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    const partialInfo = () => (
        <>
        {/* Dynamic Weather Forecast Card - Main Section */}
        <h2 className="font-bold text-lg text-gray-800 mt-6 mb-3">
            {t.weatherConditions}
        </h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
            <div className="p-5">
                {/* Date selector */}
                <div className="flex overflow-x-auto hide-scrollbar mb-6">
                    {Array(7).fill().map((_, index) => {
                        // Generate dates dynamically starting from today
                        const date = new Date();
                        date.setDate(date.getDate() + index);
                        const dayNum = date.getDate();
                        const isToday = index === 0;
                        
                        // Get day name based on the actual date
                        const dayName = date.toLocaleDateString(
                            language === "id" ? "id-ID" : language === "zh" ? "zh-CN" : "en-US", 
                            { weekday: "short" }
                        );

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center mr-8"
                            >
                                <span className="text-sm text-gray-500 mb-1">
                                    {dayName}
                                </span>
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                                        isToday
                                            ? "bg-green-900 text-white"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {dayNum}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Current temperature and conditions */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="text-7xl font-normal text-green-900 mb-1">
                            13°
                        </div>
                        <div className="text-xl text-gray-700 mb-1">
                            {t.showers}
                        </div>
                        <div className="text-lg text-gray-500">
                            {t.highLowTemp}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center mb-2">
                            <Droplets
                                size={18}
                                className="text-gray-500 mr-1"
                            />
                            <span className="text-lg text-gray-700">
                                {t.precipitationPercent}
                            </span>
                        </div>
                        <div className="flex items-center text-lg text-gray-500 mb-2">
                            <Sunrise size={18} className="mr-1" />
                            <span>{t.sunriseTime}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-500">
                            <Sunset size={18} className="mr-1" />
                            <span>{t.sunsetTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Horizontal scrollable cards section */}
        <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 mb-6">
            {/* Weather along trail card */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[85%] flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg text-gray-700">
                        {t.weatherAlongTrail}
                    </h4>
                    <select className="text-xs text-gray-700 bg-gray-100 rounded-full pr-6 py-1 border-none">
                        <option>11:00 PM</option>
                        <option>12:00 AM</option>
                        <option>1:00 AM</option>
                    </select>
                </div>

                <div className="relative h-24 mb-2">
                    {/* The trail graph */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="h-1 bg-green-700 w-full rounded-full"></div>
                    </div>
                    {/* Temperature point */}
                    <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-white rounded-full border-2 border-green-700 relative">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xl text-green-900 font-medium">
                                11°
                            </div>
                        </div>
                    </div>
                    {/* Path markers */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-500">
                        <span>0 km</span>
                        <span>4.7 km</span>
                        <span>9.4 km</span>
                    </div>
                </div>
            </div>

            {/* Ground conditions card */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 min-w-[70%] flex-shrink-0">
                <div className="flex items-start">
                    <div className="flex-1">
                        <h4 className="text-lg text-gray-700 mb-3">
                            Ground
                        </h4>
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mr-3">
                                <Droplets
                                    size={28}
                                    className="text-white"
                                />
                            </div>
                            <div>
                                <div className="text-green-900 text-2xl font-medium">
                                    {t.wetCondition}
                                </div>
                                <div className="text-gray-600">
                                    {t.weatherDataDescription}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-sm text-gray-500 mb-10 text-center">
            {t.weatherDataDisclaimer}
        </div>

        {/* Title for Horizontal Scrollable Information Cards */}
        <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
            {language === "en" 
                ? "Visitor Information" 
                : language === "id" 
                    ? "Informasi Pengunjung" 
                    : "游客信息"}
        </h2>

        <div className="flex overflow-x-auto hide-scrollbar space-x-4 mb-6">
            <div className="min-w-[85%]">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 relative">
                    <div className="h-48 bg-green-100 relative">
                        <img
                            src="https://tracedetrail.fr/traces/maps/MapTrace269148_3463.jpg"
                            alt="Map"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3">
                            <button className="bg-white rounded-full p-2 shadow-md">
                                <MapPin
                                    size={20}
                                    className="text-green-500"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-800">
                                {t.exploreRoutes}
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            {t.routeDescription}
                        </p>
                        <button
                            className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                            onClick={() => {
                                setShowingRegistrationVideo(false);
                                setShowVideoPopup(true);
                            }}
                        >
                            <Map size={18} className="mr-2" />
                            {t.viewFullMap}
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-w-[85%]">                            
                {/* Video Animation Guide */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                    <div className="relative h-48">
                        <img 
                            src="https://img.freepik.com/free-vector/online-app-tourism-traveler-with-mobile-phone-map-building_74855-10966.jpg" 
                            alt="Registration Guide"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <button 
                                onClick={() => {
                                    setShowingRegistrationVideo(true);
                                    setShowVideoPopup(true)
                                }} 
                                className="bg-white bg-opacity-90 text-green-600 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition"
                            >
                                <Play size={30} />
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2">{t.howToRegister}</h3>
                        <p className="text-xs text-gray-600 mb-3">
                            {language === "en" 
                                ? "Learn how to complete your health screening registration with our simple guide." 
                                : language === "id" 
                                    ? "Pelajari cara menyelesaikan pendaftaran pemeriksaan kesehatan Anda dengan panduan sederhana kami."
                                    : "通过我们简单的指南，了解如何完成健康检查注册。"}
                        </p>
                        <button 
                            onClick={() => {
                                setShowingRegistrationVideo(true);
                                setShowVideoPopup(true);
                            }}
                            className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                        >
                            <Play size={16} className="mr-2" />
                            {t.watchVideo}
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-w-[85%]">
                {/* Infographic Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                    <div className="relative h-48">
                        <img 
                            src="/assets/img/infografik1.png" 
                            alt="Kawah Ijen Infographic"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                            <div className="bg-white bg-opacity-90 text-green-600 rounded-full p-2 shadow-md">
                                <FileImage size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2">
                            {language === "en" 
                                ? "Registration Process" 
                                : language === "id" 
                                    ? "Proses Pendaftaran" 
                                    : "注册流程"}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            {language === "en" 
                                ? "Complete guide from registration to entering Kawah Ijen gate." 
                                : language === "id" 
                                    ? "Panduan lengkap dari pendaftaran hingga memasuki gerbang Kawah Ijen."
                                    : "从注册到进入伊真火山口大门的完整指南。"}
                        </p>
                        <button 
                            onClick={() => setShowInfographicImagePopup(true)}
                            className="w-full flex justify-center items-center py-2.5 text-white text-sm font-medium bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                        >
                            <Maximize2 size={16} className="mr-2" />
                            {language === "en" 
                                ? "View Registration Process" 
                                : language === "id" 
                                    ? "Lihat Proses Pendaftaran" 
                                    : "查看注册流程"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Preparation Checklist - Horizontal Scrollable Cards */}
        <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
            {t.prepare}
        </h2>

        <div className="mb-6 px-5 -mx-5">
            <div className="flex overflow-x-auto pb-4 px-5 hide-scrollbar snap-x">
                {/* Card 1 - Warm Clothing */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                        <Thermometer size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.warmClothing}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.warmClothingDesc}
                    </p>
                </div>

                {/* Card 2 - Gas Mask */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mb-3">
                        <Wind size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.gasMask}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.gasMaskDesc}
                    </p>
                </div>

                {/* Card 3 - Water & Snacks */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                        <Droplets size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.waterSnacks}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.waterSnacksDesc}
                    </p>
                </div>

                {/* Card 4 - Proper Footwear */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-3">
                        <Footprints size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.properFootwear}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.footwearDesc}
                    </p>
                </div>

                {/* Card 5 - Headlamp */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-3 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 mb-3">
                        <Flashlight size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.headlamp}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.headlampDesc}
                    </p>
                </div>

                {/* Card 6 - Rain Gear */}
                <div className="bg-white rounded-xl shadow-sm p-4 mr-5 w-[220px] border border-gray-100 flex-shrink-0 snap-start">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-3">
                        <Umbrella size={22} />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                        {t.rainGear}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {t.rainGearDesc}
                    </p>
                </div>
            </div>
        </div>
    </>
    )
    const HomeScreen = () => {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header with gradient and weather card */}
                <div className="bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                <Home size={20} className="text-white" />
                            </div>
                            <span className="text-green-500 font-medium">{t.kawahIjenTitle}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Language selector */}
                            <select 
                                className="bg-gray-100 rounded-md py-1 text-sm text-gray-700 border-none"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">EN</option>
                                <option value="id">ID</option>
                                <option value="zh">ZH</option>
                            </select>
                            <div className="bg-gray-100 rounded-full p-2">
                                <User size={20} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        {t.kawahIjenVerification}
                    </h1>
    
                    {/* Health screening card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="font-bold text-xl text-gray-800 mb-2">
                            {t.bookHealthCheck}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t.healthCheckDescription}
                        </p>
    
                        <button
                            onClick={() => setCurrentScreen("form1")}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            {t.bookHealthCheckBtn}
                        </button>
                    </div>
                </div>                
                {/* Main content area with cards */}
                <div className="px-5">
    
                    {/* Recent submissions carousel */}
                    <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                        {t.recentSubmissions}
                        {screeningData.filter(
                            (item) => item.status === "pending"
                        ).length > 0 && (
                            <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-0.5 rounded-full ml-2">
                                {
                                    screeningData.filter(
                                        (item) => item.status === "pending"
                                    ).length
                                }{" "}
                                {t.pending}
                            </span>
                        )}
                    </h2>
    
                    <div className="relative">
                        {screeningData.length > 0 ? (
                            <div className="flex overflow-x-auto pb-4 -mx-2 snap-x hide-scrollbar">
                                {screeningData.map((screening, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-sm p-4 mb-2 border border-gray-100 min-w-[85%] mx-2 snap-center"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">
                                                        {screening
                                                            .participants[0]
                                                            .name || "Unnamed"}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {screening.date} •{" "}
                                                        {
                                                            screening
                                                                .participants
                                                                .length
                                                        }{" "}
                                                        participants
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className={`px-2 py-1 rounded-full ${
                                                    screening.status ===
                                                    "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                } text-xs font-medium flex items-center`}
                                            >
                                                {screening.status ===
                                                "pending" ? (
                                                    <>
                                                        <Clock
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        {t.pending}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        {t.complete}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-2">
                                            <div>
                                                <p className="flex items-center">
                                                    <Calendar
                                                        size={14}
                                                        className="mr-1"
                                                    />{" "}
                                                    {screening.date}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="flex items-center">
                                                    <Clock
                                                        size={14}
                                                        className="mr-1"
                                                    />{" "}
                                                    {screening.time}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full flex justify-center items-center py-2 text-green-500 text-sm font-medium mt-2 hover:bg-green-50 rounded-lg transition-colors"
                                            onClick={() => {
                                                setSelectedScreeningId(
                                                    screening.id
                                                );
                                                setCurrentScreen("details");
                                            }}
                                        >
                                            {t.viewDetails}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <FileText
                                        size={24}
                                        className="text-green-500"
                                    />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {language === "en"
                                        ? "No screenings yet"
                                        : language === "id"
                                        ? "Belum ada pemeriksaan"
                                        : "尚无筛查记录"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {language === "en"
                                        ? "Complete a health screening to see it here"
                                        : language === "id"
                                        ? "Selesaikan pemeriksaan kesehatan untuk melihatnya di sini"
                                        : "完成健康筛查以在此处查看"}
                                </p>
                                <button
                                    onClick={() => setCurrentScreen("form1")}
                                    className="text-green-500 text-sm font-medium"
                                >
                                    {t.startHealthCheck} →
                                </button>
                            </div>
                        )}
                    </div>
                    {partialInfo()}
                </div>
    
                {/* Add a subtle flare on the bottom nav */}
                {renderBottomNav()}
    
                {/* Add floating action button */}
                <button
                    onClick={() => setCurrentScreen("form1")}
                    className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg text-white transform hover:scale-105 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>
        );
    };
    const InfoScreen = () => {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                        {t.navInfo}
                    </h1>
                </div>

                <div className="px-5">
                    {partialInfo()}
                </div>
                {renderBottomNav()}
            </div>
        );
    };
    const ScreeningScreen = () => {
        // Modifikasi untuk menampilkan data terbaru terlebih dahulu
        const getSortedScreeningData = (status) => {
            return screeningData
                .filter(item => item.status === status)
                .sort((a, b) => {
                    // Urutkan berdasarkan ID secara descending (ID terbaru di atas)
                    // Asumsi bahwa ID mengandung timestamp, seperti IJN1745976859708
                    return b.id.localeCompare(a.id);
                });
        };
    
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center justify-between shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                        {t.healthScreening}
                    </h1>
                </div>
    
                <div className="p-4 flex space-x-2 mb-2">
                    <button
                        className={`flex-1 py-2 px-4 rounded-full ${
                            activeTab === "pending"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } font-medium`}
                        onClick={() => setActiveTab("pending")}
                    >
                        {t.pending}
                        {screeningData.filter(item => item.status === "pending").length > 0 && (
                            <span className="ml-2 bg-white text-green-500 text-xs rounded-full px-2 py-0.5">
                                {screeningData.filter(item => item.status === "pending").length}
                            </span>
                        )}
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-full ${
                            activeTab === "complete"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } font-medium`}
                        onClick={() => setActiveTab("complete")}
                    >
                        {t.complete}
                        {screeningData.filter(item => item.status === "complete").length > 0 && (
                            <span className="ml-2 bg-white text-green-500 text-xs rounded-full px-2 py-0.5">
                                {screeningData.filter(item => item.status === "complete").length}
                            </span>
                        )}
                    </button>
                </div>
    
                <div className="px-4 py-2">
                    {getSortedScreeningData(activeTab).length > 0 ? (
                        getSortedScreeningData(activeTab).map((screening, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
                                onClick={() => {
                                    setSelectedScreeningId(screening.id);
                                    setCurrentScreen("details");
                                }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">
                                                {screening.participants[0]
                                                    .name || "Unnamed"}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {screening.date} •{" "}
                                                {screening.participants.length}{" "}
                                                {screening.participants.length > 1 ? t.participants : t.participants.slice(0, -1)}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-full ${
                                            activeTab === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        } text-xs font-medium flex items-center`}
                                    >
                                        {activeTab === "pending" ? (
                                            <>
                                                <Clock size={12} className="mr-1" />
                                                {t.pending}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={12} className="mr-1" />
                                                {t.complete}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 mt-2">
                                    <div>
                                        <p className="flex items-center">
                                            <Calendar
                                                size={14}
                                                className="mr-1"
                                            />{" "}
                                            {screening.date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="flex items-center">
                                            <Clock size={14} className="mr-1" />{" "}
                                            {screening.time}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="w-full flex justify-center items-center py-2 mt-2 text-green-500 text-sm font-medium hover:bg-green-50 rounded-lg transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Mencegah bubble ke div parent
                                        setSelectedScreeningId(screening.id);
                                        setCurrentScreen("details");
                                    }}
                                >
                                    {t.viewDetails}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                {activeTab === "pending" ? (
                                    <Clock size={24} className="text-gray-400" />
                                ) : (
                                    <CheckCircle
                                        size={24}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1">
                                {language === "en"
                                    ? `No ${activeTab} screenings`
                                    : language === "id"
                                    ? `Tidak ada pemeriksaan ${
                                          activeTab === "pending"
                                              ? "tertunda"
                                              : "selesai"
                                      }`
                                    : `没有${
                                          activeTab === "pending"
                                              ? "待处理"
                                              : "已完成"
                                      }的筛查`}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {language === "en"
                                    ? "Schedule a health screening to see it here"
                                    : language === "id"
                                    ? "Jadwalkan pemeriksaan kesehatan untuk melihatnya di sini"
                                    : "安排健康筛查以在此处查看"}
                            </p>
                            <button
                                onClick={() => setCurrentScreen("form1")}
                                className="text-green-500 text-sm font-medium"
                            >
                                {t.startHealthCheck} →
                            </button>
                        </div>
                    )}
                </div>
    
                <button
                    className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg text-white"
                    onClick={() => setCurrentScreen("form1")}
                >
                    <Plus size={24} />
                </button>
    
                {renderBottomNav()}
            </div>
        );
    };
    const ProfileScreen = () => {
        const [showPartnerForm, setShowPartnerForm] = useState(false);

        // Default user data for when not logged in
        const defaultUserData = {
            name: t.appName,
            email: "",
            profileImage:
                "https://cdn-icons-png.flaticon.com/128/17561/17561717.png",
        };

        // Sample user data for logged in user
        // In a real app, this would come from your authentication system
        const loggedInUserData = {
            name: "Arif Hassan",
            email: "arif.hassan@example.com",
            profileImage:
                "https://cdn-icons-png.flaticon.com/128/17561/17561717.png",
        };

        // Get the appropriate user data based on login status
        const userData = isLoggedIn ? loggedInUserData : defaultUserData;

        // Handle logout
        const handleLogout = () => {
            // Clear user data
            setIsLoggedIn(false);

            // Reset any user-specific data if needed
            // For example, you might want to clear screening data
            setScreeningData([]);
            setSelectedScreeningId(null);
        };

        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 flex-1 text-center">
                        {t.profile}
                    </h1>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 overflow-hidden mb-3 relative">
                        <img
                            src={userData.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        {isLoggedIn && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                    <h2 className="font-bold text-xl text-gray-800">
                        {userData.name}
                    </h2>
                    <p className="text-gray-500 mb-6">{userData.email}</p>

                    <div className="w-full space-y-4">
                        <button
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-between mb-6 shadow-md"
                            onClick={() => setShowPartnerForm(true)}
                        >
                            <div className="flex items-center">
                                <div className="bg-white p-2 rounded-full mr-3">
                                    <MapPin
                                        size={20}
                                        className="text-green-500"
                                    />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold">
                                        {t.becomePartnerTitle}
                                    </span>
                                    <p className="text-xs text-green-100">
                                        {t.registerLocation}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-white" />
                        </button>

                        <div className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-4">
                            <div className="flex items-center">
                                <Globe
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{t.language}</span>
                            </div>
                            <div className="flex items-center">
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-gray-100 rounded-md py-2 text-gray-700 border-none appearance-none mr-2"
                                >
                                    <option value="en">EN</option>
                                    <option value="id">ID</option>
                                    <option value="zh">ZH</option>
                                </select>
                            </div>
                        </div>

                        <button className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <FileText
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{t.privacy}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>

                        <button className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                            <div className="flex items-center">
                                <FileText
                                    size={20}
                                    className="text-gray-500 mr-3"
                                />
                                <span>{t.terms}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>

                        {isLoggedIn && (
                            <button
                                className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm text-red-500"
                                onClick={handleLogout}
                            >
                                <div className="flex items-center">
                                    <LogOut size={20} className="mr-3" />
                                    <span>{t.logout}</span>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className="text-red-300"
                                />
                            </button>
                        )}
                    </div>
                </div>

                {showPartnerForm && (
                    <PartnerApplicationForm
                        onClose={() => setShowPartnerForm(false)}
                    />
                )}

                {renderBottomNav()}
            </div>
        );
    };
    const PartnerApplicationForm = ({ onClose }) => {
        const [formData, setFormData] = useState({
            businessName: "",
            businessType: "Health Center",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            reason: "",
            locationCoords: { lat: null, lng: null },
        });

        const [step, setStep] = useState(1);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isSuccess, setIsSuccess] = useState(false);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                setIsSuccess(true);
                // Auto close after success
                setTimeout(() => {
                    onClose();
                }, 2000);
            }, 1500);
        };

        const handleNext = () => {
            setStep((prev) => prev + 1);
        };

        const handleBack = () => {
            if (step > 1) {
                setStep((prev) => prev - 1);
            } else {
                onClose();
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <button onClick={handleBack} className="p-2">
                            {step > 1 ? (
                                <ArrowLeft
                                    size={20}
                                    className="text-gray-500"
                                />
                            ) : (
                                <X size={20} className="text-gray-500" />
                            )}
                        </button>
                        <h2 className="text-lg font-bold text-center flex-1">
                            Become A Partner
                        </h2>
                        <div className="w-10"></div>{" "}
                        {/* Spacer for alignment */}
                    </div>

                    {/* Progress indicator */}
                    <div className="px-4 pt-2">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                Business Details
                            </span>
                            <span className="text-xs text-gray-500">
                                Location & Documents
                            </span>
                            <span className="text-xs text-gray-500">
                                Review
                            </span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full">
                            <div
                                className="h-1 bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${(step / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="p-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="Enter your business or clinic name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Type *
                                    </label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        required
                                    >
                                        <option value="Health Center">
                                            Health Center
                                        </option>
                                        <option value="Medical Clinic">
                                            Medical Clinic
                                        </option>
                                        <option value="Hospital">
                                            Hospital
                                        </option>
                                        <option value="Private Practice">
                                            Private Practice
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Person *
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        placeholder="+62..."
                                        required
                                    />
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-green-500 text-white py-3 rounded-xl font-medium mt-4"
                                    disabled={
                                        !formData.businessName ||
                                        !formData.contactPerson ||
                                        !formData.email ||
                                        !formData.phone
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        rows={3}
                                        placeholder="Enter your full address"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pin Your Location
                                    </label>
                                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <MapPin
                                                size={24}
                                                className="text-green-500 mx-auto mb-2"
                                            />
                                            <p className="text-sm text-gray-600">
                                                {t.selectLocationMap}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Why do you want to become a health
                                        screening partner? *
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        rows={3}
                                        placeholder="Tell us about your interest in partnering with Ijen Health"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Required Documents
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                            <Upload
                                                size={24}
                                                className="text-green-500"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 text-center mb-2">
                                            Medical license, business permit
                                        </p>
                                        <p className="text-xs text-gray-400 text-center">
                                            PDF, PNG, JPG up to 5MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full bg-green-500 text-white py-3 rounded-xl font-medium mt-4"
                                    disabled={
                                        !formData.address || !formData.reason
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-800 mb-1">
                                    Review Your Information
                                </h3>

                                <div className="p-4 bg-green-50 rounded-lg mb-4">
                                    <p className="text-sm text-green-800 mb-2">
                                        Please review your information before
                                        submitting. After submission, our team
                                        will review your application within 3-5
                                        business days.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Business Name
                                        </span>
                                        <span className="font-medium">
                                            {formData.businessName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Business Type
                                        </span>
                                        <span className="font-medium">
                                            {formData.businessType}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Contact Person
                                        </span>
                                        <span className="font-medium">
                                            {formData.contactPerson}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email
                                        </span>
                                        <span className="font-medium">
                                            {formData.email}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Phone
                                        </span>
                                        <span className="font-medium">
                                            {formData.phone}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Address
                                        </span>
                                        <span className="font-medium text-right flex-1 ml-4">
                                            {formData.address}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full bg-green-500 text-white py-3 rounded-xl font-medium mb-3"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                                Processing...
                                            </span>
                                        ) : isSuccess ? (
                                            <span className="flex items-center justify-center">
                                                <CheckCircle
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Application Submitted!
                                            </span>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </button>

                                    <button
                                        onClick={handleBack}
                                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                                        disabled={isSubmitting || isSuccess}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    const Form1Screen = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [showDetail, setShowDetail] = useState(
            selectedLocationFromMap !== null
        );
        const [selectedCity, setSelectedCity] = useState("Bondowoso");
        const [participantCount, setParticipantCount] = useState(1); // Add participant count state

        const timeSlots = [
            {
                id: 1,
                start: "04:30",
                end: "05:30",
                label: "Morning",
                available: true,
            },
            {
                id: 2,
                start: "05:30",
                end: "06:30",
                label: "Sunrise",
                available: true,
            },
            {
                id: 3,
                start: "15:00",
                end: "16:00",
                label: "Afternoon",
                available: true,
            },
            {
                id: 4,
                start: "20:00",
                end: "21:00",
                label: "Night (Blue Fire)",
                available: true,
            },
        ];

        // Updated locations with city field added to each location
        const locations = [
            {
                id: 1,
                name: "Baratha Hotel",
                coords: [-7.91303, 113.807867],
                description: "Most popular entry point",
                city: "Bondowoso",
            },
            {
                id: 2,
                name: "Riverside Homestay",
                coords: [-7.932059, 113.824877],
                description: "Eastern entry point",
                city: "Bondowoso",
            },
            {
                id: 3,
                name: "Grand Padis Hotel",
                coords: [-7.915963, 113.819655],
                description: "Northern entry point",
                city: "Bondowoso",
            },
            {
                id: 4,
                name: "Luminor Hotel",
                coords: [-8.210083, 114.369759],
                description: "City center hotel",
                city: "Banyuwangi",
            },
            {
                id: 5,
                name: "Santika Hotel",
                coords: [-8.219246, 114.364867],
                description: "Near shopping district",
                city: "Banyuwangi",
            },
        ];

        // Local state for map interaction
        const [localSelectedLocation, setLocalSelectedLocation] = useState(
            selectedLocationFromMap || selectedLocation
        );
        const [localSelectedTimeSlot, setLocalSelectedTimeSlot] =
            useState(null);

        // Handle participant count
        const decreaseParticipantCount = () => {
            if (participantCount > 1) {
                setParticipantCount(participantCount - 1);
            }
        };

        const increaseParticipantCount = () => {
            if (participantCount < 10) {
                setParticipantCount(participantCount + 1);
            }
        };

        function SetMapCenter({ city }) {
            const map = useMap();

            useEffect(() => {
                if (city) {
                    const center = getCityCenter(city);
                    map.setView(center, 14);
                }
            }, [city, map]);

            return null;
        }

        // Get center coordinates for map based on selected city
        const getCityCenter = (city) => {
            if (city === "Bondowoso") return [-7.91303, 113.820867];
            if (city === "Banyuwangi") return [-8.215083, 114.367759];
            return [-7.91303, 113.820867]; // Default to Bondowoso
        };

        useEffect(() => {
            if (selectedLocationFromMap) {
                // Find the location and set its city
                const fullLocationDetails = locations.find(
                    (loc) => loc.id === selectedLocationFromMap.id
                );
                if (fullLocationDetails) {
                    setSelectedCity(fullLocationDetails.city);
                    setLocalSelectedLocation(fullLocationDetails);
                    setShowDetail(true);
                }
            } else if (selectedLocation) {
                setLocalSelectedLocation(selectedLocation);
                setShowDetail(true);
                if (selectedLocation.city) {
                    setSelectedCity(selectedLocation.city);
                }
            }
        }, []);

        // Get active locations for the selected city
        const activeLocations = selectedCity
            ? locations.filter((location) => location.city === selectedCity)
            : [];

        // Filter locations based on search query
        const filteredLocations = activeLocations.filter((location) =>
            location.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handleMarkerClick = (location) => {
            setLocalSelectedLocation(location);
            setShowDetail(true);
            setSearchQuery(""); // Reset search after selecting location
        };

        const handleTimeSelection = (timeSlot) => {
            setLocalSelectedTimeSlot(timeSlot);
        };

        const handleProceed = () => {
            if (
                localSelectedLocation &&
                selectedDate &&
                localSelectedTimeSlot
            ) {
                // Update the global state with selected location and time slot
                setSelectedLocation(localSelectedLocation);
                setSelectedTimeSlot(localSelectedTimeSlot);

                // Update participants based on participant count
                const newParticipants = [];
                for (let i = 0; i < participantCount; i++) {
                    if (i < participants.length) {
                        newParticipants.push(participants[i]);
                    } else {
                        newParticipants.push({
                            title: "Mr",
                            name: "",
                            age: "",
                            nationality: "",
                            idNumber: "",
                            hasMedicalHistory: false,
                            allergies: "",
                            pastMedicalHistory: "",
                            currentMedications: "",
                            familyMedicalHistory: "",
                        });
                    }
                }
                setParticipants(newParticipants);

                setCurrentScreen("form2");
            }
        };

        // Component for zooming to location
        function FlyToMarker({ coords }) {
            const map = useMap();
            if (coords) {
                // Zoom to location with offset so marker is visible above detail panel
                map.flyTo([coords[0] - 0.008, coords[1]], 14);
            }
            return null;
        }

        const today = new Date();

        // Generate dates for the next 7 days
        const dates = Array(8)
            .fill()
            .map((_, index) => {
                const date = new Date();
                date.setDate(today.getDate() + index);
                return date;
            });

        // State to track selected date (full Date object)
        const [selectedDate, setSelectedDate] = useState(today);

        // Function to format month in short form
        const getShortMonth = (date) => {
            return date
                .toLocaleString("default", { month: "short" })
                .toUpperCase();
        };

        // Function to check if dates are the same day
        const isSameDay = (date1, date2) => {
            return (
                date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
            );
        };

        // Format the selected date for display
        const formatFullDate = (date) => {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };

        return (
            <div className="min-h-screen bg-gray-50 relative">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button onClick={() => setCurrentScreen("home")} className="mr-2">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold">{t.appName}</h1>
                </div>

                {/* City selection tabs */}
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.scheduleAppointment}</h1>
                    <p className="text-gray-600 mb-6">{t.selectDateTimeLocation}</p>
                    
                    <div className="bg-white rounded-xl p-4 border mb-4 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{t.selectDateStep}</h2>
                        <p className="text-gray-600 mb-4">{t.chooseDate}</p>

                        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
                            {dates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg ${
                                        isSameDay(date, selectedDate)
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    } flex flex-col items-center justify-center cursor-pointer`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <span className="text-xs opacity-80">
                                        {getShortMonth(date)}
                                    </span>
                                    <span className="text-lg font-bold">
                                        {date.getDate()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-4 border shadow-sm rounded-xl">
                        <div className="flex space-x-2 shadow-sm">
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                                    selectedCity === "Bondowoso"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                                onClick={() => setSelectedCity("Bondowoso")}
                            >
                                {t.bondowoso}
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium ${
                                    selectedCity === "Banyuwangi"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                                onClick={() => setSelectedCity("Banyuwangi")}
                            >
                                {t.banyuwangi}
                            </button>
                        </div>
                        {!selectedCity ? (
                            // Instructions when no city is selected
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <MapPin size={40} className="text-green-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                    {t.selectCity}
                                </h3>
                                <p className="text-gray-600">{t.selectCityPrompt}</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                {/* Map Container - Fixed height instead of full screen */}
                                <div className="h-48 rounded-xl overflow-hidden shadow-md mb-4">
                                    <MapContainer
                                        center={getCityCenter(selectedCity)}
                                        zoom={14}
                                        style={{ height: "100%", width: "100%" }}
                                        zoomControl={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            className="grayscale brightness-105 contrast-105"
                                        />

                                        <SetMapCenter city={selectedCity} />

                                        {activeLocations.map((location) => (
                                            <Marker
                                                key={location.id}
                                                position={location.coords}
                                                icon={defaultIcon}
                                                eventHandlers={{
                                                    click: () =>
                                                        handleMarkerClick(location),
                                                }}
                                            >
                                                <Popup>{location.name}</Popup>
                                            </Marker>
                                        ))}

                                        {localSelectedLocation && (
                                            <FlyToMarker
                                                coords={localSelectedLocation.coords}
                                            />
                                        )}
                                    </MapContainer>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder={t.searchLocations}
                                        className="w-full bg-white rounded-lg py-3 px-4 pl-10 shadow-sm border border-gray-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-3.5 text-gray-400"
                                    />
                                </div>

                                {/* Location List */}
                                <div className="space-y-3 mb-16">
                                    {filteredLocations.length > 0 ? (
                                        filteredLocations.map((location) => (
                                            <div
                                                key={location.id}
                                                className={`bg-white p-4 rounded-xl shadow-sm border ${
                                                    localSelectedLocation &&
                                                    localSelectedLocation.id ===
                                                        location.id
                                                        ? "border-green-500"
                                                        : "border-gray-100"
                                                }`}
                                                onClick={() =>
                                                    handleMarkerClick(location)
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-800">
                                                            {location.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            {location.description}
                                                        </p>
                                                    </div>
                                                    <ChevronRight
                                                        size={20}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 bg-white rounded-xl shadow-sm">
                                            <p className="text-gray-500">
                                                {t.noLocationsFound}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Black overlay when detail panel is shown */}
                {showDetail && (
                    <div
                        onClick={() => setShowDetail(false)}
                    ></div>
                )}

                {/* Fixed Detail Panel with Date & Time */}
                {showDetail && localSelectedLocation && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 shadow-lg z-[1000] max-h-[70%] overflow-y-auto">
                        <div className="mb-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800">
                                        {localSelectedLocation.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {localSelectedLocation.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="ml-auto"
                                >
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Participant Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.participants}
                            </label>
                            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                                <button
                                    onClick={decreaseParticipantCount}
                                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"
                                    disabled={participantCount <= 1}
                                >
                                    <span className="text-xl font-bold">-</span>
                                </button>
                                <div className="text-center">
                                    <span className="text-xl font-bold text-gray-800">
                                        {participantCount}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {t.peopleLabel}
                                    </p>
                                </div>
                                <button
                                    onClick={increaseParticipantCount}
                                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"
                                    disabled={participantCount >= 10}
                                >
                                    <span className="text-xl font-bold">+</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {timeSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`p-3 rounded-lg ${
                                        localSelectedTimeSlot &&
                                        localSelectedTimeSlot.id === slot.id
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    } flex flex-col items-center cursor-pointer ${
                                        !slot.available ? "opacity-50" : ""
                                    }`}
                                    onClick={() =>
                                        slot.available &&
                                        handleTimeSelection(slot)
                                    }
                                >
                                    <span className="text-xs opacity-80">
                                        {slot.label}
                                    </span>
                                    <span className="text-sm font-medium">
                                        {slot.start} - {slot.end}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleProceed}
                            className={`w-full py-3 rounded-xl font-medium ${
                                selectedDate && localSelectedTimeSlot
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                            disabled={!selectedDate || !localSelectedTimeSlot}
                        >
                            {t.next}
                        </button>
                    </div>
                )}
                {renderBottomNav()}
            </div>
        );
    };

    const Form2Screen = () => {
        // State lokal terpisah dari state global untuk menjaga fokus
        const [localParticipants, setLocalParticipants] = useState(
            participants.map((p) => ({ ...p }))
        );

        // State untuk validasi
        const [validationErrors, setValidationErrors] = useState({});

        // Validasi ID numbers
        const validateIdNumber = (nationality, idNumber, index) => {
            const errors = { ...validationErrors };

            if (!idNumber) {
                errors[`idNumber_${index}`] = "ID number is required";
            } else if (
                nationality === "Indonesia" &&
                !/^\d{16}$/.test(idNumber)
            ) {
                errors[`idNumber_${index}`] = "KTP must be 16 digits";
            } else if (
                nationality !== "Indonesia" &&
                !/^[A-Z0-9]{8,9}$/.test(idNumber)
            ) {
                errors[`idNumber_${index}`] = "Passport must be 8-9 characters";
            } else {
                delete errors[`idNumber_${index}`];
            }

            setValidationErrors(errors);
        };

        // Validasi nama (tidak boleh mengandung angka)
        const validateName = (name, index) => {
            const errors = { ...validationErrors };

            if (!name) {
                errors[`name_${index}`] = "Name is required";
            } else if (/\d/.test(name)) {
                errors[`name_${index}`] = "Name cannot contain numbers";
            } else {
                delete errors[`name_${index}`];
            }

            setValidationErrors(errors);
        };

        // Validasi tahun lahir
        const validateBirthYear = (birthYear, index) => {
            const errors = { ...validationErrors };
            const currentYear = new Date().getFullYear();

            if (!birthYear) {
                errors[`birthYear_${index}`] = "Birth year is required";
            } else if (isNaN(birthYear)) {
                errors[`birthYear_${index}`] = "Birth year must be a number";
            } else if (
                parseInt(birthYear) < 1900 ||
                parseInt(birthYear) > currentYear
            ) {
                errors[
                    `birthYear_${index}`
                ] = `Birth year must be between 1900 and ${currentYear}`;
            } else {
                delete errors[`birthYear_${index}`];
            }

            setValidationErrors(errors);
        };

        // Handle perubahan input secara lokal saja
        const handleInputChange = (index, field, value) => {
            const updatedParticipants = [...localParticipants];
            updatedParticipants[index] = {
                ...updatedParticipants[index],
                [field]: value,
            };
            setLocalParticipants(updatedParticipants);

            // Validasi berdasarkan field yang diubah
            if (field === "idNumber") {
                validateIdNumber(
                    updatedParticipants[index].nationality,
                    value,
                    index
                );
            }

            if (field === "nationality") {
                validateIdNumber(
                    value,
                    updatedParticipants[index].idNumber,
                    index
                );
            }

            if (field === "name") {
                validateName(value, index);
            }

            if (field === "birthYear") {
                validateBirthYear(value, index);
            }
        };

        // Fungsi untuk menambah participant (hanya di state lokal)
        const handleAddParticipant = () => {
            if (localParticipants.length < 10) {
                setLocalParticipants([
                    ...localParticipants,
                    {
                        title: "Mr",
                        name: "",
                        birthYear: "", // Menggunakan birthYear bukan age
                        nationality: "",
                        idNumber: "",
                        hasMedicalHistory: false,
                        allergies: "",
                        pastMedicalHistory: "",
                        currentMedications: "",
                        familyMedicalHistory: "",
                    },
                ]);
            }
        };

        // Fungsi untuk menghapus participant (hanya di state lokal)
        const handleRemoveParticipant = (index) => {
            if (localParticipants.length > 1) {
                setLocalParticipants(
                    localParticipants.filter((_, i) => i !== index)
                );

                // Clear validation errors related to the removed participant
                const updatedErrors = { ...validationErrors };
                Object.keys(updatedErrors).forEach((key) => {
                    if (key.endsWith(`_${index}`)) {
                        delete updatedErrors[key];
                    }
                });
                setValidationErrors(updatedErrors);
            }
        };

        // Check if form can proceed
        const canProceed = () => {
            return (
                Object.keys(validationErrors).length === 0 &&
                localParticipants.every(
                    (p) => p.name && p.birthYear && p.nationality && p.idNumber
                )
            );
        };

        // Perubahan screen dengan memperbarui state global terlebih dahulu
        const handleNext = () => {
            // Convert birthYear to age before saving to global state
            const participantsWithAge = localParticipants.map((p) => {
                const currentYear = new Date().getFullYear();
                const age = p.birthYear
                    ? (currentYear - parseInt(p.birthYear)).toString()
                    : "";
                return {
                    ...p,
                    age: age,
                };
            });

            // Update state global participants dengan data lokal
            setParticipants(participantsWithAge);

            // Pindah ke screen berikutnya
            setCurrentScreen("form3");
        };

        // Kembali ke screen sebelumnya
        const handleBack = () => {
            setCurrentScreen("form1");
        };

        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button onClick={handleBack} className="mr-2">
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.participantInfo}
                    </h1>
                </div>

                <div className="p-6">
                    {localParticipants.map((participant, index) => (
                        <div
                            key={index}
                            className="bg-white border shadow-sm rounded-xl shadow-sm p-4 mb-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-lg text-gray-800">
                                    {t.participantInfo} {index + 1}
                                </h2>
                                {index > 0 && (
                                    <button
                                        className="text-red-500"
                                        onClick={() =>
                                            handleRemoveParticipant(index)
                                        }
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex space-x-3">
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.title}
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            value={participant.title || "Mr"}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>Mr</option>
                                            <option>Mrs</option>
                                            <option>Ms</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.name}
                                        </label>
                                        <input
                                            type="text"
                                            value={participant.name || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full border ${
                                                validationErrors[
                                                    `name_${index}`
                                                ]
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-lg p-3`}
                                        />
                                        {validationErrors[`name_${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {
                                                    validationErrors[
                                                        `name_${index}`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {language === "en"
                                                ? "Birth Year"
                                                : language === "id"
                                                ? "Tahun Lahir"
                                                : "出生年份"}
                                        </label>
                                        <input
                                            type="number"
                                            value={participant.birthYear || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "birthYear",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full border ${
                                                validationErrors[
                                                    `birthYear_${index}`
                                                ]
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-lg p-3`}
                                            placeholder={t.birthYearPlaceholder}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                        {validationErrors[
                                            `birthYear_${index}`
                                        ] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {
                                                    validationErrors[
                                                        `birthYear_${index}`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t.nationality}
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            value={
                                                participant.nationality || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "nationality",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select...</option>
                                            <option value="Indonesia">
                                                Indonesia
                                            </option>
                                            <option value="Malaysia">
                                                Malaysia
                                            </option>
                                            <option value="Singapore">
                                                Singapore
                                            </option>
                                            <option value="Australia">
                                                Australia
                                            </option>
                                            <option value="United States">
                                                United States
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {participant.nationality ===
                                            "Indonesia"
                                                ? "KTP Number"
                                                : "Passport Number"}
                                        </label>
                                        <input
                                            type="text"
                                            value={participant.idNumber || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "idNumber",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full border ${
                                                validationErrors[
                                                    `idNumber_${index}`
                                                ]
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } rounded-lg p-3`}
                                            placeholder={
                                                participant.nationality ===
                                                "Indonesia"
                                                    ? "16 digits"
                                                    : "8-9 characters"
                                            }
                                        />
                                        {validationErrors[
                                            `idNumber_${index}`
                                        ] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {
                                                    validationErrors[
                                                        `idNumber_${index}`
                                                    ]
                                                }
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {participant.nationality === "Indonesia"
                                                ? t.ktpValidation
                                                : t.passportValidation}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">
                                        {t.medicalHistory}
                                    </span>
                                    <div
                                        className={`w-12 h-6 rounded-full ${
                                            participant.hasMedicalHistory
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                        } flex items-center p-1 transition-all duration-200 cursor-pointer`}
                                        onClick={() =>
                                            handleInputChange(
                                                index,
                                                "hasMedicalHistory",
                                                !participant.hasMedicalHistory
                                            )
                                        }
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full bg-white transform transition-all duration-200 ${
                                                participant.hasMedicalHistory
                                                    ? "translate-x-6"
                                                    : ""
                                            }`}
                                        ></div>
                                    </div>
                                </div>

                                {participant.hasMedicalHistory && (
                                    <div className="space-y-4 p-3 bg-green-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.allergies}
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    participant.allergies || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "allergies",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                placeholder="List any allergies"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.pastMedical}
                                            </label>
                                            <textarea
                                                value={
                                                    participant.pastMedicalHistory ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "pastMedicalHistory",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                rows={2}
                                                placeholder="Describe any past medical conditions"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.currentMeds}
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    participant.currentMedications ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "currentMedications",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                placeholder="List current medications"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t.familyMedical}
                                            </label>
                                            <textarea
                                                value={
                                                    participant.familyMedicalHistory ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "familyMedicalHistory",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-3"
                                                rows={2}
                                                placeholder="Any relevant family medical history"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {localParticipants.length < 10 && (
                        <button
                            onClick={handleAddParticipant}
                            className="w-full mb-4 border-2 border-dashed border-green-300 text-green-500 py-3 rounded-xl font-medium flex items-center justify-center"
                        >
                            <Plus size={20} className="mr-2" />
                            {t.addParticipant} ({localParticipants.length}/10)
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className={`w-full ${
                            canProceed()
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-500"
                        } py-3 rounded-xl font-medium mb-6`}
                        disabled={!canProceed()}
                    >
                        {t.next}
                    </button>
                </div>
                {renderBottomNav()}
            </div>
        );
    };

    const Form3Screen = () => {
        const [termsAgreed, setTermsAgreed] = useState(false);

        // Konstanta untuk harga screening
        const SCREENING_FEE = 35000; // 35.000 rupiah per pax
        const SERVICE_FEE = 0; // 5.000 rupiah service fee

        // Hitung total biaya
        const calculateTotal = () => {
            return SCREENING_FEE * participants.length + SERVICE_FEE;
        };

        const handleSubmit = (e) => {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            
            if (isLoggedIn && termsAgreed) {
                submitScreeningData(e);
            } else if (!termsAgreed) {
                // Show an alert or toast notification if terms are not agreed
                alert(
                    language === "en"
                        ? "Please agree to the terms and conditions"
                        : language === "id"
                        ? "Harap setujui syarat dan ketentuan"
                        : "请同意条款和条件"
                );
            } else {
                setShowLoginPopup(true);
            }
        };

        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("form2")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.summary}
                    </h1>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h2 className="font-bold text-lg mb-4 text-gray-800">
                            {t.screeningDetails}
                        </h2>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.location}</span>
                            <span className="font-medium">
                                {selectedLocation
                                    ? selectedLocation.name
                                    : "Baratha Hotel"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.date}</span>
                            <span className="font-medium">{selectedDate}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">{t.time}</span>
                            <span className="font-medium">
                                {selectedTimeSlot
                                    ? `${selectedTimeSlot.start} - ${selectedTimeSlot.end}`
                                    : "04:30 AM - 10:00 AM"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                            <span className="text-gray-700">
                                {t.participants}
                            </span>
                            <span className="font-medium">
                                {participants.length}
                            </span>
                        </div>

                        <h2 className="font-bold text-lg my-4 text-gray-800">
                            {t.payment}
                        </h2>

                        <div className="space-y-3 mb-4">
                            {/* Credit/Debit Card Option */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("card")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "card" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {t.creditCard}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div className="flex space-x-1">
                                    {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 w-auto object-contain" /> */}
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                                        alt="Mastercard"
                                        className="h-8 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* QRIS Option */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("qris")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "qris" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{t.qrisPayment}</h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src="https://eg9mp7d8pz2.exactdn.com/wp-content/uploads/2022/12/QRIS__Quick_Response_Code_Indonesia_Standard__Logo__PNG2160p__-_Vector69Com-removebg-preview.png?strip=all&lossy=1&webp=85&ssl=1"
                                        alt="QRIS"
                                        className="h-6 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* OVO Option */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("ovo")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "ovo" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{t.ovoPayment}</h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png"
                                        alt="OVO"
                                        className="h-5 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* Virtual Account Section Header */}
                            <div className="pt-2 pb-1">
                                <h3 className="text-sm font-medium text-gray-600">
                                {t.virtualAccount}
                                </h3>
                            </div>

                            {/* BNI Virtual Account */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("bni")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "bni" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                    {t.bniVirtualAccount}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png"
                                        alt="BNI"
                                        className="h-5 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* BRI Virtual Account */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => setSelectedPaymentMethod("bri")}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "bri" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                    {t.briVirtualAccount}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png"
                                        alt="BRI"
                                        className="h-5 w-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* Mandiri Virtual Account */}
                            <div
                                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() =>
                                    setSelectedPaymentMethod("mandiri")
                                }
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {selectedPaymentMethod === "mandiri" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">
                                    {t.mandiriVirtualAccount}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {t.instantVerification}
                                    </p>
                                </div>
                                <div>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg"
                                        alt="Mandiri"
                                        className="h-5 w-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    {t.screeningFee}
                                </span>
                                <span>
                                    Rp {SCREENING_FEE.toLocaleString()} x{" "}
                                    {participants.length}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <span>{t.total}</span>
                                <span>
                                    Rp {calculateTotal().toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Terms and Conditions Agreement Checkbox */}
                        <div className="mb-4 mt-6">
                            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex items-start">
                                    <AlertCircle size={18} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-800">
                                        {t.dataExpiryWarning}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="flex items-start cursor-pointer"
                                onClick={() => setTermsAgreed(!termsAgreed)}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        checked={termsAgreed}
                                        onChange={() =>
                                            setTermsAgreed(!termsAgreed)
                                        }
                                        className="w-4 h-4 border border-gray-300 rounded accent-green-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="text-gray-700">
                                        {language === "en"
                                            ? "I agree to the "
                                            : language === "id"
                                            ? "Saya menyetujui "
                                            : "我同意 "}
                                        <button className="text-green-500 hover:underline">
                                            {t.terms}
                                        </button>
                                        {language === "en"
                                            ? " and "
                                            : language === "id"
                                            ? " dan "
                                            : " 和 "}
                                        <button className="text-green-500 hover:underline">
                                            {t.privacy}
                                        </button>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className={`w-full ${
                                termsAgreed && selectedPaymentMethod != ""
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300 text-gray-500"
                            } py-3 rounded-xl font-medium`}
                            disabled={
                                !termsAgreed ||
                                selectedPaymentMethod == "" ||
                                isProcessingPayment
                            }
                        >
                            {isProcessingPayment ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    {t.processing}
                                </span>
                            ) : (
                                t.submit
                            )}
                        </button>
                    </div>
                </div>
                {renderBottomNav()}
            </div>
        );
    };

    const Form5Screen = () => (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button
                    onClick={() => setCurrentScreen("form3")}
                    className="mr-2"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t.payment}</h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">
                        {t.paymentDetails}
                    </h2>

                    <div className="p-4 bg-green-50 rounded-lg mb-4">
                        <h3 className="font-medium mb-2">
                            {t.bankTransferInstructions}
                        </h3>
                        <ol className="text-sm text-gray-700 space-y-2 pl-5 list-decimal">
                            <li>{t.transferAmount}</li>
                            <li>{t.includeReference}</li>
                            <li>{t.completeWithin}</li>
                            <li>{t.uploadReceipt}</li>
                        </ol>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.bank}</span>
                        <span className="font-medium">
                            Bank Central Asia (BCA)
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.accountNumber}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">1234567890</span>
                            <button className="text-green-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.accountName}</span>
                        <span className="font-medium">
                            Ijen Health Services
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.amount}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">
                                Rp {50000 * participants.length + 5000}
                            </span>
                            <button className="text-green-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.referenceId}</span>
                        <div className="flex items-center">
                            <span className="font-medium mr-2">
                                IJN230515001
                            </span>
                            <button className="text-green-500 text-xs">
                                {t.copy}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const updatedScreeningData = screeningData.map(
                                (screening) =>
                                    screening.id === selectedScreeningId
                                        ? { ...screening, status: "complete" }
                                        : screening
                            );
                            setScreeningDataWithStorage(updatedScreeningData);

                            setCurrentScreen("form6");
                        }}
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
                    >
                        {t.confirmPayment}
                    </button>
                </div>
            </div>
            {renderBottomNav()}
        </div>
    );

    const Form6Screen = () => {
        const SCREENING_FEE = 35000; // 35.000 rupiah per pax
        const SERVICE_FEE = 0; // 5.000 rupiah service fee

        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>

                    <h2 className="font-bold text-2xl text-gray-800 mb-2">
                        {t.paymentSuccessful}
                    </h2>
                    <p className="text-gray-600 mb-8">{t.healthConfirmed}</p>

                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">{t.location}</span>
                            <span className="font-medium">
                                {selectedLocation
                                    ? selectedLocation.name
                                    : "Baratha Hotel"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">{t.date}</span>
                            <span className="font-medium">{selectedDate}</span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">{t.time}</span>
                            <span className="font-medium">
                                {selectedTimeSlot
                                    ? selectedTimeSlot.start
                                    : "04:30 AM"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">
                                {t.participants}
                            </span>
                            <span className="font-medium">
                                {participants.length}
                            </span>
                        </div>

                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start">
                                <AlertCircle
                                    size={18}
                                    className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                                />
                                <p className="text-sm text-green-800">
                                    {t.arriveEarly}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setCurrentScreen("viewTicket")}
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-medium mb-3"
                    >
                        {t.viewETicket}
                    </button>

                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="text-green-500 font-medium"
                    >
                        {t.backToHome}
                    </button>
                </div>
                {renderBottomNav()}
            </div>
        );
    };

    const DetailScreen = () => {
        const SCREENING_FEE = 35000; // 35.000 rupiah per pax
        const SERVICE_FEE = 0; // 5.000 rupiah service fee
    
        // Clean the selectedScreeningId of any quotes
        const cleanedScreeningId = selectedScreeningId ? selectedScreeningId.replace(/^["']|["']$/g, '') : null;
            
        // Find screening using the cleaned ID
        const screening = screeningData.find(
            (item) => item.id === cleanedScreeningId
        );
    
        if (!screening) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <div className="bg-white p-4 flex items-center shadow-sm">
                        <button
                            onClick={() => setCurrentScreen("screening")}
                            className="mr-2"
                        >
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">
                            {t.screeningDetails}
                        </h1>
                    </div>
    
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center">
                            <AlertCircle
                                size={48}
                                className="text-gray-400 mx-auto mb-4"
                            />
                            <h3 className="font-medium text-gray-800 mb-2">
                                {language === "en"
                                    ? "Screening not found"
                                    : language === "id"
                                    ? "Pemeriksaan tidak ditemukan"
                                    : "未找到筛查记录"}
                            </h3>
                            <button
                                onClick={() => setCurrentScreen("screening")}
                                className="text-green-500 text-sm font-medium"
                            >
                                {language === "en"
                                    ? "Go back"
                                    : language === "id"
                                    ? "Kembali"
                                    : "返回"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("screening")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.screeningDetails}
                    </h1>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        {screening.location}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {screening.date}
                                    </p>
                                </div>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full ${
                                    screening.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                } text-xs font-medium`}
                            >
                                {screening.status === "pending"
                                    ? t.pending
                                    : t.complete}
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">
                                    {t.referenceId}
                                </span>
                                <span className="font-medium">
                                    {screening.id}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">{t.date}</span>
                                <span className="font-medium">
                                    {screening.date}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">{t.time}</span>
                                <span className="font-medium">
                                    {screening.time}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">
                                    {t.status}
                                </span>
                                <span
                                    className={`font-medium ${
                                        screening.status === "pending"
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {screening.status === "pending"
                                        ? t.pending
                                        : t.complete}
                                </span>
                            </div>

                            {screening.paymentMethod && (
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">
                                        {t.payment}
                                    </span>
                                    <span className="font-medium">
                                        {screening.paymentMethod.toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-medium text-gray-800 mb-3">
                            {t.participants} ({screening.participants.length})
                        </h3>

                        {screening.participants.map((participant, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-lg p-3 mb-3"
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-700">
                                        {participant.title || "Mr"}.{" "}
                                        {participant.name ||
                                            "Unnamed Participant"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {participant.age || "N/A"} years
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {participant.hasMedicalHistory
                                        ? participant.allergies
                                            ? `Allergies: ${participant.allergies}`
                                            : "Has medical history"
                                        : t.noMedicalHistory}
                                </p>
                            </div>
                        ))}

                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    {t.screeningFee}
                                </span>
                                <span>
                                    Rp {SCREENING_FEE.toLocaleString()} x{" "}
                                    {screening.participants.length}
                                </span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    {t.serviceFee}
                                </span>
                                <span>Rp {SERVICE_FEE.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <span>{t.total}</span>
                                <span>
                                    Rp{" "}
                                    {screening.total ||
                                        (
                                            SCREENING_FEE *
                                                screening.participants.length +
                                            SERVICE_FEE
                                        ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        {screening.status === 'pending' ? (
                            <button
                                onClick={() => {
                                    window.location = screening.paymentUrl
                                }}
                                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
                            >
                                {t.proceedToPayment}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSelectedScreeningId(screening.id);
                                    setCurrentScreen("viewTicket");
                                }}
                                className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
                            >
                                {t.viewETicket}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const PartnerScreen = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button
                    onClick={() => setCurrentScreen("profile")}
                    className="mr-2"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{t.partner}</h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">
                        {t.becomePartnerText}
                    </h2>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessName}
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Enter your business name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessType}
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg p-3">
                                <option>Tour Guide</option>
                                <option>Tour Operator</option>
                                <option>Transportation Provider</option>
                                <option>Accommodation</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.contactPerson}
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.emailAddress}
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.phoneNumber}
                            </label>
                            <input
                                type="tel"
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="+62..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessAddress}
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3"
                                rows={3}
                                placeholder="Enter your business address"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.whyPartner}
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3"
                                rows={3}
                                placeholder={t.partnerInterest}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.businessLicense}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                    <Upload
                                        size={24}
                                        className="text-green-500"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 text-center mb-2">
                                    {t.uploadInstructions}
                                </p>
                                <p className="text-xs text-gray-400 text-center">
                                    {t.fileTypes}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
                    >
                        {t.submitApplication}
                    </button>
                </div>
            </div>
        </div>
    );

    const ViewTicketScreen = () => {
        const screening = screeningData.find(
            (item) => item.id === selectedScreeningId
        );

        if (screening) {
            return (
                <div className="min-h-screen bg-green-600">
                    <div className="bg-white p-4 flex items-center shadow-sm">
                        <button
                            onClick={() => setCurrentScreen("details")}
                            className="mr-2"
                        >
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">
                            {t.eTicket}
                        </h1>
                        <button
                            onClick={() => window.print()}
                            className="ml-auto text-green-500"
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-green-500 p-5 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-bold text-xl">
                                            {t.healthPass}
                                        </h2>
                                        <p className="text-sm opacity-90">
                                            {t.healthConfirmation}
                                        </p>
                                    </div>
                                    <Activity size={28} />
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-center mb-6">
                                    <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200">
                                        <img
                                            src="https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png"
                                            alt="QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500">
                                        {t.referenceId}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {screening.id}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center">
                                        <MapPin
                                            size={20}
                                            className="text-green-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.location}
                                            </p>
                                            <p className="font-medium">
                                                {screening.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Calendar
                                            size={20}
                                            className="text-green-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.date}
                                            </p>
                                            <p className="font-medium">
                                                {screening.date}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clock
                                            size={20}
                                            className="text-green-500 mr-3"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {t.time}
                                            </p>
                                            <p className="font-medium">
                                                {screening.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-4">
                                    <h3 className="font-medium text-gray-800 mb-3">
                                        {t.participants}
                                    </h3>
                                    <div className="space-y-2">
                                        {screening.participants.map(
                                            (participant, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                                        <User
                                                            size={16}
                                                            className="text-gray-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {participant.title ||
                                                                "Mr"}
                                                            .{" "}
                                                            {participant.name ||
                                                                "Unnamed"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {participant.age ||
                                                                "30"}{" "}
                                                            years
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-500 mr-2 flex-shrink-0"
                                        />
                                        <p className="text-sm text-green-800">
                                            {t.showTicket}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {t.issuedBy}
                                        </p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {t.issuingOrg}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {t.status}
                                        </p>
                                        <p className="text-sm font-medium text-green-600">
                                            {t.confirmed}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Fallback if screening not found
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="mr-2"
                    >
                        <ArrowLeft size={24} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">
                        {t.eTicket}
                    </h1>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-800 mb-2">
                        {language === "en"
                            ? "Ticket not found"
                            : language === "id"
                            ? "Tiket tidak ditemukan"
                            : "未找到票据"}
                    </h3>
                    <button
                        onClick={() => setCurrentScreen("home")}
                        className="text-green-500 mt-4"
                    >
                        {t.backToHome}
                    </button>
                </div>
            </div>
        );
    };

    const VideoPopup = ({ videoType = "map" }) => (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h3 className="font-bold text-lg">
                        {videoType === "map" 
                            ? t.ijenCraterExperience 
                            : t.registrationGuide}
                    </h3>
                    <button
                        onClick={() => setShowVideoPopup(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
                <div className="relative h-[50vh]">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={videoType === "map" 
                            ? "https://www.youtube.com/embed/eq1Lu4Lr19Y" // Kawah Ijen video
                            : "https://www.youtube.com/embed/t73EOoLtLFE" // Contoh video animasi panduan (bisa diganti)
                        }
                        title={videoType === "map" ? "Kawah Ijen Experience" : "Registration Guide"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
                {videoType === "guide" && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">
                            {language === "en" 
                                ? "Registration Steps Overview" 
                                : language === "id" 
                                    ? "Ringkasan Langkah Pendaftaran" 
                                    : "注册步骤概述"}
                        </h4>
                        <ol className="list-decimal pl-5 text-gray-700 space-y-1 text-sm">
                            <li>{t.step1Title} - {t.step1Desc}</li>
                            <li>{t.step2Title} - {t.step2Desc}</li>
                            <li>{t.step3Title} - {t.step3Desc}</li>
                            <li>{t.step4Title} - {t.step4Desc}</li>
                        </ol>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => {
                                    setShowVideoPopup(false);
                                    setCurrentScreen("form1");
                                }}
                                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {language === "en" ? "Start Registration Now" : language === "id" ? "Mulai Pendaftaran Sekarang" : "立即开始注册"}
                                <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const InfographicImagePopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h3 className="font-bold text-lg">
                        {language === "en" 
                            ? "Registration Process Flow" 
                            : language === "id" 
                                ? "Alur Proses Pendaftaran" 
                                : "注册流程"}
                    </h3>
                    <button
                        onClick={() => setShowInfographicImagePopup(false)}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
                <div className="p-4">
                    <img 
                        src="/assets/img/infografik2.png" 
                        alt="Registration Process Flow"
                        className="w-full h-auto rounded-lg" 
                    />
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            {language === "en" 
                                ? "This infographic shows the complete registration process from application to entering Kawah Ijen gate. Follow these steps for a smooth experience." 
                                : language === "id" 
                                    ? "Infografik ini menunjukkan proses pendaftaran lengkap dari aplikasi hingga memasuki gerbang Kawah Ijen. Ikuti langkah-langkah ini untuk pengalaman yang lancar."
                                    : "该信息图显示了从应用程序到进入伊真火山口大门的完整注册过程。按照这些步骤获得流畅的体验。"}
                        </p>
                        <button
                            onClick={() => {
                                setShowInfographicPopup(false);
                                setCurrentScreen("form1");
                            }}
                            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                        >
                            {language === "en" ? "Start Registration" : language === "id" ? "Mulai Pendaftaran" : "开始注册"}
                            <ChevronRight size={20} className="ml-2" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        // Show loading/onboarding for 1.5 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    
        // Clean up timer if component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this runs once on mount
    
    return (
        <div className="font-sans">
            <Head title="Online Submission" />
    
            {isLoading ? (
                // Show onboarding screen during loading period
                <OnboardingScreen />
            ) : (
                // After loading completed, show the appropriate screen based on currentScreen
                <>
                    {currentScreen === "home" && <HomeScreen />}
                    {currentScreen === "screening" && <ScreeningScreen />}
                    {currentScreen === "profile" && <ProfileScreen />}
                    {currentScreen === "form1" && <Form1Screen />}
                    {currentScreen === "form2" && (
                        <Form2Screen
                            participants={participants}
                            onParticipantChange={handleParticipantChange}
                            onAddParticipant={addParticipant}
                            onRemoveParticipant={removeParticipant}
                            onNext={() => setCurrentScreen("form3")}
                            onBack={() => setCurrentScreen("form1")}
                        />
                    )}
                    {currentScreen === "form3" && <Form3Screen />}
                    {currentScreen === "form5" && <Form5Screen />}
                    {currentScreen === "form6" && <Form6Screen />}
                    {currentScreen === "details" && <DetailScreen />}
                    {currentScreen === "partner" && <PartnerScreen />}
                    {currentScreen === "viewTicket" && <ViewTicketScreen />}
                    {currentScreen === "info" && <InfoScreen />}
                    {currentScreen === "success" && <SuccessScreen />}
                    {currentScreen === "onboarding" && <OnboardingScreen />}
                </>
            )}
    
            {/* Popups are shown regardless of loading state */}
            {showLoginPopup && <LoginPopup />}
            {showVideoPopup && <VideoPopup videoType={showingRegistrationVideo ? "guide" : "map"} />}
            {showInfographicPopup && <InfographicPopup />}
            {showInfographicImagePopup && <InfographicImagePopup />}
        </div>
    );
};

export default App;

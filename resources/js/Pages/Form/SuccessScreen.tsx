import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const SuccessScreen = ({ screening }) => {
    const { t } = useTranslation();
    
    const [countdown, setCountdown] = useState(5);
    
    // Check if payment method is "pay on the spot"
    const isPayOnSpot = screening?.payment_method === "spot";
    
    // Handle redirect to payment page or details page
    useEffect(() => {
        // If pay on spot, go directly to details
        if (screening) {
            if (isPayOnSpot) {
                const redirectTimer = setTimeout(() => {
                    window.location.href = route('screenings.show', screening.reference_id);
                }, 5000);
                
                return () => clearTimeout(redirectTimer);
            } 
            // If online payment and we have a payment URL
            else if (screening.payment_url) {
                const hasRedirected = sessionStorage.getItem("hasRedirectedToPayment") === "true";
                
                if (!hasRedirected) {
                    const redirectTimer = setTimeout(() => {
                        // Mark that we've redirected
                        sessionStorage.setItem("hasRedirectedToPayment", "true");
                        
                        // Redirect to payment page
                        window.location.href = screening.payment_url;
                    }, 5000);
                    
                    return () => clearTimeout(redirectTimer);
                } else {
                    // If we've already redirected, go to details page after countdown
                    const redirectTimer = setTimeout(() => {
                        window.location.href = route('screenings.show', screening.reference_id);
                    }, 5000);
                    
                    return () => clearTimeout(redirectTimer);
                }
            }
        }
    }, [screening, isPayOnSpot]);
    
    // Countdown effect
    useEffect(() => {
        if (countdown > 0) {
            const countdownInterval = setInterval(() => {
                setCountdown(prevCount => prevCount - 1);
            }, 1000);
            
            return () => clearInterval(countdownInterval);
        }
    }, [countdown]);
    
    const hasRedirected = sessionStorage.getItem("hasRedirectedToPayment") === "true";
    
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {t.submissionSuccessful}
            </h2>
            
            <p className="text-gray-600 mb-6 text-center">
                {t.screeningScheduledSuccessfully}
            </p>
            
            <div className="w-full max-w-sm bg-green-50 rounded-lg p-4 mb-6 text-center">
                <p className="text-green-700">
                    {isPayOnSpot
                        ? `${t.redirectingToDetails || "Redirecting to screening details in"} ${countdown} ${t.seconds}...`
                        : (hasRedirected
                            ? `${t.redirectingToDetails} ${countdown} ${t.seconds}...`
                            : `${t.redirectingToPayment} ${countdown} ${t.seconds}...`)
                    }
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(countdown / 5) * 100}%` }}
                    ></div>
                </div>
            </div>
            
            <Link 
                href={isPayOnSpot 
                    ? route('screenings.show', screening.reference_id)
                    : (hasRedirected 
                        ? route('screenings.show', screening.reference_id) 
                        : screening.payment_url || "#")
                }
                className="text-green-500 font-medium"
            >
                {isPayOnSpot 
                    ? (t.viewDetails || "View Details Now")
                    : (hasRedirected ? t.proceedNow : t.proceedToPaymentNow)
                }
            </Link>
        </div>
    );
};

export default SuccessScreen;
import React, { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, DollarSign, CreditCard, Smartphone, Star } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import LoginModal from "../../components/Modals/LoginModal";

const PaymentSummary = ({ data, setData, errors, isProcessing, onSubmit, onBack, auth }) => {
    const { t } = useTranslation();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Constants for fee calculation
    const SCREENING_FEE = 35000; // 35,000 IDR per participant
    const SERVICE_FEE = 0;    // 5,000 IDR service fee
    
    // Calculate total
    const calculateTotal = () => {
        return (SCREENING_FEE * data.participants.length) + SERVICE_FEE;
    };

    // Handle form submission with auth check
    const handleSubmit = () => {
        // If user is not logged in, show login popup
        if (!auth?.user && data.terms_agreed) {
            setShowLoginPopup(true);
            return;
        }
        
        // If user is logged in, proceed with submission
        setIsSubmitting(true);
        onSubmit();
    };
    
    // Handle successful login
    const handleLoginSuccess = () => {
        console.log('Login success - submitting form directly');
        
        // Hide popup and set state
        setShowLoginPopup(false);
        setIsSubmitting(true);
        
        // DIRECT SUBMIT with minimal delay
        setTimeout(() => {
            console.log('Calling onSubmit function');
            onSubmit();
        }, 50);
    };
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button onClick={onBack} className="mr-2">
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
                            {data.location_name || "Selected Location"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.date}</span>
                        <span className="font-medium">{data.date}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">{t.time}</span>
                        <span className="font-medium">
                            {data.time_slot_start && data.time_slot_end 
                                ? `${data.time_slot_start} - ${data.time_slot_end}` 
                                : "Selected Time"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <span className="text-gray-700">
                            {t.participants}
                        </span>
                        <span className="font-medium">
                            {data.participants.length}
                        </span>
                    </div>

                    <h2 className="font-bold text-lg my-4 text-gray-800">
                        {t.payment}
                    </h2>

                    <div className="space-y-3 mb-4">
                        {/* Pay on the Spot Option - Enhanced with highlights */}
                        <div className="relative mb-6">
                            {/* Recommended Badge */}
                            <div className="absolute -top-2 -right-2 z-10">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg">
                                    <Star size={12} className="mr-1 fill-white" />
                                    {t.noCharge}
                                </div>
                            </div>
                            
                            <div
                                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                    data.payment_method === "spot" 
                                        ? "bg-gradient-to-r from-green-50 to-green-100 border-green-500 shadow-lg scale-105" 
                                        : "bg-white border-green-300 hover:border-green-400 hover:shadow-md"
                                }`}
                                onClick={() => setData('payment_method', 'spot')}
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                    {data.payment_method === "spot" && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {t.payOnSpot || "Pay on the Spot"}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {t.payAtLocation || "Pay cash at the screening location"}
                                    </p>
                                    <div className="flex items-center text-green-600">
                                        <span className="text-xs font-medium">
                                            {t.noOnlineFees || "No online processing fees"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <DollarSign size={24} className="text-green-500 mb-1" />
                                </div>
                            </div>
                        </div>

                        {/* Divider with text */}
                        <div className="flex items-center mb-7">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-3 text-sm text-gray-500 bg-white">
                                {t.orPayOnline || "Or pay online"}
                            </span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Credit/Debit Card Option */}
                        <div
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'card')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "card" && (
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
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                                    alt="Mastercard"
                                    className="h-8 w-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* QRIS Option */}
                        <div
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'qris')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "qris" && (
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
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'ovo')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "ovo" && (
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
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'bni')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "bni" && (
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
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'bri')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "bri" && (
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
                            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer opacity-75"
                            onClick={() => setData('payment_method', 'mandiri')}
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                                {data.payment_method === "mandiri" && (
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
                        
                        {errors.payment_method && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.payment_method}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">
                                {t.screeningFee}
                            </span>
                            <span>
                                Rp {SCREENING_FEE.toLocaleString()} x{" "}
                                {data.participants.length}
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
                            onClick={() => setData('terms_agreed', !data.terms_agreed)}
                        >
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    checked={data.terms_agreed}
                                    onChange={() => setData('terms_agreed', !data.terms_agreed)}
                                    className="w-4 h-4 border border-gray-300 rounded accent-green-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label className="text-gray-700">
                                    {t.agreeToTerms}
                                    <a href={route('terms')} className="text-green-500 hover:underline ml-1">
                                        {t.terms}
                                    </a>
                                    {t.and}
                                    <a href={route('privacy')} className="text-green-500 hover:underline ml-1">
                                        {t.privacy}
                                    </a>
                                </label>
                            </div>
                        </div>
                        {errors.terms_agreed && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.terms_agreed}
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        className={`w-full ${
                            data.terms_agreed && data.payment_method
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-500"
                        } py-3 rounded-xl font-medium`}
                        disabled={!data.terms_agreed || !data.payment_method || isSubmitting || isProcessing}
                    >
                        {isSubmitting || isProcessing ? (
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
            
            {/* Login Modal for unauthenticated users */}
            {showLoginPopup && (
                <LoginModal
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={handleLoginSuccess}
                    isProcessing={isSubmitting}
                />
            )}
        </div>
    );
};

export default PaymentSummary;
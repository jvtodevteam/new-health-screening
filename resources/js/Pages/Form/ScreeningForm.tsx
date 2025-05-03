import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Layout from "../Layout";
import LocationSelection from "./LocationSelection";
import ParticipantInfo from "./ParticipantInfo";
import PaymentSummary from "./PaymentSummary";
import SuccessScreen from "./SuccessScreen";
import { useTranslation } from "../../hooks/useTranslation";

// Updated to match new database structure and handle the updated form flow
const ScreeningForm = ({ cities, nationalities, initialTimeSlots, auth }) => {
    const { t } = useTranslation();
    const [formStep, setFormStep] = useState(1);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // Use Inertia form helper for form handling
    const { data, setData, post, processing, errors } = useForm({
        location_id: "",
        date: new Date().toISOString().split("T")[0],
        time_slot_id: "",
        participants: [
            {
                title: "Mr",
                name: "",
                birth_year: "",
                nationality_id: "",
                id_number: "",
                has_medical_history: false,
                allergies: "",
                past_medical_history: "",
                current_medications: "",
                family_medical_history: "",
            },
        ],
        payment_method: "",
        terms_agreed: false,
    });
    
    // Check for Google login redirect and authentication status on component mount
    useEffect(() => {
        // Check if this is a redirect from Google login with successful auth
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth_success');
        
        if (authSuccess === 'true' && formStep === 3) {
            // User was redirected back after successful authentication
            // We'll clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            // Now handle form submission if we're on the payment step
            handleSubmitAfterAuth();
        }
    }, []);
    
    // Function to handle form submission
// Function to handle form submission
const handleSubmit = () => {
    console.log('Form submission handler called');
    setIsProcessingPayment(true);
    
    // Submit the form data
    post('/screenings', {
        onSuccess: () => {
            console.log('Form submission successful');
            setFormStep(4); // Go to success screen
            setIsProcessingPayment(false);
        },
        onError: (errors) => {
            console.log('Form submission error:', errors);
            setIsProcessingPayment(false);
        }
    });
};
    
    // Special handler for when form is submitted after authentication redirect
    const handleSubmitAfterAuth = () => {
        setIsProcessingPayment(true);
        post('/screenings', {
            onSuccess: () => {
                setFormStep(4); // Go to success screen
                setIsProcessingPayment(false);
            },
            onError: () => {
                setIsProcessingPayment(false);
            }
        });
    };
    
    // Render different form steps based on current step
    const renderFormStep = () => {
        // Scroll to top whenever step changes
        React.useEffect(() => {
            window.scrollTo(0, 0);
        }, [formStep]);
        
        switch (formStep) {
            case 1:
                return (
                    <LocationSelection 
                        data={data}
                        setData={setData}
                        errors={errors} 
                        cities={cities}
                        initialTimeSlots={initialTimeSlots}
                        onNext={() => {
                            window.scrollTo(0, 0);
                            setFormStep(2);
                        }}
                    />
                );
                
            case 2:
                return (
                    <ParticipantInfo 
                        data={data}
                        setData={setData}
                        nationalities={nationalities}
                        errors={errors}
                        onNext={() => {
                            window.scrollTo(0, 0);
                            setFormStep(3);
                        }}
                        onBack={() => {
                            window.scrollTo(0, 0);
                            setFormStep(1);
                        }}
                    />
                );
                
            case 3:
                return (
                    <PaymentSummary
                        data={data}
                        setData={setData}
                        errors={errors}
                        isProcessing={isProcessingPayment}
                        onSubmit={handleSubmit}
                        onBack={() => {
                            window.scrollTo(0, 0);
                            setFormStep(2);
                        }}
                        auth={auth} // Pass auth object to PaymentSummary
                    />
                );
                
            case 4:
                return <SuccessScreen />;
                
            default:
                return <LocationSelection 
                    data={data}
                    setData={setData}
                    errors={errors} 
                    cities={cities}
                    initialTimeSlots={initialTimeSlots}
                    onNext={() => {
                        window.scrollTo(0, 0);
                        setFormStep(2);
                    }}
                />;
        }
    };    
    return (
        <Layout>
            <Head title={`${t.healthScreening} - ${t[`step${formStep}Title`]}`} />
            
            {renderFormStep()}
        </Layout>
    );
};

export default ScreeningForm;
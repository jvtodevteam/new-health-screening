import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Layout from "../../Layout";
import LocationSelection from "./LocationSelection";
import ParticipantInfo from "./ParticipantInfo";
import PaymentSummary from "./PaymentSummary";
import SuccessScreen from "./SuccessScreen";
import LoginModal from "../../components/Modals/LoginModal";
import { useTranslation } from "../../hooks/useTranslation";

const ScreeningForm = ({ locations, timeSlots, auth }) => {
    const { t } = useTranslation();
    const [formStep, setFormStep] = useState(1);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
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
                nationality: "",
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
    
    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!auth.user && data.terms_agreed) {
            setShowLoginPopup(true);
            return;
        }
        
        setIsProcessingPayment(true);
        post(route('screenings.store'), {
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
        switch (formStep) {
            case 1:
                return (
                    <LocationSelection 
                        data={data}
                        setData={setData}
                        errors={errors} 
                        locations={locations}
                        timeSlots={timeSlots}
                        onNext={() => setFormStep(2)}
                    />
                );
                
            case 2:
                return (
                    <ParticipantInfo 
                        data={data}
                        setData={setData}
                        errors={errors}
                        onNext={() => setFormStep(3)}
                        onBack={() => setFormStep(1)}
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
                        onBack={() => setFormStep(2)}
                    />
                );
                
            case 4:
                return <SuccessScreen />;
                
            default:
                return <LocationSelection />;
        }
    };
    
    return (
        <Layout>
            <Head title={`${t.healthScreening} - ${t[`step${formStep}Title`]}`} />
            
            {renderFormStep()}
            
            {showLoginPopup && (
                <LoginModal 
                    onClose={() => setShowLoginPopup(false)}
                    onLogin={() => handleSubmit()}
                    isProcessing={isProcessingPayment}
                />
            )}
        </Layout>
    );
};

export default ScreeningForm;
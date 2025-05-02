import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { ArrowLeft, X, CheckCircle, MapPin, Upload } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const PartnerApplicationForm = ({ onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        business_name: "",
        business_type: "Health Center",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        reason: "",
        document: null, // For file upload
        location: { lat: null, lng: null },
    });

    const handleSubmit = () => {
        post(route('partners.store'), {
            onSuccess: () => {
                setIsSuccess(true);
                // Auto close after success
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        });
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
    
    const canProceedStep1 = () => {
        return data.business_name && data.contact_person && data.email && data.phone;
    };
    
    const canProceedStep2 = () => {
        return data.address && data.reason;
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
                        {t.becomePartner}
                    </h2>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>

                {/* Progress indicator */}
                <div className="px-4 pt-2">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-500">
                            {t.businessDetails}
                        </span>
                        <span className="text-xs text-gray-500">
                            {t.locationDocs}
                        </span>
                        <span className="text-xs text-gray-500">
                            {t.review}
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
                                    {t.businessName} *
                                </label>
                                <input
                                    type="text"
                                    value={data.business_name}
                                    onChange={(e) => setData('business_name', e.target.value)}
                                    className={`w-full border ${errors.business_name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    placeholder={t.businessNamePlaceholder}
                                    required
                                />
                                {errors.business_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.businessType} *
                                </label>
                                <select
                                    value={data.business_type}
                                    onChange={(e) => setData('business_type', e.target.value)}
                                    className={`w-full border ${errors.business_type ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    required
                                >
                                    <option value="Health Center">{t.healthCenter}</option>
                                    <option value="Medical Clinic">{t.medicalClinic}</option>
                                    <option value="Hospital">{t.hospital}</option>
                                    <option value="Private Practice">{t.privatePractice}</option>
                                    <option value="Other">{t.other}</option>
                                </select>
                                {errors.business_type && (
                                    <p className="text-red-500 text-xs mt-1">{errors.business_type}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.contactPerson} *
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    className={`w-full border ${errors.contact_person ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    placeholder={t.fullName}
                                    required
                                />
                                {errors.contact_person && (
                                    <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.emailAddress} *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    placeholder="email@example.com"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.phoneNumber} *
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    placeholder="+62..."
                                    required
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <button
                                onClick={handleNext}
                                className={`w-full ${
                                    canProceedStep1() 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-300 text-gray-500'
                                } py-3 rounded-xl font-medium mt-4`}
                                disabled={!canProceedStep1()}
                            >
                                {t.next}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.businessAddress} *
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    rows={3}
                                    placeholder={t.addressPlaceholder}
                                    required
                                ></textarea>
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.pinLocation}
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
                                {errors.location && (
                                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.whyPartner} *
                                </label>
                                <textarea
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3`}
                                    rows={3}
                                    placeholder={t.partnerInterest}
                                    required
                                ></textarea>
                                {errors.reason && (
                                    <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.uploadDocs}
                                </label>
                                <div 
                                    className={`border-2 border-dashed ${errors.document ? 'border-red-300' : 'border-gray-300'} rounded-lg p-6 flex flex-col items-center`}
                                    onClick={() => document.getElementById('document-upload').click()}
                                >
                                    <input
                                        id="document-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setData('document', e.target.files[0])}
                                    />
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                        <Upload
                                            size={24}
                                            className="text-green-500"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 text-center mb-2">
                                        {t.licensePermit}
                                    </p>
                                    <p className="text-xs text-gray-400 text-center">
                                        {t.fileTypes}
                                    </p>
                                </div>
                                {errors.document && (
                                    <p className="text-red-500 text-xs mt-1">{errors.document}</p>
                                )}
                            </div>

                            <button
                                onClick={handleNext}
                                className={`w-full ${
                                    canProceedStep2() 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-300 text-gray-500'
                                } py-3 rounded-xl font-medium mt-4`}
                                disabled={!canProceedStep2()}
                            >
                                {t.next}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-800 mb-1">
                                {t.reviewInfo}
                            </h3>

                            <div className="p-4 bg-green-50 rounded-lg mb-4">
                                <p className="text-sm text-green-800 mb-2">
                                    {t.reviewNotice}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.businessName}
                                    </span>
                                    <span className="font-medium">
                                        {data.business_name}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.businessType}
                                    </span>
                                    <span className="font-medium">
                                        {data.business_type}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.contactPerson}
                                    </span>
                                    <span className="font-medium">
                                        {data.contact_person}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.email}
                                    </span>
                                    <span className="font-medium">
                                        {data.email}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.phone}
                                    </span>
                                    <span className="font-medium">
                                        {data.phone}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.address}
                                    </span>
                                    <span className="font-medium text-right flex-1 ml-4">
                                        {data.address}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        {t.document}
                                    </span>
                                    <span className="font-medium">
                                        {data.document ? data.document.name : t.noDocumentUploaded}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-green-500 text-white py-3 rounded-xl font-medium mb-3"
                                    disabled={processing || isSuccess}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                            {t.processing}
                                        </span>
                                    ) : isSuccess ? (
                                        <span className="flex items-center justify-center">
                                            <CheckCircle
                                                size={18}
                                                className="mr-2"
                                            />
                                            {t.applicationSubmitted}
                                        </span>
                                    ) : (
                                        t.submitApplication
                                    )}
                                </button>

                                <button
                                    onClick={handleBack}
                                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                                    disabled={processing || isSuccess}
                                >
                                    {t.back}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerApplicationForm;
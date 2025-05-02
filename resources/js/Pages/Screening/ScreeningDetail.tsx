import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "../Layout";
import { useTranslation } from "../hooks/useTranslation";

const ScreeningDetail = ({ screening }) => {
    const { t } = useTranslation();
    
    // Constants for fee calculation
    const SCREENING_FEE = 35000; // 35,000 IDR per participant
    const SERVICE_FEE = 5000;    // 5,000 IDR service fee
    
    return (
        <Layout>
            <Head title={`${t.screeningDetails} #${screening.reference_id}`} />
            
            <div className="bg-white p-4 flex items-center shadow-sm">
                <Link href={route('screenings.index')} className="mr-2">
                    <ArrowLeft size={24} className="text-gray-800" />
                </Link>
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
                                {screening.reference_id}
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

                        {screening.payment_method && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-700">
                                    {t.payment}
                                </span>
                                <span className="font-medium">
                                    {screening.payment_method.toUpperCase()}
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
                                    {participant.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {participant.age} {t.years}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {participant.has_medical_history
                                    ? participant.allergies
                                        ? `${t.allergies}: ${participant.allergies}`
                                        : t.hasMedicalHistory
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
                                Rp {screening.total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    
                    {screening.status === 'pending' ? (
                        <a
                        
                            href={screening.payment_url}
                            className="w-full block text-center bg-green-500 text-white py-3 rounded-xl font-medium"
                            target="_blank"
                        >
                            {t.proceedToPayment}
                        </a>
                    ) : (
                        <Link
                            href={route('screenings.ticket', screening.id)}
                            className="w-full block text-center bg-green-500 text-white py-3 rounded-xl font-medium"
                        >
                            {t.viewETicket}
                        </Link>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ScreeningDetail;
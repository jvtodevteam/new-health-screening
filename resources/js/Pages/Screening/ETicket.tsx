import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Download, Activity, MapPin, Calendar, Clock, CheckCircle, User, LogOut } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const ETicket = ({ screening }) => {
    const { t } = useTranslation();
    
    const handlePrint = () => {
        window.print();
    };
    
    return (
        <div className="min-h-screen bg-green-600">
            <Head title={t.eTicket} />
            
            <div className="bg-white p-4 flex items-center shadow-sm">
                <Link
                    href={route('screenings.show', screening.id)}
                    className="mr-2"
                >
                    <ArrowLeft size={24} className="text-gray-800" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">
                    {t.eTicket}
                </h1>
                <button
                    onClick={handlePrint}
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
                                {/* QR Code - In a real implementation, generate this from the reference ID */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${screening.reference_id}`}
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
                                {screening.reference_id}
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
                                                    {participant.title}.{" "}
                                                    {participant.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {participant.age} {t.years}
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
};

export default ETicket;
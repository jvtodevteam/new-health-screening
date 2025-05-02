import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Clock, CheckCircle, Calendar, MapPin, Plus, FileText } from "lucide-react";
import Layout from "../Layout";
import { useTranslation } from "../../hooks/useTranslation";

const ScreeningList = ({ screenings }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("pending");
    
    // Filter screenings based on active tab
    const filteredScreenings = screenings.filter(item => item.status === activeTab)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return (
        <Layout>
            <Head title={t.healthScreening} />
            
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
                    {screenings.filter(item => item.status === "pending").length > 0 && (
                        <span className="ml-2 bg-white text-green-500 text-xs rounded-full px-2 py-0.5">
                            {screenings.filter(item => item.status === "pending").length}
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
                    {screenings.filter(item => item.status === "complete").length > 0 && (
                        <span className="ml-2 bg-white text-green-500 text-xs rounded-full px-2 py-0.5">
                            {screenings.filter(item => item.status === "complete").length}
                        </span>
                    )}
                </button>
            </div>
            
            <div className="px-4 py-2">
                {filteredScreenings.length > 0 ? (
                    filteredScreenings.map((screening) => (
                        <div
                            key={screening.id}
                            className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {screening.participants[0]?.name || "Unnamed"}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {screening.date} • {screening.participants.length}{" "}
                                            {screening.participants.length > 1 ? t.participants : t.participant}
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
                                        <Calendar size={14} className="mr-1" />{" "}
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
                            <Link
                                href={route('screenings.show', screening.id)}
                                className="w-full flex justify-center items-center py-2 mt-2 text-green-500 text-sm font-medium hover:bg-green-50 rounded-lg transition-colors"
                            >
                                {t.viewDetails}
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            {activeTab === "pending" ? (
                                <Clock size={24} className="text-gray-400" />
                            ) : (
                                <CheckCircle size={24} className="text-gray-400" />
                            )}
                        </div>
                        <h3 className="font-medium text-gray-800 mb-1">
                            {t.noScreeningsInTab}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {t.scheduleHealthScreening}
                        </p>
                        <Link
                            href={route('screenings.create')}
                            className="text-green-500 text-sm font-medium"
                        >
                            {t.startHealthCheck} →
                        </Link>
                    </div>
                )}
            </div>
            
            <Link
                href={route('screenings.create')}
                className="fixed right-6 bottom-20 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg text-white"
            >
                <Plus size={24} />
            </Link>
        </Layout>
    );
};

export default ScreeningList;
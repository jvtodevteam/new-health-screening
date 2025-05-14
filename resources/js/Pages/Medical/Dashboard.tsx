import React from 'react';
import { Head } from '@inertiajs/react';
import MedicalLayout from '@/Layouts/MedicalLayout';
import { Info,Calendar, Users, CheckSquare, Clock, Activity, CheckCircle, FileText } from 'lucide-react';

export default function Dashboard({ medicalStaff, location, screeningsCount, participantsCount, examinedCount, progressPercentage }) {
    // Format date in Indonesian
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Format time for last update
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}.${minutes}`;

    return (
        <MedicalLayout>
            <Head title="Dashboard Petugas Medis" />
            
            {/* Date Display */}
            <div className="flex items-center mb-4 text-sm text-blue-600">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{formattedDate}</span>
            </div>
            
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Peserta Menunggu Card */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-4 md:p-5">
                        <div className="flex items-center">
                            <div className="mr-4 flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                                <Info className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Peserta Menunggu</h3>
                                <p className="text-3xl font-bold">{participantsCount - examinedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 border-t border-blue-100">
                        <p className="text-sm text-blue-700">Menunggu pemeriksaan</p>
                    </div>
                </div>
                {/* Peserta Diperiksa Card */}

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-4 md:p-5">
                        <div className="flex items-center">
                            <div className="mr-4 flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                <CheckSquare className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Peserta Diperiksa</h3>
                                <p className="text-3xl font-bold">{examinedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 border-t border-green-100">
                        <p className="text-sm text-green-700">Selesai pemeriksaan</p>
                    </div>
                </div>
            </div>
            
            {/* Progress Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">Progress Pemeriksaan</h2>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>Update terakhir: {formattedTime}</span>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Persentase peserta diperiksa</span>
                        <span className="text-sm font-medium text-blue-600">{progressPercentage}%</span>
                    </div>
                    <div className="overflow-hidden h-2.5 rounded-full bg-gray-200">
                        <div 
                            style={{ width: `${progressPercentage}%` }} 
                            className={`h-full rounded-full ${
                                progressPercentage < 30 ? 'bg-red-500' : 
                                progressPercentage < 70 ? 'bg-yellow-500' : 
                                'bg-green-500'
                            } transition-all duration-500 ease-in-out`}
                        ></div>
                    </div>
                </div>
                
                {/* Stats Pills */}
                <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        <span>Diperiksa: {examinedCount}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                        <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Menunggu: {participantsCount - examinedCount}</span>
                    </div>
                </div>
            </div>
            
            {/* Staff Info Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3">
                    <h3 className="text-white font-medium flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Informasi Petugas
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    <div className="px-4 py-3 flex items-center">
                        <div className="text-gray-500 w-24 flex-shrink-0">Username</div>
                        <div className="font-medium ml-2">{medicalStaff.username}</div>
                    </div>
                    <div className="px-4 py-3 flex items-center">
                        <div className="text-gray-500 w-24 flex-shrink-0">Lokasi</div>
                        <div className="font-medium ml-2">{location.name}</div>
                    </div>
                    <div className="px-4 py-3 flex items-center">
                        <div className="text-gray-500 w-24 flex-shrink-0">Kontak</div>
                        <div className="font-medium ml-2">{medicalStaff.phone || '-'}</div>
                    </div>
                </div>
            </div>
        </MedicalLayout>
    );
}
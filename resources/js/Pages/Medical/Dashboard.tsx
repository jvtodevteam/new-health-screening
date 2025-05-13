import React from 'react';
import { Head } from '@inertiajs/react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function Dashboard({ medicalStaff, location, screeningsCount, participantsCount, examinedCount, progressPercentage }) {
    return (
        <MedicalLayout>
            <Head title="Dashboard Petugas Medis" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                
                <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Informasi Petugas
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Username</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{medicalStaff.username}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{location.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Kontak</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{medicalStaff.phone}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
                
                <div className="mt-8 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Ringkasan Hari Ini
                        </h3>
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Pemeriksaan</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{screeningsCount}</dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Peserta</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{participantsCount}</dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Peserta Diperiksa</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{examinedCount}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500">Progress Pemeriksaan Hari Ini</h4>
                            <div className="mt-2">
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                        <div 
                                            style={{ width: `${progressPercentage}%` }} 
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                        ></div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold inline-block text-indigo-500">
                                            {progressPercentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MedicalLayout>
    );
}
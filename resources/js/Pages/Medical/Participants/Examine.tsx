import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function ParticipantExamine({ participant, screening }) {
    const { data, setData, post, processing, errors } = useForm({
        systolic_blood_pressure: participant.systolic_blood_pressure || '',
        diastolic_blood_pressure: participant.diastolic_blood_pressure || '',
        heart_rate: participant.heart_rate || '',
        temperature: participant.temperature || '',
        respiratory_rate: participant.respiratory_rate || '',
        oxygen_saturation: participant.oxygen_saturation || '',
    });
    
    const isReadOnly = !!participant.examined_at;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isReadOnly) return;
        
        post(route('medical.participants.examination.store', participant.id));
    };
    
    return (
        <MedicalLayout>
            <Head title={`Pemeriksaan ${participant.name}`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Pemeriksaan Peserta</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Pemeriksaan untuk peserta: {participant.name}
                        </p>
                    </div>
                </div>
                
                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Data Peserta
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Nama</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Usia</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.age} tahun</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.gender}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Kebangsaan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.nationality}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Nomor ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.id_number}</dd>
                            </div>
                            
                            {participant.has_medical_history && (
                                <>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Alergi</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.allergies || '-'}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Riwayat Penyakit</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.past_medical_history || '-'}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Obat-obatan</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.current_medications || '-'}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Riwayat Keluarga</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{participant.family_medical_history || '-'}</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-8 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Hasil Pemeriksaan
                        </h3>
                        
                        {isReadOnly && (
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Pemeriksaan telah dilakukan pada {new Date(participant.examined_at).toLocaleString('id-ID')}</p>
                            </div>
                        )}
                        
                        <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="systolic_blood_pressure" className="block text-sm font-medium text-gray-700">
                                    Tekanan Darah Sistolik (mmHg)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="systolic_blood_pressure"
                                        id="systolic_blood_pressure"
                                        value={data.systolic_blood_pressure}
                                        onChange={(e) => setData('systolic_blood_pressure', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="60"
                                        max="250"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.systolic_blood_pressure && (
                                    <p className="mt-2 text-sm text-red-600">{errors.systolic_blood_pressure}</p>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="diastolic_blood_pressure" className="block text-sm font-medium text-gray-700">
                                    Tekanan Darah Diastolik (mmHg)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="diastolic_blood_pressure"
                                        id="diastolic_blood_pressure"
                                        value={data.diastolic_blood_pressure}
                                        onChange={(e) => setData('diastolic_blood_pressure', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="40"
                                        max="150"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.diastolic_blood_pressure && (
                                    <p className="mt-2 text-sm text-red-600">{errors.diastolic_blood_pressure}</p>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700">
                                    Denyut Jantung (bpm)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="heart_rate"
                                        id="heart_rate"
                                        value={data.heart_rate}
                                        onChange={(e) => setData('heart_rate', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="40"
                                        max="220"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.heart_rate && (
                                    <p className="mt-2 text-sm text-red-600">{errors.heart_rate}</p>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                                    Suhu Tubuh (°C)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="temperature"
                                        id="temperature"
                                        value={data.temperature}
                                        onChange={(e) => setData('temperature', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="35"
                                        max="42"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.temperature && (
                                    <p className="mt-2 text-sm text-red-600">{errors.temperature}</p>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700">
                                    Tingkat Pernapasan (napas/menit)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="respiratory_rate"
                                        id="respiratory_rate"
                                        value={data.respiratory_rate}
                                        onChange={(e) => setData('respiratory_rate', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="8"
                                        max="60"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.respiratory_rate && (
                                    <p className="mt-2 text-sm text-red-600">{errors.respiratory_rate}</p>
                                )}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="oxygen_saturation" className="block text-sm font-medium text-gray-700">
                                    Saturasi Oksigen (%)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="oxygen_saturation"
                                        id="oxygen_saturation"
                                        value={data.oxygen_saturation}
                                        onChange={(e) => setData('oxygen_saturation', e.target.value)}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        disabled={isReadOnly}
                                        min="70"
                                        max="100"
                                        required={!isReadOnly}
                                    />
                                </div>
                                {errors.oxygen_saturation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.oxygen_saturation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <Link
                            href={route('medical.screenings.show', screening.id)}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                        >
                            Kembali
                        </Link>
                        
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Hasil'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </MedicalLayout>
    );
}
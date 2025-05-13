// File: Pages/Medical/Screenings/Index.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function ScreeningsIndex({ screenings, date, location }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(date);
    
    const filteredScreenings = screenings.filter(screening => 
        screening.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screening.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        window.location.href = route('medical.screenings.index', { date: newDate });
    };
    
    return (
        <MedicalLayout>
            <Head title="Daftar Pemeriksaan" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Daftar Pemeriksaan</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Daftar pemeriksaan di {location.name} pada tanggal {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-64">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Cari</label>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Cari berdasarkan ID atau nama"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                ID Referensi
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Waktu
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Nama Pendaftar
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Jumlah Peserta
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Progress
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredScreenings.length > 0 ? (
                                            filteredScreenings.map((screening) => (
                                                <tr key={screening.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {screening.reference_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {screening.time}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {screening.user_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {screening.examined_count} / {screening.participants_count}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div 
                                                                    style={{ width: `${(screening.examined_count / screening.participants_count) * 100}%` }} 
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <Link
                                                            href={route('medical.screenings.show', screening.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                                                    Tidak ada pemeriksaan pada tanggal ini atau dengan kata kunci tersebut.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MedicalLayout>
    );
}
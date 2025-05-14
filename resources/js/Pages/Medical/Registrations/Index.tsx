import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Search, 
  Edit, 
  Users, 
  Calendar, 
  Filter, 
  X, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function RegistrationIndex({ registrations, currentDate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(currentDate);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    
    // Format date for display
    const formatDateDisplay = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };
    
    // Format date for input value
    const formatDateValue = (dateString) => {
        return dateString;
    };
    
    // Handler untuk form submission
    const handleGroupExamSubmit = (e) => {
        e.preventDefault();
        window.location.href = route('medical.registrations.group', { reference_id: referenceId });
    };
    
    const filteredRegistrations = registrations.filter(reg => {
        const searchLower = searchTerm.toLowerCase();
        return (
            reg.reference_id.toLowerCase().includes(searchLower) ||
            reg.patient_name.toLowerCase().includes(searchLower) ||
            reg.screening_date.includes(searchTerm)
        );
    });
    
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDateFilter(newDate);
        window.location.href = route('medical.registrations.index', { date: newDate });
    };
    
    // Count stats
    const totalPatients = filteredRegistrations.length;
    const examinedPatients = filteredRegistrations.filter(reg => reg.has_examination).length;
    const pendingPatients = totalPatients - examinedPatients;
    
    return (
        <MedicalLayout>
            <Head title="Pendaftaran Pemeriksaan" />
            
            <div className="space-y-4">
                {/* Header and action button */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-blue-600" />
                            Pendaftaran Pemeriksaan
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Daftar pasien yang telah mendaftar untuk pemeriksaan
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Pemeriksaan Group
                    </button>
                </div>
                
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500">Menunggu Pemeriksaan</div>
                        <div className="mt-1 text-2xl font-bold text-gray-900">{totalPatients}</div>
                    </div>
                </div>
                
                {/* Search and filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
                            <h2 className="text-base font-medium text-gray-900">Filter & Pencarian</h2>
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="text-gray-500 hover:text-blue-600 focus:outline-none"
                        >
                            {isFilterOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <ChevronRight className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    
                    {isFilterOpen && (
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemeriksaan</label>
                                <div className="flex items-center">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            value={formatDateValue(dateFilter)}
                                            onChange={handleDateChange}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Pasien</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Cari berdasarkan ID, nama, atau tanggal"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Register list (card view mobile, table view desktop) */}
                <div className="space-y-3 md:hidden">
                    {filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map((reg) => (
                            <div key={reg.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">{reg.patient_name}</h3>
                                            <div className="mt-1 text-sm text-gray-500">{reg.reference_id}</div>
                                        </div>
                                        {reg.has_examination ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Sudah Diperiksa
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Belum Diperiksa
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center text-gray-500">
                                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                            {reg.screening_date}
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                                            {reg.age} tahun
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                                    <Link
                                        href={route('medical.registrations.edit', reg.id)}
                                        className="flex items-center justify-center w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        <Edit className="h-4 w-4 mr-1.5" />
                                        {reg.has_examination ? 'Lihat/Edit Detail' : 'Periksa Pasien'}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <h3 className="text-base font-medium text-gray-900">Tidak ada data</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Tidak ada data pendaftaran yang ditemukan.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Table view for desktop */}
                <div className="hidden md:block">
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID Referensi
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Pasien
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usia
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Pemeriksaan
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRegistrations.length > 0 ? (
                                        filteredRegistrations.map((reg) => (
                                            <tr key={reg.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {reg.reference_id}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {reg.patient_name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {reg.age} tahun
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {reg.screening_date}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {reg.has_examination ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Sudah Diperiksa
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Belum Diperiksa
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('medical.registrations.edit', reg.id)}
                                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        {reg.has_examination ? 'Lihat/Edit' : 'Periksa'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-sm text-gray-500 text-center">
                                                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                                Tidak ada data pendaftaran yang ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal for Group Examination */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center md:block md:p-0">
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                            aria-hidden="true"
                            onClick={() => setIsModalOpen(false)}
                        ></div>
                        
                        <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:my-8 md:align-middle md:max-w-lg md:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <div className="bg-white p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="ml-3 text-lg font-medium text-gray-900" id="modal-title">
                                        Pemeriksaan Group
                                    </h3>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Masukkan Kode Registrasi untuk mengakses pemeriksaan group.
                                    </p>
                                </div>
                                
                                <form onSubmit={handleGroupExamSubmit} className="mt-4">
                                    <div className="mb-4">
                                        <label htmlFor="reference_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Kode Registrasi
                                        </label>
                                        <input
                                            type="text"
                                            name="reference_id"
                                            id="reference_id"
                                            value={referenceId}
                                            onChange={(e) => setReferenceId(e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            placeholder="Masukkan kode registrasi"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mt-6 flex flex-col-reverse md:flex-row md:justify-end md:space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="mt-3 md:mt-0 w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Lanjutkan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MedicalLayout>
    );
}
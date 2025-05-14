import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Edit, 
  Search, 
  QrCode, 
  Users, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Filter,
  X,
  SlidersHorizontal
} from 'lucide-react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function RegistrationGroup({ screening, participants }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterGender, setFilterGender] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Filter participants berdasarkan pencarian dan filter
    const filteredParticipants = participants.filter(participant => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            participant.name.toLowerCase().includes(searchLower) ||
            participant.age.toString().includes(searchTerm) ||
            (participant.title === 'Mr' ? 'laki-laki' : 'perempuan').includes(searchLower);
            
        const matchesGender = filterGender === 'all' || 
            (filterGender === 'male' && participant.title === 'Mr') ||
            (filterGender === 'female' && participant.title === 'Mrs');
            
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'examined' && participant.examined) || 
            (filterStatus === 'unexamined' && !participant.examined);
            
        return matchesSearch && matchesGender && matchesStatus;
    });
    
    // Reset filters
    const resetFilters = () => {
        setFilterGender('all');
        setFilterStatus('all');
    };
    
    // Hitung statistik
    const examinedCount = participants.filter(p => p.examined).length;
    const totalCount = participants.length;
    const progressPercentage = totalCount > 0 ? Math.round((examinedCount / totalCount) * 100) : 0;
    const pendingCount = totalCount - examinedCount;
    
    return (
        <MedicalLayout>
            <Head title={`Pemeriksaan Group - ${screening.reference_id}`} />
            
            <div className="space-y-5">
                {/* Back button and title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link
                            href={route('medical.registrations.index')}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="mt-2 text-xl font-bold text-gray-900 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-blue-600" />
                            Pemeriksaan Group
                        </h1>
                    </div>
                    <div className="mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                        <span className="mr-1.5">Kode: </span>
                        <span className="font-bold">{screening.reference_id}</span>
                    </div>
                </div>
                
                {/* Info & Progress Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-medium text-gray-900">Informasi Pemeriksaan</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                        <div className="flex items-center p-4">
                            <div className="flex-shrink-0 mr-3">
                                <div className="bg-blue-100 rounded-full p-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Tanggal Pemeriksaan</div>
                                <div className="font-medium text-gray-900">{screening.formatted_date}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center p-4">
                            <div className="flex-shrink-0 mr-3">
                                <div className="bg-indigo-100 rounded-full p-2">
                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Lokasi</div>
                                <div className="font-medium text-gray-900">{screening.location_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Stats & Progress */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-medium text-gray-900">Status Pemeriksaan</h2>
                    </div>
                    
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                <div className="text-sm text-gray-600">Sudah Diperiksa</div>
                                <div className="mt-1 text-2xl font-bold text-green-600">{examinedCount}</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                                <div className="text-sm text-gray-600">Belum Diperiksa</div>
                                <div className="mt-1 text-2xl font-bold text-yellow-600">{pendingCount}</div>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-500">Progress</span>
                                <span className="text-sm font-medium text-blue-600">{progressPercentage}%</span>
                            </div>
                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        progressPercentage < 30 ? 'bg-red-500' : 
                                        progressPercentage < 70 ? 'bg-yellow-500' : 
                                        'bg-green-500'
                                    } transition-all duration-500`} 
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 text-right">
                                {examinedCount} dari {totalCount} peserta
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
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
                    
                    <div className={`transition-all duration-300 ${isFilterOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                        <div className="p-4 space-y-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Peserta</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Cari berdasarkan nama, usia, atau jenis kelamin"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setFilterGender('all')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterGender === 'all'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilterGender('male')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterGender === 'male'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Laki-laki
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilterGender('female')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterGender === 'female'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Perempuan
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status Pemeriksaan</label>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setFilterStatus('all')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterStatus === 'all'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilterStatus('examined')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterStatus === 'examined'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Sudah Diperiksa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFilterStatus('unexamined')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                                                filterStatus === 'unexamined'
                                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                                            }`}
                                        >
                                            Belum Diperiksa
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {(filterGender !== 'all' || filterStatus !== 'all' || searchTerm) && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                                    >
                                        <X className="h-4 w-4 mr-1.5" />
                                        Reset Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* List of Participants - Mobile View */}
                <div className="md:hidden space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Daftar Peserta</h2>
                        <span className="text-sm text-gray-500">{filteredParticipants.length} orang</span>
                    </div>
                    
                    {filteredParticipants.length > 0 ? (
                        filteredParticipants.map((participant, index) => (
                            <div key={participant.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center">
                                                <span className="bg-blue-100 text-blue-700 font-medium text-xs rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                                    {index + 1}
                                                </span>
                                                <h3 className="text-base font-medium text-gray-900">{participant.name}</h3>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <span className="mr-3">{participant.age} tahun</span>
                                                <span>{participant.title === 'Mr' ? 'Laki-laki' : 'Perempuan'}</span>
                                            </div>
                                        </div>
                                        {participant.examined ? (
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
                                </div>
                                <div className="border-t border-gray-100 bg-gray-50 p-2 grid grid-cols-2 gap-2">
                                    <Link
                                        href={route('medical.registrations.edit', [participant.id, { from_group: true }])}
                                        className="flex items-center justify-center py-2 px-3 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                    >
                                        <Edit className="h-4 w-4 mr-1.5" />
                                        {participant.examined ? 'Lihat/Edit' : 'Periksa'}
                                    </Link>
                                    <Link
                                        href={route('medical.examinations.qrcode', participant.id)}
                                        className="flex items-center justify-center py-2 px-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                                    >
                                        <QrCode className="h-4 w-4 mr-1.5" />
                                        QR Code
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <h3 className="text-base font-medium text-gray-900">Tidak ada data</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Tidak ada data peserta yang sesuai dengan pencarian.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* List of Participants - Desktop View */}
                <div className="hidden md:block">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-medium text-gray-900">Daftar Peserta</h2>
                        <span className="text-sm text-gray-500">{filteredParticipants.length} orang</span>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No.
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usia
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jenis Kelamin
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
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((participant, index) => (
                                            <tr key={participant.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {participant.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {participant.age} tahun
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {participant.title === 'Mr' ? 'Laki-laki' : 'Perempuan'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {participant.examined ? (
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
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <Link
                                                            href={route('medical.registrations.edit', [participant.id, { from_group: true }])}
                                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            {participant.examined ? 'Lihat/Edit' : 'Periksa'}
                                                        </Link>
                                                        <Link
                                                            href={route('medical.examinations.qrcode', participant.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                                                        >
                                                            <QrCode className="h-4 w-4 mr-1" />
                                                            QR Code
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-sm text-gray-500 text-center">
                                                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                                Tidak ada data peserta yang sesuai dengan pencarian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MedicalLayout>
    );
}
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Search, 
  FileText, 
  QrCode, 
  Calendar, 
  AlertCircle, 
  Thermometer, 
  HeartPulse,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function ExaminationIndex({ examinations, currentDate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(currentDate);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState('examined_date');
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Filter examinations
    const filteredExaminations = examinations.filter(exam => {
        const searchLower = searchTerm.toLowerCase();
        return (
            exam.reference_id.toLowerCase().includes(searchLower) ||
            exam.patient_name.toLowerCase().includes(searchLower) ||
            exam.examined_date.includes(searchTerm)
        );
    });
    
    // Sort examinations
    const sortedExaminations = [...filteredExaminations].sort((a, b) => {
        let valueA, valueB;
        
        switch (sortColumn) {
            case 'reference_id':
                valueA = a.reference_id;
                valueB = b.reference_id;
                break;
            case 'patient_name':
                valueA = a.patient_name;
                valueB = b.patient_name;
                break;
            case 'examined_date':
                valueA = new Date(a.examined_date);
                valueB = new Date(b.examined_date);
                break;
            case 'blood_pressure':
                valueA = parseInt(a.systolic_blood_pressure);
                valueB = parseInt(b.systolic_blood_pressure);
                break;
            case 'temperature':
                valueA = parseFloat(a.temperature);
                valueB = parseFloat(b.temperature);
                break;
            default:
                valueA = a.examined_date;
                valueB = b.examined_date;
        }
        
        if (sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    
    // Toggle sort
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };
    
    // Date filter handler
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDateFilter(newDate);
        window.location.href = route('medical.examinations.index', { date: newDate });
    };
    
    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };
    
    // Sort icon component
    const SortIcon = ({ column }) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        
        return sortDirection === 'asc' 
            ? <ChevronUp className="h-4 w-4 text-blue-600" />
            : <ChevronDown className="h-4 w-4 text-blue-600" />;
    };
    
    return (
        <MedicalLayout>
            <Head title="Hasil Pemeriksaan" />
            
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            Hasil Pemeriksaan
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Daftar pasien yang telah menjalani pemeriksaan kesehatan
                        </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <span className="text-sm text-gray-500">Total: {filteredExaminations.length} hasil pemeriksaan</span>
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
                                <ChevronDown className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    
                    {isFilterOpen && (
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemeriksaan</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            value={dateFilter}
                                            onChange={handleDateChange}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Cari Hasil Pemeriksaan</label>
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
                            
                            {searchTerm && (
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
                    )}
                </div>
                
                {/* Mobile view - Cards */}
                <div className="md:hidden space-y-4">
                    {sortedExaminations.length > 0 ? (
                        sortedExaminations.map((exam) => (
                            <div key={exam.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-medium text-gray-900">{exam.patient_name}</h3>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                            {exam.reference_id}
                                        </span>
                                    </div>
                                    
                                    <div className="text-sm text-gray-500 flex items-center mb-3">
                                        <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                        {exam.examined_date}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                        <div className="bg-gray-50 p-2 rounded-md flex items-center">
                                            <HeartPulse className="h-4 w-4 mr-1.5 text-red-500" />
                                            <div>
                                                <div className="text-xs text-gray-500">Tensi</div>
                                                <div className="font-medium">{exam.systolic_blood_pressure}/{exam.diastolic_blood_pressure}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 p-2 rounded-md flex items-center">
                                            <Thermometer className="h-4 w-4 mr-1.5 text-red-500" />
                                            <div>
                                                <div className="text-xs text-gray-500">Suhu</div>
                                                <div className="font-medium">{exam.temperature}°C</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-end space-x-2">
                                    <Link
                                        href={route('medical.examinations.qrcode', exam.id)}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <QrCode className="h-4 w-4 mr-1.5" />
                                        QR Code
                                    </Link>
                                    <Link
                                        href={route('medical.registrations.edit', exam.id)}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors"
                                    >
                                        <Eye className="h-4 w-4 mr-1.5" />
                                        Lihat Detail
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <h3 className="text-base font-medium text-gray-900">Tidak ada data</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Tidak ada data pemeriksaan yang ditemukan.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Desktop view - Table */}
                <div className="hidden md:block">
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('reference_id')}>
                                            <div className="flex items-center space-x-1">
                                                <span>ID Referensi</span>
                                                <SortIcon column="reference_id" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('patient_name')}>
                                            <div className="flex items-center space-x-1">
                                                <span>Nama Pasien</span>
                                                <SortIcon column="patient_name" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('examined_date')}>
                                            <div className="flex items-center space-x-1">
                                                <span>Tanggal Pemeriksaan</span>
                                                <SortIcon column="examined_date" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('blood_pressure')}>
                                            <div className="flex items-center space-x-1">
                                                <span>Tensi</span>
                                                <SortIcon column="blood_pressure" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('temperature')}>
                                            <div className="flex items-center space-x-1">
                                                <span>Suhu</span>
                                                <SortIcon column="temperature" />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedExaminations.length > 0 ? (
                                        sortedExaminations.map((exam) => (
                                            <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {exam.reference_id}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                    {exam.patient_name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {exam.examined_date}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <HeartPulse className="h-4 w-4 mr-1.5 text-red-500" />
                                                        <span>{exam.systolic_blood_pressure}/{exam.diastolic_blood_pressure} mmHg</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Thermometer className="h-4 w-4 mr-1.5 text-red-500" />
                                                        <span>{exam.temperature}°C</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route('medical.examinations.qrcode', exam.id)}
                                                            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                                        >
                                                            <QrCode className="h-4 w-4 mr-1" />
                                                            QR Code
                                                        </Link>
                                                        <Link
                                                            href={route('medical.registrations.edit', exam.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Detail
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-sm text-gray-500 text-center">
                                                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                                Tidak ada data pemeriksaan yang ditemukan.
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
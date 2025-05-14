import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  User, 
  HeartPulse, 
  Thermometer, 
  Stethoscope, 
  Droplet, 
  Check, 
  Clipboard,
  ChevronDown,
  ChevronUp,
  Award,
  IdCard,
  History,
  AlertTriangle,
  Pill,
  Users
} from 'lucide-react';
import MedicalLayout from '@/Layouts/MedicalLayout';

export default function RegistrationEdit({ participant, registration, nationalities, fromGroup }) {
    const { data, setData, errors, processing, post } = useForm({
        name: participant.name || '',
        age: participant.age || '',
        title: participant.title || '',
        nationality_id: participant.nationality_id || '',
        id_number: participant.id_number || '',
        has_medical_history: participant.has_medical_history || false,
        allergies: participant.allergies || '',
        past_medical_history: participant.past_medical_history || '',
        current_medications: participant.current_medications || '',
        family_medical_history: participant.family_medical_history || '',
        systolic_blood_pressure: participant.systolic_blood_pressure || '',
        diastolic_blood_pressure: participant.diastolic_blood_pressure || '',
        heart_rate: participant.heart_rate || '',
        temperature: participant.temperature || '',
        respiratory_rate: participant.respiratory_rate || '',
        oxygen_saturation: participant.oxygen_saturation || '',
        height: participant.height || '',
        weight: participant.weight || '',
        notes: participant.notes || '',
    });

    // State for collapsible sections
    const [patientInfoOpen, setPatientInfoOpen] = useState(true);
    const [medicalHistoryOpen, setMedicalHistoryOpen] = useState(data.has_medical_history);
    const [examinationResultsOpen, setExaminationResultsOpen] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Jika dari group, tambahkan parameter from_group
        if (fromGroup) {
            post(route('medical.registrations.update', [participant.id, { from_group: true }]));
        } else {
            post(route('medical.registrations.update', participant.id));
        }
    };

    const hasExamination = !!participant.examined_at;

    // Helper for displaying error message
    const renderError = (field) => {
        if (errors[field]) {
            return (
                <div className="text-xs text-red-600 mt-1 flex items-start">
                    <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{errors[field]}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <MedicalLayout>
            <Head title={hasExamination ? 'Edit Pemeriksaan' : 'Form Pemeriksaan'} />
            
            <div className="space-y-5">
                {/* Back button & header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link
                            href={fromGroup 
                                ? route('medical.registrations.group', { reference_id: registration.reference_id }) 
                                : route('medical.registrations.index')
                            }
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            {fromGroup ? 'Kembali ke Pemeriksaan Group' : 'Kembali ke Daftar'}
                        </Link>
                        <h1 className="mt-2 text-xl font-bold text-gray-900 flex items-center">
                            {hasExamination ? (
                                <>
                                    <Clipboard className="h-5 w-5 mr-2 text-blue-600" />
                                    Edit Pemeriksaan
                                </>
                            ) : (
                                <>
                                    <HeartPulse className="h-5 w-5 mr-2 text-blue-600" />
                                    Form Pemeriksaan Kesehatan
                                </>
                            )}
                        </h1>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex flex-col items-end">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                            <span className="mr-1.5">ID: </span>
                            <span className="font-bold">{registration.reference_id}</span>
                        </div>
                        
                        {hasExamination && (
                            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Sudah Diperiksa
                            </span>
                        )}
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Patient Info Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div 
                            className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
                            onClick={() => setPatientInfoOpen(!patientInfoOpen)}
                        >
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2 text-blue-600" />
                                Data Pasien
                            </h2>
                            <button type="button" className="text-gray-500 hover:text-blue-600 focus:outline-none">
                                {patientInfoOpen ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        
                        {patientInfoOpen && (
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            required
                                        />
                                        {renderError('name')}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                                Usia
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                id="age"
                                                min="0"
                                                max="120"
                                                value={data.age}
                                                onChange={(e) => setData('age', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                required
                                            />
                                            {renderError('age')}
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                                Jenis Kelamin
                                            </label>
                                            <select
                                                id="title"
                                                name="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                required
                                            >
                                                <option value="">Pilih</option>
                                                <option value="Mr">Laki-laki</option>
                                                <option value="Mrs">Perempuan</option>
                                            </select>
                                            {renderError('title')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-gray-400" />
                                        <div className="flex-1">
                                            <label htmlFor="nationality_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                Kebangsaan
                                            </label>
                                            <select
                                                id="nationality_id"
                                                name="nationality_id"
                                                value={data.nationality_id}
                                                onChange={(e) => setData('nationality_id', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                required
                                            >
                                                <option value="">Pilih Kebangsaan</option>
                                                {nationalities.map(nationality => (
                                                    <option key={nationality.id} value={nationality.id}>
                                                        {nationality.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {renderError('nationality_id')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <IdCard className="h-5 w-5 text-gray-400" />
                                        <div className="flex-1">
                                            <label htmlFor="id_number" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nomor Identitas (KTP/Passport)
                                            </label>
                                            <input
                                                type="text"
                                                name="id_number"
                                                id="id_number"
                                                value={data.id_number}
                                                onChange={(e) => setData('id_number', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                required
                                            />
                                            {renderError('id_number')}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center mt-3">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="has_medical_history"
                                            name="has_medical_history"
                                            type="checkbox"
                                            checked={data.has_medical_history}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setData('has_medical_history', checked);
                                                setMedicalHistoryOpen(checked);
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="has_medical_history" className="font-medium text-gray-700">
                                            Memiliki Riwayat Kesehatan
                                        </label>
                                        <p className="text-gray-500">Centang jika pasien memiliki riwayat kesehatan yang perlu dicatat.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Medical History Section - Only visible when checked */}
                    {data.has_medical_history && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div 
                                className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
                                onClick={() => setMedicalHistoryOpen(!medicalHistoryOpen)}
                            >
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <History className="h-5 w-5 mr-2 text-blue-600" />
                                    Riwayat Kesehatan
                                </h2>
                                <button type="button" className="text-gray-500 hover:text-blue-600 focus:outline-none">
                                    {medicalHistoryOpen ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            
                            {medicalHistoryOpen && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 mt-1 text-yellow-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                                                Alergi
                                            </label>
                                            <textarea
                                                id="allergies"
                                                name="allergies"
                                                rows={3}
                                                value={data.allergies}
                                                onChange={(e) => setData('allergies', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Catatan alergi pasien jika ada"
                                            />
                                            {renderError('allergies')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <label htmlFor="past_medical_history" className="block text-sm font-medium text-gray-700 mb-1">
                                                Riwayat Penyakit
                                            </label>
                                            <textarea
                                                id="past_medical_history"
                                                name="past_medical_history"
                                                rows={3}
                                                value={data.past_medical_history}
                                                onChange={(e) => setData('past_medical_history', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Catatan riwayat penyakit yang pernah diderita"
                                            />
                                            {renderError('past_medical_history')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <Pill className="h-5 w-5 mt-1 text-indigo-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <label htmlFor="current_medications" className="block text-sm font-medium text-gray-700 mb-1">
                                                Obat-obatan Saat Ini
                                            </label>
                                            <textarea
                                                id="current_medications"
                                                name="current_medications"
                                                rows={3}
                                                value={data.current_medications}
                                                onChange={(e) => setData('current_medications', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Obat-obatan yang sedang dikonsumsi"
                                            />
                                            {renderError('current_medications')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2">
                                        <Users className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <label htmlFor="family_medical_history" className="block text-sm font-medium text-gray-700 mb-1">
                                                Riwayat Kesehatan Keluarga
                                            </label>
                                            <textarea
                                                id="family_medical_history"
                                                name="family_medical_history"
                                                rows={3}
                                                value={data.family_medical_history}
                                                onChange={(e) => setData('family_medical_history', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="Riwayat penyakit di keluarga pasien"
                                            />
                                            {renderError('family_medical_history')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Examination Results Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div 
                            className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
                            onClick={() => setExaminationResultsOpen(!examinationResultsOpen)}
                        >
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Clipboard className="h-5 w-5 mr-2 text-blue-600" />
                                Hasil Pemeriksaan
                            </h2>
                            <button type="button" className="text-gray-500 hover:text-blue-600 focus:outline-none">
                                {examinationResultsOpen ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        
                        {examinationResultsOpen && (
                            <div className="p-4">
                                {/* Vital Signs */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="flex items-center mb-2">
                                            <HeartPulse className="h-5 w-5 mr-2 text-red-500" />
                                            <h3 className="text-base font-medium text-gray-900">Tekanan Darah</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label htmlFor="systolic_blood_pressure" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Sistolik (mmHg)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="systolic_blood_pressure"
                                                    id="systolic_blood_pressure"
                                                    min="60"
                                                    max="250"
                                                    value={data.systolic_blood_pressure}
                                                    onChange={(e) => setData('systolic_blood_pressure', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('systolic_blood_pressure')}
                                            </div>
                                            <div>
                                                <label htmlFor="diastolic_blood_pressure" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Diastolik (mmHg)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="diastolic_blood_pressure"
                                                    id="diastolic_blood_pressure"
                                                    min="40"
                                                    max="150"
                                                    value={data.diastolic_blood_pressure}
                                                    onChange={(e) => setData('diastolic_blood_pressure', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('diastolic_blood_pressure')}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="flex items-center mb-2">
                                            <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                                            <h3 className="text-base font-medium text-gray-900">Pernapasan</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label htmlFor="respiratory_rate" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tingkat Pernapasan (napas/menit)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="respiratory_rate"
                                                    id="respiratory_rate"
                                                    min="8"
                                                    max="60"
                                                    value={data.respiratory_rate}
                                                    onChange={(e) => setData('respiratory_rate', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('respiratory_rate')}
                                            </div>
                                            <div>
                                                <label htmlFor="oxygen_saturation" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Saturasi Oksigen (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="oxygen_saturation"
                                                    id="oxygen_saturation"
                                                    min="70"
                                                    max="100"
                                                    value={data.oxygen_saturation}
                                                    onChange={(e) => setData('oxygen_saturation', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('oxygen_saturation')}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="flex items-center mb-2">
                                            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                                            <h3 className="text-base font-medium text-gray-900">Denyut & Suhu</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Denyut Jantung (bpm)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="heart_rate"
                                                    id="heart_rate"
                                                    min="40"
                                                    max="220"
                                                    value={data.heart_rate}
                                                    onChange={(e) => setData('heart_rate', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('heart_rate')}
                                            </div>
                                            <div>
                                                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Suhu Tubuh (°C)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="temperature"
                                                    id="temperature"
                                                    step="0.1"
                                                    min="35"
                                                    max="42"
                                                    value={data.temperature}
                                                    onChange={(e) => setData('temperature', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    required
                                                />
                                                {renderError('temperature')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )}
                    </div>
                    
                    {/* Form Actions */}
                    <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3">
                        <Link
                            href={fromGroup 
                                ? route('medical.registrations.group', { reference_id: registration.reference_id }) 
                                : route('medical.registrations.index')
                            }
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Save className="h-4 w-4 mr-1.5" />
                            {processing ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
                        </button>
                    </div>
                </form>
            </div>
        </MedicalLayout>
    );
}
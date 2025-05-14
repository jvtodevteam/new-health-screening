import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Clipboard, 
  Download, 
  Share2, 
  QrCode, 
  Printer, 
  Check,
  Copy
} from 'lucide-react';
import MedicalLayout from '@/Layouts/MedicalLayout';
import { QRCodeSVG } from 'qrcode.react';

export default function ExaminationQrCode({ examination }) {
    const qrCodeValue = `${window.location.origin}/verify-examination/${examination.unique_code}`;
    const [copied, setCopied] = useState(false);
    const [qrSize, setQrSize] = useState(200);
    
    // Function to copy URL to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrCodeValue).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    // Function to download QR Code as image
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-canvas');
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode-${examination.unique_code}.png`;
        link.href = url;
        link.click();
    };
    
    return (
        <MedicalLayout>
            <Head title={`QR Code Pemeriksaan - ${examination.patient_name}`} />
            
            <div className="space-y-5">
                {/* Back button & header */}
                <div>
                    <Link
                        href={route('medical.examinations.index')}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Kembali ke Hasil Pemeriksaan
                    </Link>
                    <h1 className="mt-2 text-xl font-bold text-gray-900 flex items-center">
                        <QrCode className="h-5 w-5 mr-2 text-blue-600" />
                        QR Code Hasil Pemeriksaan
                    </h1>
                </div>
                
                {/* Main content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Scan QR Code ini untuk memverifikasi hasil pemeriksaan kesehatan pasien
                        </p>
                    </div>
                    
                    <div className="p-5">
                        <div className="flex flex-col items-center justify-center">
                            {/* QR Code display */}
                            <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                                <QRCodeSVG 
                                    id="qr-canvas"
                                    value={qrCodeValue}
                                    size={qrSize}
                                    level="H"
                                    includeMargin={true}
                                    className="rounded-lg"
                                />
                            </div>
                            
                            {/* QR Size Controls */}
                            <div className="w-full max-w-xs mb-6">
                                <label htmlFor="qr-size" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ukuran QR Code
                                </label>
                                <input
                                    type="range"
                                    id="qr-size"
                                    min="150"
                                    max="300"
                                    step="10"
                                    value={qrSize}
                                    onChange={(e) => setQrSize(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Kecil</span>
                                    <span>Besar</span>
                                </div>
                            </div>
                            
                            {/* URL display and copy */}
                            <div className="w-full max-w-lg mb-6">
                                <label htmlFor="qr-url" className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Verifikasi
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow">
                                        <input
                                            type="text"
                                            name="qr-url"
                                            id="qr-url"
                                            className="block w-full rounded-none rounded-l-lg border-gray-300 text-sm"
                                            value={qrCodeValue}
                                            readOnly
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span className="text-green-600">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 text-gray-400" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Patient information */}
                        <div className="border-t border-gray-100 pt-5 mt-4">
                            <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                Informasi Pemeriksaan
                            </h3>
                            
                            <div className="bg-gray-50 rounded-lg border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    <div className="flex items-start">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Nama Pasien</div>
                                            <div className="mt-1 text-base font-medium text-gray-900">{examination.patient_name}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <Clipboard className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">ID Referensi</div>
                                            <div className="mt-1 text-base font-medium text-gray-900">{examination.reference_id}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Tanggal Pemeriksaan</div>
                                            <div className="mt-1 text-base font-medium text-gray-900">{examination.examined_date}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Petugas Medis</div>
                                            <div className="mt-1 text-base font-medium text-gray-900">{examination.medical_staff}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                            <button
                                type="button"
                                onClick={downloadQRCode}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download QR
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak QR Code
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Print information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Printer className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Tips Mencetak</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>Saat mencetak QR Code, pastikan ukuran printer sudah sesuai dan hasil cetakan dapat terbaca dengan jelas oleh scanner.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MedicalLayout>
    );
}
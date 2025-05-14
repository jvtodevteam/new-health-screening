import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

export default function ExaminationPrint({ examination, medicalStaff, organization }) {
    useEffect(() => {
        // Auto print when page loads
        setTimeout(() => {
            window.print();
        }, 1000);
    }, []);

    const qrCodeValue = `${window.location.origin}/verify-examination/${examination.unique_code}`;
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const formattedExaminationDate = new Date(examination.examined_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Function to determine health status
    const determineHealthStatus = () => {
        // This is a simplified example - in a real app, you'd have more complex logic
        const systolic = parseInt(examination.systolic_blood_pressure);
        const diastolic = parseInt(examination.diastolic_blood_pressure);
        const temperature = parseFloat(examination.temperature);
        
        if (systolic > 140 || diastolic > 90 || temperature > 37.5) {
            return "Tidak Sehat";
        }
        return "Sehat";
    };

    const healthStatus = determineHealthStatus();

    return (
        <>
            <Head title={`Cetak Surat Kesehatan - ${examination.name}`} />
            
            <div className="print-container mx-auto p-8 max-w-4xl bg-white">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
                    <div className="flex items-center">
                        <img src={organization.logo_url || "/logo.svg"} alt="Logo" className="h-16 mr-4" />
                        <div>
                            <h1 className="text-xl font-bold">{organization.name || "KLINIK KESEHATAN"}</h1>
                            <p className="text-sm">{organization.address || "Jl. Kesehatan No. 123, Kota"}</p>
                            <p className="text-sm">Telp: {organization.phone || "021-12345678"}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">No. Ref: {examination.reference_id}</p>
                        <p className="text-sm">Tanggal: {formattedExaminationDate}</p>
                    </div>
                </div>
                
                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold uppercase underline">SURAT KETERANGAN KESEHATAN</h2>
                    <p className="text-sm">No: {examination.reference_id}/SKK/{new Date().getFullYear()}</p>
                </div>
                
                {/* Content */}
                <div className="mb-6">
                    <p className="mb-4">Yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                    
                    <table className="w-full mb-6">
                        <tbody>
                            <tr>
                                <td className="w-1/3 py-1">Nama</td>
                                <td className="w-1/12">:</td>
                                <td className="font-semibold">{examination.name}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Umur</td>
                                <td>:</td>
                                <td>{examination.age} tahun</td>
                            </tr>
                            <tr>
                                <td className="py-1">Jenis Kelamin</td>
                                <td>:</td>
                                <td>{examination.title === 'Mr' ? 'Laki-laki' : 'Perempuan'}</td>
                            </tr>
                            <tr>
                                <td className="py-1">No. Identitas</td>
                                <td>:</td>
                                <td>{examination.id_number}</td>
                            </tr>
                            <tr>
                                <td className="py-1">Kebangsaan</td>
                                <td>:</td>
                                <td>{examination.nationality?.name || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p className="mb-4">Telah dilakukan pemeriksaan kesehatan dengan hasil:</p>
                    
                    <table className="w-full mb-6">
                        <tbody>
                            <tr>
                                <td className="w-1/3 py-1">Tekanan Darah</td>
                                <td className="w-1/12">:</td>
                                <td>{examination.systolic_blood_pressure}/{examination.diastolic_blood_pressure} mmHg</td>
                            </tr>
                            <tr>
                                <td className="py-1">Denyut Nadi</td>
                                <td>:</td>
                                <td>{examination.heart_rate} bpm</td>
                            </tr>
                            <tr>
                                <td className="py-1">Suhu Tubuh</td>
                                <td>:</td>
                                <td>{examination.temperature}°C</td>
                            </tr>
                            <tr>
                                <td className="py-1">Pernapasan</td>
                                <td>:</td>
                                <td>{examination.respiratory_rate} napas/menit</td>
                            </tr>
                            <tr>
                                <td className="py-1">Saturasi Oksigen</td>
                                <td>:</td>
                                <td>{examination.oxygen_saturation}%</td>
                            </tr>
                            <tr>
                                <td className="py-1">Tinggi Badan</td>
                                <td>:</td>
                                <td>{examination.height} cm</td>
                            </tr>
                            <tr>
                                <td className="py-1">Berat Badan</td>
                                <td>:</td>
                                <td>{examination.weight} kg</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p className="mb-4">
                        Berdasarkan hasil pemeriksaan tersebut, yang bersangkutan dinyatakan <span className="font-bold">{healthStatus}</span>.
                    </p>
                    
                    {examination.notes && (
                        <div className="mb-4">
                            <p className="font-semibold">Catatan:</p>
                            <p>{examination.notes}</p>
                        </div>
                    )}
                    
                    <p className="mb-8">
                        Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                    </p>
                </div>
                
                {/* Signature */}
                <div className="flex justify-end mb-6">
                    <div className="text-center w-1/3">
                        <p>{organization.city || "Jakarta"}, {today}</p>
                        <p>Petugas Medis,</p>
                        <div className="h-24 flex items-end justify-center">
                            <p className="font-semibold border-b border-black">{medicalStaff.name || medicalStaff.username}</p>
                        </div>
                    </div>
                </div>
                
                {/* QR Code */}
                <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                    <div className="flex items-center">
                        <QRCodeSVG 
                            value={qrCodeValue}
                            size={80}
                            level="H"
                        />
                        <div className="ml-2">
                            <p className="text-xs">Scan untuk verifikasi</p>
                            <p className="text-xs">{qrCodeValue}</p>
                        </div>
                    </div>
                    <div className="text-right text-xs">
                        <p>Dokumen ini sah tanpa tanda tangan basah.</p>
                        <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    .print-container {
                        padding: 0;
                        max-width: none;
                    }
                }
            `}</style>
        </>
    );
}
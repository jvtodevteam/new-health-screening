<!-- resources/views/examinations/verification-failed.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Gagal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="flex items-center justify-center min-h-screen p-5">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-red-600 p-6 text-center">
                <svg class="mx-auto h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h1 class="mt-4 text-xl font-bold text-white">Verifikasi Gagal</h1>
            </div>
            
            <div class="p-6">
                <p class="text-gray-700 mb-4">
                    Data pemeriksaan kesehatan yang Anda cari tidak dapat diverifikasi. Kemungkinan penyebabnya:
                </p>
                
                <ul class="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                    <li>Kode verifikasi tidak valid</li>
                    <li>ID pemeriksaan tidak ditemukan</li>
                    <li>Pemeriksaan belum dilakukan</li>
                    <li>Link verifikasi telah kadaluarsa</li>
                </ul>
                
                <p class="text-gray-700 mb-6">
                    Silakan pastikan bahwa Anda menggunakan link yang benar atau scan ulang QR code pada surat keterangan pemeriksaan kesehatan Anda.
                </p>
                
                <div class="flex justify-center">
                    <a href="/" class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
            
            <div class="px-6 py-3 bg-gray-50 text-center">
                <p class="text-xs text-gray-500">
                    Jika Anda yakin bahwa ini adalah kesalahan, silakan hubungi administrator sistem.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
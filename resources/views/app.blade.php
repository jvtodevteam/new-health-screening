<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ijen Health" />
        <meta property="og:description" content="Verifikasi Kesehatan Digital" />
        <meta property="og:url" content="https://health.mountijen.com/" />
        <meta property="og:image" content="https://health.mountijen.com/assets/img/banner.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <link rel="icon" type="image/png" href="https://health.mountijen.com/assets/img/logo-blue.png" id="favicon"/>
        <link rel="manifest" href="/manifest.json" />
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap');
            body,html,* {
                font-family: 'Poppins', sans-serif !important;
            }
        </style>

        @inertia
        <script>
            if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker
                .register('/sw.js')
                .then(function (registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function (registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
            });
            }            
        </script>
    </body>
</html>

{{-- resources/views/payment/success.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            color: #111827;
        }
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            max-width: 400px;
            width: 100%;
        }
        .icon {
            width: 70px;
            height: 70px;
            background-color: #d1fae5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        .checkmark {
            color: #10b981;
            font-size: 40px;
        }
        h1 {
            margin-bottom: 10px;
            color: #10b981;
        }
        p {
            color: #6b7280;
            margin-bottom: 20px;
        }
        .progress {
            height: 4px;
            background-color: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .progress-bar {
            height: 100%;
            background-color: #10b981;
            border-radius: 2px;
            width: 0%;
            transition: width 1s linear;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            <span class="checkmark">✓</span>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your screening payment has been processed successfully.</p>
        <div class="progress">
            <div class="progress-bar" id="progressBar"></div>
        </div>
        <p id="redirectMessage">Redirecting back to your screening details...</p>
    </div>

    <script>
        // Store the screening ID from the server
        const screeningId = "{{ $screeningId }}";
        
        // Function to update screening status in localStorage
        function updateScreeningStatus(screeningId, newStatus) {
            try {
                // Clean any quotes from the ID
                const cleanedId = screeningId ? screeningId.replace(/^["']|["']$/g, '') : null;
                
                if (!cleanedId) {
                    console.error('Invalid screening ID');
                    return false;
                }
                
                // Get current screening data from localStorage
                const screeningDataStr = localStorage.getItem('screeningData');
                if (!screeningDataStr) {
                    console.error('No screening data found in localStorage');
                    return false;
                }
                
                // Parse the screening data
                const screeningData = JSON.parse(screeningDataStr);
                
                // Find the specific screening by ID
                const screeningIndex = screeningData.findIndex(s => s.id === cleanedId);
                
                if (screeningIndex === -1) {
                    console.error(`Screening with ID ${cleanedId} not found`);
                    return false;
                }
                
                // Update the status
                screeningData[screeningIndex] = {
                    ...screeningData[screeningIndex],
                    status: newStatus
                };
                
                // Save back to localStorage
                localStorage.setItem('screeningData', JSON.stringify(screeningData));
                
                console.log(`Screening ${cleanedId} status updated to ${newStatus}`);
                return true;
            } catch (error) {
                console.error('Error updating screening status:', error);
                return false;
            }
        }
        
        // Execute when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Update the screening status to complete
            updateScreeningStatus(screeningId, 'complete');
            
            // Set currentScreen to 'details'
            localStorage.setItem('currentScreen', JSON.stringify('details'));
            
            // Set currentPaymentScreeningId to the cleaned ID
            const cleanedId = screeningId.replace(/^["']|["']$/g, '');
            localStorage.setItem('currentPaymentScreeningId', JSON.stringify(cleanedId));
            
            // Also set selectedScreeningId for consistency
            localStorage.setItem('selectedScreeningId', JSON.stringify(cleanedId));
            
            // Start the progress bar animation
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = '100%';
            
            // Redirect after animation completes (1 second)
            setTimeout(function() {
                window.location.href = '/'; // Adjust this to your app's base URL
            }, 1000);
        });
    </script>
</body>
</html>
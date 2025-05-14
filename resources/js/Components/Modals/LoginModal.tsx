import React, { useState } from "react";
import { X,Mail } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
  isProcessing?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  onClose, 
  onLogin,
  isProcessing = false
}) => {
  const { t } = useTranslation();
  const [localProcessing, setLocalProcessing] = useState(false);
  

// Function to handle Google login
const handleGoogleLogin = () => {
  setLocalProcessing(true);
  
  // Open Google login in a new window
  const width = 600;
  const height = 600;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  const googleWindow = window.open(
    "/auth/google?ref=popup", 
    "googleLoginWindow", 
    `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no`
  );
  
  // Set up interval to check for login completion
  const checkLoginInterval = setInterval(() => {
    // Check if window was closed and if login was successful
    if (googleWindow && googleWindow.closed) {
      if (localStorage.getItem('google_login_success') === 'true') {
        // Clear the success flag
        localStorage.removeItem('google_login_success');
        
        // Clear the interval
        clearInterval(checkLoginInterval);
        
        // Call the onLogin callback to trigger form submission
        onLogin();
      } else if (localStorage.getItem('google_login_failed') === 'true') {
        // Clear the failure flag
        localStorage.removeItem('google_login_failed');
        
        // Clear the interval
        clearInterval(checkLoginInterval);
        
        // Reset loading state
        setLocalProcessing(false);
      }
    }
  }, 500);
  
  // Store the interval ID for cleanup
  window.loginCheckInterval = checkLoginInterval;
};
  // When component unmounts, clean up the interval
  React.useEffect(() => {
    return () => {
      if (window.loginCheckInterval) {
        clearInterval(window.loginCheckInterval);
      }
    };
  }, []);
  
  // This effect is no longer needed as we're using localStorage for communication
  React.useEffect(() => {
    // No need for window.handleAuthCallback anymore
    
    // Check if this is a redirect from Google login - this code won't run in normal cases
    // since we're using a new tab approach, but keeping it as a fallback
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth_success');
    
    if (authSuccess === 'true') {
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Call the onLogin function
      onLogin();
    }
  }, [onLogin]);

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {t.loginToContinue}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium hover:bg-gray-50 transition-colors"
              disabled={isProcessing || localProcessing}
            >
              {isProcessing || localProcessing ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                  {t.processing}
                </span>
              ) : (
                <>
                  <img
                    src="/assets/img/google.png"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700">{t.loginWithGoogle}</span>
                </>
              )}
            </button>
            <button
              className="w-full bg-black text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="white" className="mr-2">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <span>{t.loginWithApple}</span>
            </button>
            {/* <button
              className="w-full border border-gray-300 bg-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-gray-700 font-medium"
            >
                <Mail size={18} className="text-gray-500" />
                <span>{t.loginWithEmail}</span>
            </button> */}

          </div>


          <div className="text-center text-gray-500 text-sm">
            <p>{t.continueAgreement}</p>
            <div className="flex justify-center space-x-1">
              <a href="/terms" className="text-green-500">
                {t.terms}
              </a>
              <span>&</span>
              <a href="/privacy" className="text-green-500">
                {t.privacy}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
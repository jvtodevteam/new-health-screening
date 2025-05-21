import React, { useState, useEffect } from "react";
import { X, Mail, ArrowLeft, Check } from "lucide-react";
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

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

  // Function to handle email input
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  // Function to handle OTP input
  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first digit
    setOtp(newOtp);
    setOtpError("");
    
    // Auto-focus next input if current is filled
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace in OTP input
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Validate email
  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  };

  // Function to send OTP
  const sendOtp = async () => {
    // Validate email first
    if (!email) {
      setEmailError(t.emailRequired || "Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t.invalidEmail || "Please enter a valid email");
      return;
    }

    setIsSendingOtp(true);
    
    try {
      // Here you would make an API call to send the OTP
      // For example:
      // const response = await fetch('/api/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show OTP form
      setShowOtpForm(true);
      
      // Start cooldown for resend
      setResendCooldown(60);
      
      // Schedule the countdown
      const countdownInterval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setEmailError((error as Error).message || t.otpSendFailed || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    // Check if all OTP digits are filled
    if (otp.some(digit => !digit)) {
      setOtpError(t.completeOtp || "Please enter the complete OTP");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Here you would make an API call to verify the OTP
      // For example:
      // const response = await fetch('/api/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp: otp.join('') })
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onLogin callback to trigger form submission
      onLogin();
      
    } catch (error) {
      setOtpError((error as Error).message || t.invalidOtp || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset to main login screen
  const goBackToMainScreen = () => {
    setShowEmailForm(false);
    setShowOtpForm(false);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setEmailError("");
    setOtpError("");
  };

  // Go back from OTP to email entry
  const goBackToEmailScreen = () => {
    setShowOtpForm(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  // When component unmounts, clean up the interval
  useEffect(() => {
    return () => {
      if (window.loginCheckInterval) {
        clearInterval(window.loginCheckInterval);
      }
    };
  }, []);
  
  // This effect is no longer needed as we're using localStorage for communication
  useEffect(() => {
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

  // Main login options screen
  if (!showEmailForm && !showOtpForm) {
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
              {/* <button
                className="w-full bg-black text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="white" className="mr-2">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span>{t.loginWithApple}</span>
              </button> */}
              {/* <button
                onClick={() => setShowEmailForm(true)}
                className="w-full border border-gray-300 bg-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <Mail size={18} className="text-gray-500" />
                <span>{t.loginWithEmail || "Login with Email"}</span>
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
  }

  // Email input form
  if (showEmailForm && !showOtpForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
        <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md animate-slide-up">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={goBackToMainScreen}
                className="mr-3 text-gray-500"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {t.loginWithEmail || "Login with Email"}
              </h2>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.emailAddress || "Email Address"}
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-xl border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder={t.enterEmail || "Enter your email address"}
                value={email}
                onChange={handleEmailInput}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              disabled={isSendingOtp}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
            >
              {isSendingOtp ? (
                <span className="flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {t.sending || "Sending..."}
                </span>
              ) : (
                t.sendOtp || "Send OTP"
              )}
            </button>

            <div className="text-center text-gray-500 text-sm mt-6">
              <p>{t.otpToEmail || "We will send a one-time password to your email"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={goBackToEmailScreen}
              className="mr-3 text-gray-500"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {t.verifyOtp || "Verify OTP"}
            </h2>
          </div>

          <div className="mb-3">
            <p className="text-gray-700 text-sm">
              {t.otpSentTo || "We've sent a verification code to"} <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between gap-2 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={otpInputRefs[index]}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-lg border ${otpError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>
            {otpError && (
              <p className="mt-2 text-sm text-red-600">{otpError}</p>
            )}
          </div>

          <button
            onClick={verifyOtp}
            disabled={isVerifying}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-medium"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                {t.verifying || "Verifying..."}
              </span>
            ) : (
              t.verify || "Verify"
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {t.didntReceiveCode || "Didn't receive the code?"}
            </p>
            {resendCooldown > 0 ? (
              <p className="text-sm text-gray-500">
                {t.resendIn || "Resend in"} {resendCooldown} {t.seconds}
              </p>
            ) : (
              <button
                onClick={sendOtp}
                disabled={isSendingOtp}
                className="text-green-500 font-medium text-sm"
              >
                {isSendingOtp ? t.sending || "Sending..." : t.resendOtp || "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
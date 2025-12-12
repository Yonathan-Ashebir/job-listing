import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import type { SignupRequest } from '../api/authService';

interface FormErrors {
  email?: string;
  OTP?: string;
  general?: string;
}

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { verifyEmail, signup } = useAuth();
  
  // Get signup data from localStorage
  const getStoredSignupData = () => {
    try {
      const stored = localStorage.getItem('job-listing-signup-data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading signup data from localStorage:', e);
    }
    return null;
  };

  const storedData = getStoredSignupData();
  const email = storedData?.email || '';
  const signupData = storedData?.signupData as SignupRequest | null;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    // If no email in localStorage, redirect to signup
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Start countdown when component mounts
  useEffect(() => {
    setResendCountdown(30);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits and get the last character typed
    const digit = value.replace(/\D/g, '').slice(-1);
    
    if (!digit) {
      // If no digit, clear the field
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }
    
    const newOtp = [...otp];
    // Always replace the digit (whether field was empty, had a digit, or was selected)
    newOtp[index] = digit;
    setOtp(newOtp);
    
    // Always move to next field if digit was entered and not the last field
    if (index < 3) {
      // Use setTimeout to ensure state update happens before focus
      setTimeout(() => {
        inputRefs[index + 1].current?.focus();
      }, 0);
    }

    // Clear errors
    if (errors.OTP) {
      setErrors((prev) => ({ ...prev, OTP: undefined }));
    }
  };

  const handleFocus = (index: number) => {
    // Set focused index to highlight the field
    setFocusedIndex(index);
    // Always select/highlight the digit when field receives focus (if it exists)
    setTimeout(() => {
      const input = inputRefs[index].current;
      if (input) {
        input.select();
      }
    }, 0);
  };

  const handleBlur = () => {
    // Clear focused index when field loses focus
    setFocusedIndex(null);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    
    // Handle all arrow keys - always move between fields (no cursor control within field)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      // Move to previous field
      if (index > 0) {
        e.preventDefault();
        setTimeout(() => {
          const prevInput = inputRefs[index - 1].current;
          if (prevInput) {
            prevInput.focus();
            // Select/highlight the digit if it exists
            if (otp[index - 1]) {
              prevInput.select();
            }
          }
        }, 0);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      // Move to next field
      if (index < 3) {
        e.preventDefault();
        setTimeout(() => {
          const nextInput = inputRefs[index + 1].current;
          if (nextInput) {
            nextInput.focus();
            // Select/highlight the digit if it exists
            if (otp[index + 1]) {
              nextInput.select();
            }
          }
        }, 0);
      }
    }
    // Handle backspace
    else if (e.key === 'Backspace') {
      if (otp[index]) {
        // If current field has a digit, delete it
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (!otp[index] && index > 0) {
        // If current field is empty, move to previous field and select its content
        e.preventDefault();
        setTimeout(() => {
          const prevInput = inputRefs[index - 1].current;
          if (prevInput) {
            prevInput.focus();
            prevInput.select(); // Select/highlight the digit in previous field
          }
        }, 0);
      }
    }
    // Handle typing a digit when field already has one (or is selected)
    else if (e.key.match(/[0-9]/)) {
      // If field has a digit or is selected, replace it
      if (otp[index] || input.selectionStart !== input.selectionEnd) {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index] = e.key;
        setOtp(newOtp);
        // Move to next field
        if (index < 3) {
          setTimeout(() => {
            inputRefs[index + 1].current?.focus();
          }, 0);
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    if (pastedData.length === 4) {
      inputRefs[3].current?.focus();
    } else if (pastedData.length > 0) {
      inputRefs[pastedData.length - 1].current?.focus();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      newErrors.OTP = 'Please enter the complete 4-digit code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const otpString = otp.join('');
      const response = await verifyEmail({ email, OTP: otpString });
      
      if (response.success) {
        // Clear signup data from localStorage after successful verification
        localStorage.removeItem('job-listing-signup-data');
        setShowSuccess(true);
        // Navigate to signin page after 2 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Email verification failed. Please try again.' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || !signupData) {
      return;
    }

    setIsResending(true);
    setErrors({});

    try {
      const response = await signup(signupData);
      
      if (response.success) {
        // Reset countdown to 30 seconds
        setResendCountdown(30);
        // Clear OTP
        setOtp(['', '', '', '']);
        // Clear any previous errors
        setErrors({});
        // Focus first input
        inputRefs[0].current?.focus();
      } else {
        setErrors({ general: response.message || 'Failed to resend OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred while resending OTP.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F8FD',
        padding: dimensions.spacing.lg,
      }}
    >
      <div
        style={{
          width: 'min-content',
          backgroundColor: '#ffffff',
          borderRadius: dimensions.borderRadius.card,
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '45px',
          }}
        >
        {/* Header Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1
            style={{
              fontFamily: fonts.poppins,
              fontWeight: 900,
              fontSize: '32px',
              lineHeight: '120%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#25324B',
              margin: 0,
            }}
          >
            Verify Email
          </h1>
        </div>

        <p
          style={{
            fontFamily: fonts.epilogue,
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '160%',
            letterSpacing: '0%',
            textAlign: 'justify',
            color: '#7C8493',
            margin: 0,
          }}
        >
          We've sent a verification code to the email address you provided. To complete the verification process, please enter the code here.
        </p>

        {showSuccess && (
          <div
            style={{
              padding: dimensions.spacing.md,
              backgroundColor: colors.primary.greenLight,
              borderRadius: '8px',
              color: colors.primary.green,
              fontFamily: fonts.epilogue,
              fontSize: typography.fontSizes.sm,
            }}
          >
            Email verified successfully! Redirecting to sign in...
          </div>
        )}

        {errors.general && (
          <div
            style={{
              padding: dimensions.spacing.md,
              backgroundColor: '#FEE2E2',
              borderRadius: '8px',
              color: '#DC2626',
              fontFamily: fonts.epilogue,
              fontSize: typography.fontSizes.sm,
            }}
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', padding: '40px 0', gap: '45px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Code Container */}
            <div style={{ display: 'flex', gap: '35px', justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  onPaste={handlePaste}
                  placeholder="0"
                  style={{
                    minWidth: '76px',
                    width: '50px',
                    height: '50px',
                    background: '#F8F8FD',
                    border: `2px solid ${focusedIndex === index ? '#4640DE' : (digit ? '#4640DE' : '#4640DE66')}`,
                    borderRadius: '7px',
                    fontFamily: fonts.epilogue,
                    fontWeight: 500,
                    fontSize: '34px',
                    lineHeight: '160%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: colors.gray.dark,
                    outline: 'none',
                    boxSizing: 'border-box',
                    caretColor: 'transparent',
                  }}
                />
              ))}
            </div>

            {errors.OTP && (
              <p style={{ color: '#DC2626', fontSize: typography.fontSizes.xs, fontFamily: fonts.epilogue, textAlign: 'center', margin: 0 }}>
                {errors.OTP}
              </p>
            )}

            {/* Resend Code */}
            <div
              style={{
                fontFamily: fonts.epilogue,
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '160%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#7C8493',
                margin: 0,
              }}
            >
              <span>
                You can request to{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || isResending || !signupData}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: fonts.epilogue,
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '160%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: resendCountdown > 0 || isResending || !signupData ? '#7C8493' : '#4640DE',
                    cursor: resendCountdown > 0 || isResending || !signupData ? 'not-allowed' : 'pointer',
                    padding: 0,
                    textDecoration: 'none',
                  }}
                >
                  Resend code
                </button>
              </span>
              {resendCountdown > 0 && (
                <>
                  <br />
                  <span>
                    in{' '}
                    <span
                      style={{
                        fontFamily: fonts.epilogue,
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '160%',
                        letterSpacing: '0%',
                        textAlign: 'center',
                        color: '#4640DE',
                      }}
                    >
                      {formatTime(resendCountdown)}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting || otp.join('').length !== 4}
            style={{
              width: '409px',
              maxWidth: '100%',
              height: '50px',
              gap: '10px',
              borderRadius: '80px',
              padding: '12px 24px',
              backgroundColor: isSubmitting || otp.join('').length !== 4 ? '#4640DE4D' : '#4640DE',
              color: colors.white,
              border: 'none',
              fontFamily: fonts.epilogue,
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '160%',
              letterSpacing: '0%',
              textAlign: 'center',
              cursor: isSubmitting || otp.join('').length !== 4 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              alignSelf: 'center',
            }}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

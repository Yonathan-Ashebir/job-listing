import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  general?: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      const response = await signup(formData);

      if (response.success) {
        // Store signup data in localStorage
        const signupDataToStore = {
          email: formData.email,
          signupData: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
          }
        };
        localStorage.setItem('job-listing-signup-data', JSON.stringify(signupDataToStore));

        setShowSuccess(true);
        // Navigate to verify email page after 2 seconds
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
          backgroundColor: '#ffffff',
          borderRadius: dimensions.borderRadius.card,
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: 'min-content'
          }}
        >
          {/* Header Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1
              style={{
                width: '100%',
                fontFamily: fonts.poppins,
                fontWeight: 900,
                fontSize: '32px',
                lineHeight: '120%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#25324B',
              }}
            >
              Sign Up Today!
            </h1>

            {/* Google Sign Up Button */}
            <button
              type="button"
              style={{
                width: '100%',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '5px',
                border: '1px solid #CCCCF5',
                padding: '12px 16px',
                backgroundColor: colors.white,
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.1712 8.36788H17.5V8.33329H9.99999V11.6666H14.7096C14.0225 13.607 12.1762 15 9.99999 15C7.23874 15 4.99999 12.7612 4.99999 9.99996C4.99999 7.23871 7.23874 4.99996 9.99999 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1858 2.52204 12.195 1.66663 9.99999 1.66663C5.39791 1.66663 1.66666 5.39788 1.66666 9.99996C1.66666 14.602 5.39791 18.3333 9.99999 18.3333C14.6021 18.3333 18.3333 14.602 18.3333 9.99996C18.3333 9.44121 18.2758 8.89579 18.1712 8.36788Z" fill="#FFC107" />
                <path d="M2.62749 6.12121L5.3654 8.12913C6.10624 6.29496 7.9004 4.99996 9.99999 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1858 2.52204 12.195 1.66663 9.99999 1.66663C6.79915 1.66663 4.02332 3.47371 2.62749 6.12121Z" fill="#FF3D00" />
                <path d="M10 18.3333C12.1525 18.3333 14.1083 17.5095 15.5871 16.17L13.0079 13.9875C12.1432 14.6451 11.0865 15.0008 10 15C7.83251 15 5.99209 13.6179 5.29876 11.6891L2.58126 13.7829C3.96043 16.4816 6.76126 18.3333 10 18.3333Z" fill="#4CAF50" />
                <path d="M18.1712 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.988L13.0079 13.9871L15.5871 16.1696C15.4046 16.3355 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1712 8.36796Z" fill="#1976D2" />
              </svg>
              <span
                style={{
                  fontFamily: fonts.epilogue,
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#4640DE',
                }}
              >
                Sign Up with Google
              </span>
            </button>

          </div>
          {/* Divider */}
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <div style={{ flexGrow: 1, height: '1px', border: '1px solid #D6DDEB' }} />
            <span
              style={{
                opacity: 0.5,
                fontFamily: fonts.epilogue,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '160%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#202430',
                padding: '0 16px',
              }}
            >
              Or Sign Up with Email
            </span>
            <div style={{ flexGrow: 1, height: '1px', border: '1px solid #D6DDEB' }} />
          </div>

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
              Account created successfully! Redirecting to email verification...
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                htmlFor="name"
                style={{
                  width: 'fit-content',
                  fontFamily: fonts.epilogue,
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#515B6F',
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '408px',
                  maxWidth: '100%',
                  height: '50px',
                  gap: '10px',
                  borderRadius: '7px',
                  border: `1px solid ${errors.name ? '#DC2626' : '#D6DDEB'}`,
                  padding: '12px 16px',
                  fontFamily: fonts.epilogue,
                  fontSize: typography.fontSizes.sm,
                  color: colors.gray.dark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p style={{ color: '#DC2626', fontSize: typography.fontSizes.xs, fontFamily: fonts.epilogue }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                htmlFor="email"
                style={{
                  width: 'fit-content',
                  fontFamily: fonts.epilogue,
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#515B6F',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '408px',
                  maxWidth: '100%',
                  height: '50px',
                  gap: '10px',
                  borderRadius: '7px',
                  border: `1px solid ${errors.email ? '#DC2626' : '#D6DDEB'}`,
                  padding: '12px 16px',
                  fontFamily: fonts.epilogue,
                  fontSize: typography.fontSizes.sm,
                  color: colors.gray.dark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p style={{ color: '#DC2626', fontSize: typography.fontSizes.xs, fontFamily: fonts.epilogue }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                htmlFor="password"
                style={{
                  width: 'fit-content',
                  fontFamily: fonts.epilogue,
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#515B6F',
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '408px',
                  maxWidth: '100%',
                  height: '50px',
                  gap: '10px',
                  borderRadius: '7px',
                  border: `1px solid ${errors.password ? '#DC2626' : '#D6DDEB'}`,
                  padding: '12px 16px',
                  fontFamily: fonts.epilogue,
                  fontSize: typography.fontSizes.sm,
                  color: colors.gray.dark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Enter password"
              />
              {errors.password && (
                <p style={{ color: '#DC2626', fontSize: typography.fontSizes.xs, fontFamily: fonts.epilogue }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  width: 'fit-content',
                  fontFamily: fonts.epilogue,
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#515B6F',
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '408px',
                  maxWidth: '100%',
                  height: '50px',
                  gap: '10px',
                  borderRadius: '7px',
                  border: `1px solid ${errors.confirmPassword ? '#DC2626' : '#D6DDEB'}`,
                  padding: '12px 16px',
                  fontFamily: fonts.epilogue,
                  fontSize: typography.fontSizes.sm,
                  color: colors.gray.dark,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p style={{ color: '#DC2626', fontSize: typography.fontSizes.xs, fontFamily: fonts.epilogue }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '80px',
                padding: '12px 24px',
                backgroundColor: isSubmitting ? colors.gray.medium : '#4640DE',
                color: colors.white,
                border: 'none',
                fontFamily: fonts.epilogue,
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '160%',
                letterSpacing: '0%',
                textAlign: 'center',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Continue'}
            </button>

            {/* Already have an account */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  opacity: 0.7,
                  fontFamily: fonts.epilogue,
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#202430',
                }}
              >
                Already have an account?
              </span>
              <Link
                to="/signin"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#4640DE',
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
            </div>

            {/* Terms of Service */}
            <p
              style={{
                fontFamily: fonts.epilogue,
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '160%',
                letterSpacing: '0%',
                color: '#7C8493',
                margin: 0,
              }}
            >
              By clicking 'Continue', you acknowledge that you have read and accepted our{' '}
              <a
                href="#"
                style={{
                  fontFamily: fonts.epilogue,
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#4640DE',
                  textDecoration: 'none',
                }}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                style={{
                  fontFamily: fonts.epilogue,
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  color: '#4640DE',
                  textDecoration: 'none',
                }}
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

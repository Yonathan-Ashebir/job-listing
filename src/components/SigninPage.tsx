import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const SigninPage = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
      const response = await signin(formData);
      
      if (response.success && response.data?.accessToken) {
        // Navigate to home page on successful signin
        navigate('/');
      } else {
        setErrors({ general: response.message || 'Sign in failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          width: 'min-content'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
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
              color: '#202430',
              margin: 0,
            }}
          >
            Welcome Back,
          </h1>
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#D6DDEB' }} />
          <div style={{ width: '145px' }} />
          <div style={{ flex: 1, height: '1px', backgroundColor: '#D6DDEB' }} />
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '408px',
              maxWidth: '100%',
              height: '50px',
              gap: '10px',
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
              alignSelf: 'center',
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Login'}
          </button>
        </form>

        {/* Don't have an account */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: fonts.epilogue,
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '160%',
              letterSpacing: '0%',
              color: '#202430',
            }}
          >
            Don't have an account?
          </span>
          <Link
            to="/signup"
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
            Sign Up
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;

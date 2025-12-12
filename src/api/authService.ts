/**
 * Authentication Service
 * Handles user signup, email verification, and signin
 * Base URL: https://akil-backend.onrender.com/
 */

const API_BASE_URL = 'https://akil-backend.onrender.com';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface VerifyEmailRequest {
  email: string;
  OTP: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    name?: string;
    email?: string;
    profilePicUrl?: string;
    role?: string;
    profileComplete?: boolean;
    profileStatus?: string;
  };
  errors?: any;
  count?: number;
}

/**
 * Signs up a new user
 * @param signupData - User signup information
 * @returns Promise with authentication response
 */
export async function signup(signupData: SignupRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const result: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    return result;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
}

/**
 * Verifies user email with OTP
 * @param verifyData - Email and OTP for verification
 * @returns Promise with verification response
 */
export async function verifyEmail(verifyData: VerifyEmailRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifyData),
    });

    const result: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Email verification failed');
    }

    return result;
  } catch (error) {
    console.error('Error during email verification:', error);
    throw error;
  }
}

/**
 * Signs in an existing user
 * @param signinData - User credentials
 * @returns Promise with authentication response containing access token
 */
export async function signin(signinData: SigninRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signinData),
    });

    const result: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Sign in failed');
    }

    return result;
  } catch (error) {
    console.error('Error during signin:', error);
    throw error;
  }
}

/**
 * Stores access token in localStorage
 * @param token - Access token to store
 */
export function storeToken(token: string): void {
  localStorage.setItem('job-listing-accessToken', token);
}

/**
 * Retrieves access token from localStorage
 * @returns Access token or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem('job-listing-accessToken');
}

/**
 * Removes access token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem('job-listing-accessToken');
}

/**
 * Checks if user is authenticated
 * @returns true if token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Stores user data in localStorage
 * @param userData - User data to store
 */
export function storeUserData(userData: {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  profileComplete?: boolean;
  profileStatus?: string;
}): void {
  localStorage.setItem('job-listing-user-data', JSON.stringify(userData));
}

/**
 * Retrieves user data from localStorage
 * @returns User data or null if not found
 */
export function getUserData(): {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  profileComplete?: boolean;
  profileStatus?: string;
} | null {
  try {
    const stored = localStorage.getItem('job-listing-user-data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading user data from localStorage:', e);
  }
  return null;
}

/**
 * Removes user data from localStorage
 */
export function removeUserData(): void {
  localStorage.removeItem('job-listing-user-data');
}


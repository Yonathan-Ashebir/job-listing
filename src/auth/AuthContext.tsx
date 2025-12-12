import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signup, signin, verifyEmail, getToken, storeToken, removeToken, storeUserData, getUserData, removeUserData } from '../api/authService';
import type { SignupRequest, SigninRequest, VerifyEmailRequest, AuthResponse } from '../api/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  profileComplete?: boolean;
  profileStatus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupRequest) => Promise<AuthResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<AuthResponse>;
  signin: (data: SigninRequest) => Promise<AuthResponse>;
  signout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and user data on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUserData = getUserData();
    
    if (storedToken) {
      setToken(storedToken);
      
      // Load user data from localStorage if available
      if (storedUserData) {
        setUser(storedUserData);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleSignup = async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await signup(data);
      // Signup doesn't return token, user needs to verify email first
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyEmail = async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    try {
      const response = await verifyEmail(data);
      // After verification, user can sign in
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSignin = async (data: SigninRequest): Promise<AuthResponse> => {
    try {
      const response = await signin(data);
      
      if (response.data?.accessToken) {
        const accessToken = response.data.accessToken;
        storeToken(accessToken);
        setToken(accessToken);
        
        // Set user from response data (new structure) and store in localStorage
        if (response.data.id && response.data.email && response.data.name) {
          const userData = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role || 'user',
            profilePicUrl: response.data.profilePicUrl,
            profileComplete: response.data.profileComplete,
            profileStatus: response.data.profileStatus,
          };
          setUser(userData);
          storeUserData(userData); // Store in localStorage for persistence
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSignout = () => {
    removeToken();
    removeUserData();
    setToken(null);
    setUser(null);
    // Navigation will be handled by the component using signout
    window.location.href = '/signin';
  };

  const refreshAuth = () => {
    const storedToken = getToken();
    const storedUserData = getUserData();
    
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
    
    if (storedUserData) {
      setUser(storedUserData);
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    signup: handleSignup,
    verifyEmail: handleVerifyEmail,
    signin: handleSignin,
    signout: handleSignout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


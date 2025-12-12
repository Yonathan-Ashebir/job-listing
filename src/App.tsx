import { Routes, Route, Navigate } from 'react-router-dom';
import ListingPage from './components/ListingPage';
import JobDetailsPage from './components/JobDetailsPage';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';
import VerifyEmailPage from './components/VerifyEmailPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job/:jobIndex"
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

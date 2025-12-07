import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListingPage from './components/ListingPage';
import JobDetailsPage from './components/JobDetailsPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/job/:jobIndex" element={<JobDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

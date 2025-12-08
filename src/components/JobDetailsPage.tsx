import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from './JobDetails';
import type { JobPosting } from '../types';
import { fetchOpportunityById } from '../services/api';
import { mapApiOpportunityToJobPosting } from '../utils/apiMapper';
import { apiOpportunitiesMap } from './ListingPage';
import jobDataJson from '../data/jobPostings.json';
import type { JobData } from '../types';
import { fonts } from '../theme/fonts';
import { colors } from '../theme/colors';

const jobData = jobDataJson as JobData;

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke={colors.gray.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const JobDetailsPage = () => {
  const { jobIndex } = useParams<{ jobIndex: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      if (!jobIndex) {
        setError('Job ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if it's a numeric index (backward compatibility with JSON data)
        const numericIndex = parseInt(jobIndex, 10);
        if (!isNaN(numericIndex) && numericIndex >= 0 && numericIndex < jobData.job_postings.length) {
          // Use JSON data for numeric indices
          setJob(jobData.job_postings[numericIndex]);
          setLoading(false);
          return;
        }

        // Check if it's in our map (from API)
        if (apiOpportunitiesMap.has(jobIndex)) {
          setJob(apiOpportunitiesMap.get(jobIndex)!);
          setLoading(false);
          return;
        }

        // Try to fetch from API by ID
        try {
          const apiOpportunity = await fetchOpportunityById(jobIndex);
          const mappedJob = mapApiOpportunityToJobPosting(apiOpportunity);
          apiOpportunitiesMap.set(jobIndex, mappedJob);
          setJob(mappedJob);
        } catch (apiError) {
          // If API fetch fails, check if it's a job- prefixed index
          if (jobIndex.startsWith('job-')) {
            const fallbackIndex = parseInt(jobIndex.replace('job-', ''), 10);
            if (!isNaN(fallbackIndex) && fallbackIndex >= 0) {
              // This shouldn't happen, but handle it gracefully
              setError('Job not found');
            } else {
              setError('Job not found');
            }
          } else {
            setError('Job not found');
          }
        }
      } catch (err) {
        console.error('Failed to load job:', err);
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p style={{ fontFamily: fonts.epilogue, color: colors.gray.dark }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 style={{ fontFamily: fonts.epilogue, fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: colors.gray.dark }}>
            Job not found
          </h1>
          {error && (
            <p style={{ fontFamily: fonts.epilogue, color: colors.gray.medium, marginBottom: '16px' }}>
              {error}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded"
            style={{
              fontFamily: fonts.epilogue,
              backgroundColor: colors.primary.blue,
              color: colors.white,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <button
          onClick={() => navigate('/')}
          className="mt-6 mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          style={{ fontFamily: fonts.epilogue }}
        >
          <BackArrowIcon />
          <span>Back to Job Listings</span>
        </button>
        <JobDetails job={job} />
      </div>
    </div>
  );
};

export default JobDetailsPage;


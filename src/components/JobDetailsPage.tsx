import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from './JobDetails';
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

  const index = jobIndex ? parseInt(jobIndex, 10) : -1;
  const job = index >= 0 && index < jobData.job_postings.length 
    ? jobData.job_postings[index] 
    : null;

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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


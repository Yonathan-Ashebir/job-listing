import { useState, useMemo } from 'react';
import type { JobPosting, JobData, SortOption } from '../types';
import JobCard from './JobCard';
import Headline from './Headline';
import jobDataJson from '../data/jobPostings.json';

const jobData = jobDataJson as JobData;

const JobListingDashboard = () => {
  const [sortBy, setSortBy] = useState<SortOption>('Most relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const jobs: JobPosting[] = jobData.job_postings;

  // Sort jobs based on selected option
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs];
    if (sortBy === 'Most recent') {
      // Sort by posted_on date (most recent first)
      return jobsCopy.sort((a, b) => {
        const dateA = new Date(a.about.posted_on).getTime();
        const dateB = new Date(b.about.posted_on).getTime();
        return dateB - dateA;
      });
    }
    // Most relevant - keep original order for now
    return jobsCopy;
  }, [sortBy, jobs]);

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto" style={{ maxWidth: '919px', padding: "72px 0px" }}>
        <Headline 
          resultsCount={sortedJobs.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          {paginatedJobs.map((job, index) => (
            <JobCard key={`${job.company}-${job.title}-${index}`} job={job} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded text-sm font-medium bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '1px solid #7C8493', color: '#7C8493', fontFamily: 'Epilogue' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 132, 147, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white'
                  }`}
                  style={currentPage === page ? { fontFamily: 'Epilogue' } : { border: '1px solid #7C8493', color: '#7C8493', fontFamily: 'Epilogue' }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = 'rgba(124, 132, 147, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded text-sm font-medium bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: '1px solid #7C8493', color: '#7C8493', fontFamily: 'Epilogue' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 132, 147, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingDashboard;


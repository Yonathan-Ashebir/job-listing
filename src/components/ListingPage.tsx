import { useState, useMemo, useEffect } from 'react';
import type { JobPosting, SortOption } from '../types';
import JobCard from './JobCard';
import Headline from './Headline';
import { fetchOpportunities } from '../api/api';
import { mapApiOpportunityToJobPosting } from '../utils/apiMapper';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useAuth } from '../auth/AuthContext';

// Store API opportunities with their IDs for navigation
export const apiOpportunitiesMap = new Map<string, JobPosting>();

const ListingPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>('Most relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bookmarkedIds } = useBookmarks();
  const { isAuthenticated } = useAuth();
  const itemsPerPage = 100;

  // Fetch opportunities from API
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiOpportunities = await fetchOpportunities();
        
        // Handle empty response
        if (!apiOpportunities || apiOpportunities.length === 0) {
          setError('No opportunities available at this time.');
          setJobs([]);
          setLoading(false);
          return;
        }
        
        const mappedJobs = apiOpportunities.map(mapApiOpportunityToJobPosting);
        
        // Store in map with API IDs for later reference
        apiOpportunities.forEach((apiOpp, index) => {
          if (apiOpp.id && mappedJobs[index]) {
            apiOpportunitiesMap.set(apiOpp.id, mappedJobs[index]);
          }
        });
        
        setJobs(mappedJobs);
      } catch (err) {
        console.error('Failed to load opportunities:', err);
        setError(err instanceof Error ? err.message : 'Failed to load job opportunities. Please try again later.');
        setJobs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  // Sort and filter jobs based on selected option
  const sortedJobs = useMemo(() => {
    let filtered = [...jobs];
    
    // Filter by bookmarked if selected
    if (sortBy === 'Bookmarked') {
      if (!isAuthenticated) {
        // If not authenticated, show empty list
        filtered = [];
      } else {
        // Filter to only show bookmarked jobs
        filtered = jobs.filter((job, index) => {
          // Find the API ID for this job
          let apiId: string | undefined;
          for (const [id, mappedJob] of apiOpportunitiesMap.entries()) {
            if (
              mappedJob.title === job.title &&
              mappedJob.company === job.company &&
              mappedJob.about.posted_on === job.about.posted_on
            ) {
              apiId = id;
              break;
            }
          }
          const jobId = apiId || index.toString();
          return bookmarkedIds.has(jobId);
        });
      }
    }
    
    // Sort by date if "Most recent" is selected
    if (sortBy === 'Most recent') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.about.posted_on).getTime();
        const dateB = new Date(b.about.posted_on).getTime();
        return dateB - dateA;
      });
    }
    
    return filtered;
  }, [jobs, sortBy, bookmarkedIds, isAuthenticated]);

  // Paginate jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedJobs.slice(startIndex, endIndex);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto" style={{ maxWidth: `calc(${dimensions.sizes.container.dashboardMaxWidth} + 40px)`, padding: `${dimensions.spacing.massive} 20px` }}>
        <Headline
          resultsCount={sortedJobs.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p style={{ fontFamily: fonts.epilogue, color: colors.gray.dark }}>Loading opportunities...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center max-w-md">
              <p style={{ fontFamily: fonts.epilogue, color: colors.primary.orange, fontSize: '18px', marginBottom: '8px' }}>
                Error loading opportunities
              </p>
              <p style={{ fontFamily: fonts.epilogue, color: colors.gray.dark }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded"
                style={{
                  fontFamily: fonts.epilogue,
                  backgroundColor: colors.primary.blue,
                  color: colors.white,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col" style={{ gap: dimensions.spacing.huge }}>
            {paginatedJobs.map((job, index) => {
              // Find the API ID for this job
              let apiId: string | undefined;
              for (const [id, mappedJob] of apiOpportunitiesMap.entries()) {
                if (
                  mappedJob.title === job.title &&
                  mappedJob.company === job.company &&
                  mappedJob.about.posted_on === job.about.posted_on
                ) {
                  apiId = id;
                  break;
                }
              }
              // Use API ID if found, otherwise use index
              const jobId = apiId || `job-${index}`;
              return (
                <JobCard key={`${job.company}-${job.title}-${index}`} job={job} jobIndex={index} jobId={jobId} />
              );
            })}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded border"
              style={{
                fontFamily: fonts.epilogue,
                backgroundColor: currentPage === 1 ? colors.gray.light : colors.white,
                color: currentPage === 1 ? colors.gray.dark : colors.gray.dark,
                borderColor: colors.gray.light,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className="px-4 py-2 rounded border"
                style={{
                  fontFamily: fonts.epilogue,
                  backgroundColor: currentPage === page ? colors.primary.blue : colors.white,
                  color: currentPage === page ? colors.white : colors.gray.dark,
                  borderColor: currentPage === page ? colors.primary.blue : colors.gray.light,
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded border"
              style={{
                fontFamily: fonts.epilogue,
                backgroundColor: currentPage === totalPages ? colors.gray.light : colors.white,
                color: currentPage === totalPages ? colors.gray.dark : colors.gray.dark,
                borderColor: colors.gray.light,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
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

export default ListingPage;


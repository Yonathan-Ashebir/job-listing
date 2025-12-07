import { useState, useMemo } from 'react';
import type { JobPosting, JobData, SortOption } from '../types';
import JobCard from './JobCard';
import Headline from './Headline';
import jobDataJson from '../data/jobPostings.json';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';

const jobData = jobDataJson as JobData;
export const allJobs: JobPosting[] = jobData.job_postings;

const ListingPage = () => {
  const [sortBy, setSortBy] = useState<SortOption>('Most relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const jobs: JobPosting[] = allJobs;

  // Sort jobs based on selected option
  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];
    if (sortBy === 'Most recent') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.about.posted_on).getTime();
        const dateB = new Date(b.about.posted_on).getTime();
        return dateB - dateA;
      });
    }
    return sorted;
  }, [jobs, sortBy]);

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
      <div className="mx-auto" style={{ maxWidth: dimensions.sizes.container.dashboardMaxWidth, padding: `${dimensions.spacing.massive} 0px` }}>
        <Headline
          resultsCount={sortedJobs.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="flex flex-col" style={{ gap: dimensions.spacing.huge }}>
          {paginatedJobs.map((job, index) => {
            const globalIndex = allJobs.findIndex((j: JobPosting) => 
              j.title === job.title && j.company === job.company && j.about.posted_on === job.about.posted_on
            );
            return (
              <JobCard key={`${job.company}-${job.title}-${index}`} job={job} jobIndex={globalIndex >= 0 ? globalIndex : index} />
            );
          })}
        </div>
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


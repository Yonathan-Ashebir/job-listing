import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JobPosting } from '../types';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useAuth } from '../auth/AuthContext';

interface JobCardProps {
  job: JobPosting;
  jobIndex: number;
  jobId?: string; // API job ID, used for navigation
}

interface CompanyLogoProps {
  src: string;
  alt: string;
  company: string;
}

const CompanyLogo = ({ src, alt, company }: CompanyLogoProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className="object-contain"
      style={{
        width: dimensions.sizes.image.width,
        height: dimensions.sizes.image.height,
      }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://via.placeholder.com/66x59?text=' + company.charAt(0);
      }}
    />
  );
};

interface TagProps {
  text: string;
  borderColor?: string;
  textColor: string;
  backgroundColor?: string;
}

const Tag = ({ text, borderColor, textColor, backgroundColor }: TagProps) => {
  return (
    <span
      className="inline-flex items-center rounded-full border border-solid justify-center flex-shrink-0"
      style={{
        borderRadius: dimensions.borderRadius.tag,
        borderColor: borderColor || 'transparent',
        backgroundColor: backgroundColor || 'transparent',
        paddingTop: backgroundColor ? dimensions.padding.locationBadge.top : dimensions.padding.tag.top,
        paddingRight: backgroundColor ? dimensions.padding.locationBadge.right : dimensions.padding.tag.right,
        paddingBottom: backgroundColor ? dimensions.padding.locationBadge.bottom : dimensions.padding.tag.bottom,
        paddingLeft: backgroundColor ? dimensions.padding.locationBadge.left : dimensions.padding.tag.left,
        minWidth: '60px',
        width: 'max-content'
      }}
    >
      <span
        style={{
          height: dimensions.heights.tag,
          color: textColor,
          fontFamily: fonts.epilogue,
          fontWeight: typography.fontWeights.semibold,
          fontSize: typography.fontSizes.xs,
          lineHeight: typography.lineHeights.normal,
          letterSpacing: typography.letterSpacing.none,
        }}
      >
        {text}
      </span>
    </span>
  );
};

const JobCard = ({ job, jobIndex, jobId }: JobCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  
  const isOnline = job.about.location.toLowerCase().includes('remote') || 
                   job.description.toLowerCase().includes('remote') ||
                   job.description.toLowerCase().includes('online');
  const locationType = isOnline ? 'Online' : 'In Person';

  // Use jobId if available (from API), otherwise use jobIndex (from JSON)
  const eventID = jobId || jobIndex.toString();
  const isBookmarked = bookmarkedIds.has(eventID);

  const handleCardClick = () => {
    const routeId = jobId || jobIndex.toString();
    navigate(`/job/${routeId}`);
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isAuthenticated) {
      setBookmarkError('Please sign in to bookmark jobs');
      setTimeout(() => setBookmarkError(null), 3000);
      return;
    }

    setIsToggling(true);
    setBookmarkError(null);

    try {
      await toggleBookmark(eventID);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update bookmark';
      setBookmarkError(errorMessage);
      setTimeout(() => setBookmarkError(null), 3000);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      data-testid="job-card"
      className="w-full flex justify-center items-center border border-solid p-6 hover:shadow-md transition-shadow relative"
      style={{
        borderRadius: dimensions.borderRadius.card,
        borderColor: colors.gray.light,
      }}
    >
      {/* Bookmark Button - Only show for authenticated users */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={handleBookmarkClick}
          disabled={isToggling}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: isToggling ? 'wait' : 'pointer',
            zIndex: 10,
            padding: 0,
          }}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isBookmarked ? colors.primary.blue : 'none'}
            stroke={isBookmarked ? colors.primary.blue : colors.gray.medium}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: isToggling ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Error message */}
      {bookmarkError && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '16px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: typography.fontSizes.xs,
            fontFamily: fonts.epilogue,
            zIndex: 20,
            maxWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {bookmarkError}
        </div>
      )}

      <div
        className="flex gap-6 w-full cursor-pointer"
        style={{ maxWidth: dimensions.sizes.container.maxWidth }}
        onClick={handleCardClick}
      >
        <CompanyLogo src={job.image} alt={`${job.company} logo`} company={job.company} />

        <div className="flex flex-col flex-1" style={{ gap: dimensions.spacing.sm }}>
          <span
            className="font-semibold"
            style={{
              height: dimensions.heights.title,
              fontFamily: fonts.epilogue,
              fontWeight: typography.fontWeights.semibold,
              fontSize: typography.fontSizes.md,
              lineHeight: typography.lineHeights.tight,
              letterSpacing: typography.letterSpacing.none,
              color: colors.gray.dark,
            }}
          >
            {job.title}
          </span>

          <div className="flex flex-row items-center p-0.5" style={{ gap: dimensions.spacing.sm }}>
            <span
              style={{
                fontFamily: fonts.epilogue,
                fontWeight: typography.fontWeights.regular,
                fontSize: typography.fontSizes.sm,
                lineHeight: typography.lineHeights.normal,
                letterSpacing: typography.letterSpacing.none,
                color: colors.gray.medium,
              }}
            >
              {job.company}
            </span>

            <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2" cy="2" r="2" fill={colors.gray.medium}/>
            </svg>

            <span
              style={{
                fontFamily: fonts.epilogue,
                fontWeight: typography.fontWeights.regular,
                fontSize: typography.fontSizes.sm,
                lineHeight: typography.lineHeights.normal,
                letterSpacing: typography.letterSpacing.none,
                color: colors.gray.medium,
              }}
            >
              {job.about.location}
            </span>
          </div>

          <span
            style={{
              fontFamily: fonts.epilogue,
              fontWeight: typography.fontWeights.regular,
              fontSize: typography.fontSizes.sm,
              lineHeight: typography.lineHeights.normal,
              letterSpacing: typography.letterSpacing.none,
              color: colors.gray.dark,
            }}
          >
            {job.description}
          </span>

          <div className="flex flex-row items-center" style={{ gap: dimensions.spacing.sm }}>
            <Tag
              text={locationType}
              textColor={colors.primary.green}
              backgroundColor={colors.primary.greenLight}
            />

            {job.about.categories.length > 0 && (
              <>
                <div
                  className="h-full"
                  style={{
                    width: dimensions.sizes.divider.width,
                    backgroundColor: colors.gray.light,
                  }}
                />

                <div className="flex flex-row items-center flex-wrap" style={{ gap: dimensions.spacing.sm }}>
                  {job.about.categories.map((category, index) => {
                    const isEven = index % 2 === 0;
                    const borderColor = isEven ? colors.primary.orange : colors.primary.blue;
                    const textColor = isEven ? colors.primary.orange : colors.primary.blue;

                    return (
                      <Tag
                        key={index}
                        text={category}
                        borderColor={borderColor}
                        textColor={textColor}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;


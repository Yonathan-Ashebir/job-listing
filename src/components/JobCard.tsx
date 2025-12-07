import type { JobPosting } from '../types';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

interface JobCardProps {
  job: JobPosting;
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
      className="inline-flex items-center rounded-full border border-solid"
      style={{
        borderRadius: dimensions.borderRadius.tag,
        borderColor: borderColor || 'transparent',
        backgroundColor: backgroundColor || 'transparent',
        paddingTop: backgroundColor ? dimensions.padding.locationBadge.top : dimensions.padding.tag.top,
        paddingRight: backgroundColor ? dimensions.padding.locationBadge.right : dimensions.padding.tag.right,
        paddingBottom: backgroundColor ? dimensions.padding.locationBadge.bottom : dimensions.padding.tag.bottom,
        paddingLeft: backgroundColor ? dimensions.padding.locationBadge.left : dimensions.padding.tag.left,
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

const JobCard = ({ job }: JobCardProps) => {
  const isOnline = job.about.location.toLowerCase().includes('remote') || 
                   job.description.toLowerCase().includes('remote') ||
                   job.description.toLowerCase().includes('online');
  const locationType = isOnline ? 'Online' : 'In Person';

  return (
    <div
      className="w-full flex justify-center items-center border border-solid p-6"
      style={{
        borderRadius: dimensions.borderRadius.card,
        borderColor: colors.gray.light,
      }}
    >
      <div className="flex gap-6 w-full" style={{ maxWidth: dimensions.sizes.container.maxWidth }}>
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

          <div className="flex flex-row items-center flex-wrap" style={{ gap: dimensions.spacing.sm }}>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;


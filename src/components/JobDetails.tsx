import type { JobPosting } from '../types';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

interface JobDetailsProps {
  job: JobPosting;
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_138_1217)">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 3.33335C6.31812 3.33335 3.33335 6.31812 3.33335 10C3.33335 13.6819 6.31812 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.31812 13.6819 3.33335 10 3.33335ZM1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10Z" fill={colors.primary.green}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M13.0893 7.74408C13.4147 8.06951 13.4147 8.59715 13.0893 8.92259L9.75594 12.2559C9.43051 12.5814 8.90287 12.5814 8.57743 12.2559L6.91076 10.5893C6.58533 10.2638 6.58533 9.73618 6.91076 9.41074C7.2362 9.08531 7.76384 9.08531 8.08928 9.41074L9.16669 10.4882L11.9108 7.74408C12.2362 7.41864 12.7638 7.41864 13.0893 7.74408Z" fill={colors.primary.green}/>
    </g>
    <defs>
      <clipPath id="clip0_138_1217">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5 10.5005C14.5 9.11924 13.3808 8 12.0005 8C10.6192 8 9.5 9.11924 9.5 10.5005C9.5 11.8808 10.6192 13 12.0005 13C13.3808 13 14.5 11.8808 14.5 10.5005Z" stroke={colors.primary.locationBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9995 21C10.801 21 4.5 15.8984 4.5 10.5633C4.5 6.38664 7.8571 3 11.9995 3C16.1419 3 19.5 6.38664 19.5 10.5633C19.5 15.8984 13.198 21 11.9995 21Z" stroke={colors.primary.locationBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => (
  <h2
    style={{
      height: dimensions.heights.sectionTitle,
      fontFamily: fonts.poppins,
      fontWeight: typography.fontWeights.black,
      fontSize: typography.fontSizes.sectionTitle,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.none,
      color: colors.gray.dark,
    }}
  >
    {children}
  </h2>
);

interface DescriptionContainerProps {
  description: string;
}

const DescriptionContainer = ({ description }: DescriptionContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.lg }}>
    <SectionTitle>Description</SectionTitle>
    <p
      style={{
        fontFamily: fonts.epilogue,
        fontWeight: typography.fontWeights.regular,
        fontSize: typography.fontSizes.sm,
        lineHeight: typography.lineHeights.normal,
        letterSpacing: typography.letterSpacing.none,
        color: colors.gray.dark,
      }}
    >
      {description}
    </p>
  </div>
);

interface ResponsibilitiesContainerProps {
  responsibilities: string[];
}

const ResponsibilitiesContainer = ({ responsibilities }: ResponsibilitiesContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.lg }}>
    <SectionTitle>Responsibilities</SectionTitle>
    <div className="flex flex-col" style={{ gap: dimensions.spacing.sm }}>
      {responsibilities.map((responsibility, index) => (
        <div key={index} className="flex flex-row items-center" style={{ gap: dimensions.spacing.sm }}>
          <div style={{ flexShrink: 0 }}>
            <CheckIcon />
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
            {responsibility}
          </span>
        </div>
      ))}
    </div>
  </div>
);

interface IdealCandidateContainerProps {
  idealCandidate: {
    age: string;
    gender: string;
    traits: string[];
  };
  jobTitle: string;
}

const getAgeLabel = (age: string): string => {
  if (age === 'Any') return '';
  if (age === '18-24') return 'Young';
  if (age === '25-34') return 'Mid-career';
  if (age === '35-44') return 'Experienced';
  if (age === '45+') return 'Senior';
  // For other formats, use the age range directly
  return age;
};

const IdealCandidateContainer = ({ idealCandidate, jobTitle }: IdealCandidateContainerProps) => {
  // Create the first trait if gender or age is not "Any"
  const shouldAddFirstTrait = idealCandidate.gender !== 'Any' || idealCandidate.age !== 'Any';
  
  let displayTraits = [...idealCandidate.traits];
  
  if (shouldAddFirstTrait) {
    const ageLabel = getAgeLabel(idealCandidate.age);
    const agePart = idealCandidate.age !== 'Any' 
      ? `${ageLabel} (${idealCandidate.age} years old)` 
      : '';
    const genderPart = idealCandidate.gender !== 'Any' ? idealCandidate.gender : '';
    const jobPart = jobTitle.toLowerCase();
    
    const parts = [agePart, genderPart, jobPart].filter(Boolean);
    const firstTrait = parts.join(' ');
    
    displayTraits = [firstTrait, ...displayTraits];
  }

  return (
    <div className="flex flex-col" style={{ gap: dimensions.spacing.lg }}>
      <SectionTitle>Ideal Candidate we want</SectionTitle>
      <div className="flex flex-col" style={{ gap: dimensions.spacing.sm }}>
        {displayTraits.map((trait, index) => {
          const isAutoGeneratedTrait = shouldAddFirstTrait && index === 0;
          const hasColon = trait.includes(':');
          
          if (!hasColon) {
            // No colon - show the whole string
            // If it's the auto-generated trait, use bold style (first part style)
            return (
              <div key={index} className="flex flex-row" style={{ gap: dimensions.spacing.sm }}>
                <svg 
                  width="4" 
                  height="4" 
                  viewBox="0 0 4 4" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ 
                    marginTop: '8px',
                    flexShrink: 0
                  }}
                >
                  <circle cx="2" cy="2" r="2" fill={colors.gray.dark}/>
                </svg>
                <span
                  style={{
                    fontFamily: fonts.epilogue,
                    fontWeight: isAutoGeneratedTrait ? typography.fontWeights.bold : typography.fontWeights.regular,
                    fontSize: typography.fontSizes.sm,
                    lineHeight: typography.lineHeights.normal,
                    letterSpacing: typography.letterSpacing.none,
                    color: colors.gray.dark,
                  }}
                >
                  {trait}
                </span>
              </div>
            );
          }
          
          // Has colon - split into label and description
          const parts = trait.split(':');
          const label = parts[0];
          const description = parts.slice(1).join(':').trim();

          return (
            <div key={index} className="flex flex-row" style={{ gap: dimensions.spacing.sm }}>
              <svg 
                width="4" 
                height="4" 
                viewBox="0 0 4 4" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ 
                  marginTop: '8px',
                  flexShrink: 0
                }}
              >
                <circle cx="2" cy="2" r="2" fill={colors.gray.dark}/>
              </svg>
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
                <span
                  style={{
                    fontFamily: fonts.epilogue,
                    fontWeight: typography.fontWeights.bold,
                    fontSize: typography.fontSizes.sm,
                    lineHeight: typography.lineHeights.normal,
                    letterSpacing: typography.letterSpacing.none,
                    color: colors.gray.dark,
                  }}
                >
                  {label}{description && ':'}
                </span>
                {description && ` ${description}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AboutRoleContainerProps {
  whenWhere: string;
}

const AboutRoleContainer = ({ whenWhere }: AboutRoleContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.xxl }}>
    <SectionTitle>When & Where</SectionTitle>
    <div className="flex flex-row items-center" style={{ gap: dimensions.spacing.extra }}>
      <div className="flex flex-row items-center" style={{ gap: dimensions.spacing.lg }}>
        <div
          className="flex items-center justify-center border border-solid rounded-full"
          style={{
            width: dimensions.details.iconContainer.width,
            height: dimensions.details.iconContainer.height,
            borderRadius: '50px',
            borderColor: colors.gray.light,
            padding: dimensions.padding.iconContainer,
          }}
        >
          <LocationIcon />
        </div>
        <span
          style={{
            height: dimensions.heights.locationText,
            fontFamily: fonts.epilogue,
            fontWeight: typography.fontWeights.regular,
            fontSize: typography.fontSizes.sm,
            lineHeight: typography.lineHeights.normal,
            letterSpacing: typography.letterSpacing.none,
            color: colors.gray.dark,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {whenWhere}
        </span>
      </div>
    </div>
  </div>
);

const PostedOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M12 3C13.4368 3 14.795 3.33671 16 3.93552C16 3.93552 14.8085 3.40681 14 3.22302C13.2337 3.0488 12 3 12 3ZM12 9V15M15 12H9" stroke={colors.primary.locationBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeadlineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.46777 8.39451L8.46552 8.39634L8.46338 8.39842L8.46777 8.39451ZM18.4219 8.20798C18.3523 8.14093 18.2751 8.08226 18.1919 8.03317C18.0741 7.96383 17.9433 7.9194 17.8076 7.90261C17.6719 7.88583 17.5343 7.89705 17.4031 7.93558C17.2719 7.97412 17.1501 8.03915 17.0451 8.12665C16.94 8.21415 16.8541 8.32227 16.7925 8.44431C16.448 9.123 15.9729 9.727 15.3945 10.2217C15.4829 9.72326 15.5275 9.21807 15.5278 8.71188C15.5296 7.17198 15.1234 5.65909 14.3504 4.32725C13.5775 2.9954 12.4654 1.89217 11.1274 1.12988C10.98 1.04633 10.8138 1.00159 10.6444 0.999869C10.4749 0.998144 10.3079 1.03949 10.1588 1.12003C10.0097 1.20056 9.88358 1.31765 9.79217 1.46029C9.70075 1.60294 9.64707 1.76648 9.63617 1.93555C9.58021 2.88373 9.33233 3.81067 8.90756 4.66022C8.48279 5.50977 7.88996 6.26424 7.165 6.87791L6.93453 7.06541C6.17644 7.5755 5.50543 8.20431 4.94723 8.92771C4.07955 10.0208 3.47848 11.3011 3.19169 12.6669C2.9049 14.0327 2.94028 15.4466 3.29503 16.7964C3.64977 18.1462 4.31412 19.3947 5.2354 20.4431C6.15667 21.4914 7.30953 22.3107 8.60254 22.8359C8.75436 22.898 8.91911 22.9217 9.08226 22.905C9.24542 22.8883 9.40195 22.8317 9.53807 22.7402C9.67419 22.6488 9.7857 22.5252 9.86277 22.3804C9.93984 22.2357 9.9801 22.0741 9.98 21.9101C9.97928 21.8041 9.96249 21.6987 9.9302 21.5976C9.70647 20.7567 9.64205 19.8813 9.74025 19.0166C10.6865 20.8013 12.2054 22.216 14.0528 23.0332C14.2782 23.1341 14.5332 23.1476 14.7681 23.0713C16.2277 22.6002 17.5425 21.7637 18.5877 20.6413C19.633 19.5189 20.3738 18.1479 20.74 16.6586C21.1061 15.1692 21.0853 13.611 20.6796 12.1319C20.2739 10.6528 19.4967 9.30209 18.4219 8.20798ZM14.5171 21.039C13.6454 20.5973 12.8765 19.977 12.2602 19.2185C11.644 18.46 11.1943 17.5804 10.9404 16.6367C10.8629 16.319 10.8029 15.9972 10.7607 15.6728C10.7322 15.4663 10.6398 15.2738 10.4965 15.1224C10.3532 14.9709 10.1661 14.868 9.96143 14.8281C9.89838 14.8157 9.83426 14.8095 9.77 14.8096C9.59424 14.8095 9.42158 14.8558 9.26941 14.9437C9.11725 15.0317 8.99096 15.1582 8.9033 15.3106C8.07357 16.7417 7.6563 18.3746 7.69773 20.0283C6.96797 19.4609 6.35808 18.7543 5.90341 17.9495C5.44873 17.1447 5.15832 16.2576 5.049 15.3397C4.93968 14.4218 5.01363 13.4914 5.26655 12.6023C5.51948 11.7131 5.94636 10.8831 6.52244 10.1602C6.95985 9.592 7.48753 9.09945 8.08444 8.70216C8.11029 8.68548 8.13507 8.66722 8.15866 8.64747C8.15866 8.64747 8.45535 8.40199 8.46549 8.39637C9.89019 7.19134 10.9035 5.57189 11.3642 3.76368C12.4538 4.77092 13.1803 6.10971 13.431 7.57219C13.6816 9.03467 13.4424 10.539 12.7505 11.8516C12.659 12.0267 12.6215 12.225 12.6427 12.4215C12.6638 12.6179 12.7427 12.8037 12.8693 12.9554C12.9959 13.107 13.1646 13.2178 13.3541 13.2737C13.5436 13.3297 13.7454 13.3282 13.9341 13.2696C15.4658 12.7894 16.8138 11.8515 17.7964 10.5821C18.3869 11.4544 18.773 12.4487 18.9259 13.4909C19.0787 14.5332 18.9944 15.5965 18.6792 16.6016C18.364 17.6068 17.826 18.5278 17.1054 19.2961C16.3847 20.0644 15.5 20.6602 14.5171 21.0391L14.5171 21.039Z" fill={colors.primary.locationBlue}/>
  </svg>
);

const StartDateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.25736 4.00736 5.25 5.25 5.25H18.75C19.9926 5.25 21 6.25736 21 7.5V18.75M3 18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75M3 18.75V11.25C3 10.0074 4.00736 9 5.25 9H18.75C19.9926 9 21 10.0074 21 11.25V18.75" stroke={colors.primary.locationBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12.8768C10 12.5906 10.3069 12.4092 10.5577 12.5471L14.4179 14.6703C14.6779 14.8132 14.6779 15.1868 14.4179 15.3297L10.5577 17.4529C10.3069 17.5908 10 17.4094 10 17.1232V12.8768Z" stroke={colors.primary.locationBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EndDateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.25736 4.00736 5.25 5.25 5.25H18.75C19.9926 5.25 21 6.25736 21 7.5V18.75M3 18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75M3 18.75V11.25C3 10.0074 4.00736 9 5.25 9H18.75C19.9926 9 21 10.0074 21 11.25V18.75" stroke={colors.primary.locationBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.7222L11.7778 16.5L14.4444 12.5" stroke={colors.primary.locationBlue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface AboutInfoItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const AboutInfoItem = ({ label, value, icon }: AboutInfoItemProps) => (
  <div className="flex flex-row items-start" style={{ gap: dimensions.spacing.lg }}>
    <div
      className="flex items-center justify-center border border-solid rounded-full"
      style={{
        width: dimensions.details.iconContainer.width,
        height: dimensions.details.iconContainer.height,
        borderRadius: '50px',
        borderColor: colors.gray.light,
        padding: dimensions.padding.aboutIconContainer,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <span
        style={{
          height: dimensions.heights.aboutLabel,
          fontFamily: fonts.epilogue,
          fontWeight: typography.fontWeights.regular,
          fontSize: typography.fontSizes.sm,
          lineHeight: typography.lineHeights.normal,
          letterSpacing: typography.letterSpacing.none,
          color: colors.text.label,
        }}
      >
        {label}
      </span>
      <span
        style={{
          height: dimensions.heights.aboutLabel,
          fontFamily: fonts.epilogue,
          fontWeight: typography.fontWeights.semibold,
          fontSize: typography.fontSizes.sm,
          lineHeight: typography.lineHeights.normal,
          letterSpacing: typography.letterSpacing.none,
          color: colors.gray.dark,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {value}
      </span>
    </div>
  </div>
);

const Divider = () => (
  <div
    style={{
      width: '100%',
      height: '1px',
      borderTop: `1px solid ${colors.gray.light}`,
    }}
  />
);

interface AboutContainerProps {
  job: JobPosting;
}

const AboutContainer = ({ job }: AboutContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.xxl }}>
    <SectionTitle>About</SectionTitle>
    <div className="flex flex-col" style={{ gap: dimensions.spacing.lg }}>
      <AboutInfoItem
        label="Posted On"
        value={job.about.posted_on}
        icon={<PostedOnIcon />}
      />
      <AboutInfoItem
        label="Deadline"
        value={job.about.deadline}
        icon={<DeadlineIcon />}
      />
      <AboutInfoItem
        label="Location"
        value={job.about.location}
        icon={<LocationIcon />}
      />
      <AboutInfoItem
        label="Start Date"
        value={job.about.start_date}
        icon={<StartDateIcon />}
      />
      <AboutInfoItem
        label="End Date"
        value={job.about.end_date}
        icon={<EndDateIcon />}
      />
    </div>
  </div>
);

interface CategoriesContainerProps {
  categories: string[];
}

const CategoriesContainer = ({ categories }: CategoriesContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.xxxl }}>
    <h3
      style={{
        height: dimensions.heights.sectionTitle,
        fontFamily: fonts.poppins,
        fontWeight: typography.fontWeights.black,
        fontSize: typography.fontSizes.sectionTitle,
        lineHeight: typography.lineHeights.tight,
        letterSpacing: typography.letterSpacing.none,
        color: colors.gray.dark,
      }}
    >
      Categories
    </h3>
    <div className="flex flex-row flex-wrap" style={{ gap: dimensions.spacing.sm }}>
      {categories.map((category, index) => {
        const isEven = index % 2 === 0;
        const backgroundColor = isEven ? colors.primary.orangeLight : colors.primary.greenLight;
        const textColor = isEven ? colors.primary.orange : colors.primary.green;

        return (
          <span
            key={index}
            className="inline-flex items-center rounded-full"
            style={{
              borderRadius: dimensions.borderRadius.tag,
              backgroundColor: backgroundColor,
              paddingTop: dimensions.padding.categoryTag.top,
              paddingRight: dimensions.padding.categoryTag.right,
              paddingBottom: dimensions.padding.categoryTag.bottom,
              paddingLeft: dimensions.padding.categoryTag.left,
            }}
          >
            <span
              style={{
                height: dimensions.heights.tag,
                fontFamily: fonts.epilogue,
                fontWeight: typography.fontWeights.semibold,
                fontSize: typography.fontSizes.xs,
                lineHeight: typography.lineHeights.normal,
                letterSpacing: typography.letterSpacing.none,
                color: textColor,
              }}
            >
              {category}
            </span>
          </span>
        );
      })}
    </div>
  </div>
);

interface RequiredSkillsContainerProps {
  skills: string[];
}

const RequiredSkillsContainer = ({ skills }: RequiredSkillsContainerProps) => (
  <div className="flex flex-col" style={{ gap: dimensions.spacing.xxxl }}>
    <h3
      style={{
        height: dimensions.heights.requiredSkillsTitle,
        fontFamily: fonts.poppins,
        fontWeight: typography.fontWeights.black,
        fontSize: typography.fontSizes.sectionTitle,
        lineHeight: typography.lineHeights.tight,
        letterSpacing: typography.letterSpacing.none,
        color: colors.gray.dark,
      }}
    >
      Required Skills
    </h3>
    <div className="flex flex-row flex-wrap" style={{ gap: dimensions.spacing.sm }}>
      {skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded"
          style={{
            backgroundColor: colors.skillBackground,
            paddingTop: dimensions.padding.skillItem.top,
            paddingRight: dimensions.padding.skillItem.right,
            paddingBottom: dimensions.padding.skillItem.bottom,
            paddingLeft: dimensions.padding.skillItem.left,
          }}
        >
          <span
            style={{
              height: dimensions.heights.skillItem,
              fontFamily: fonts.epilogue,
              fontWeight: typography.fontWeights.regular,
              fontSize: typography.fontSizes.sm,
              lineHeight: typography.lineHeights.normal,
              letterSpacing: typography.letterSpacing.none,
              color: colors.primary.blue,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {skill}
          </span>
        </span>
      ))}
    </div>
  </div>
);

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="flex flex-row" style={{ padding: dimensions.padding.details, gap: dimensions.spacing.xlarge }}>
      <div className="flex flex-col flex-1" style={{ paddingTop: dimensions.padding.detailsInner.top, paddingBottom: dimensions.padding.detailsInner.bottom, gap: dimensions.spacing.xxlarge }}>
        <DescriptionContainer description={job.description} />
        <ResponsibilitiesContainer responsibilities={job.responsibilities} />
        <IdealCandidateContainer idealCandidate={job.ideal_candidate} jobTitle={job.title} />
        <AboutRoleContainer whenWhere={job.when_where} />
      </div>
      <div className="flex flex-col" style={{ gap: dimensions.spacing.xl, maxWidth: '294px' }}>
        <AboutContainer job={job} />
        <Divider />
        <CategoriesContainer categories={job.about.categories} />
        <Divider />
        <RequiredSkillsContainer skills={job.about.required_skills} />
      </div>
    </div>
  );
};

export default JobDetails;


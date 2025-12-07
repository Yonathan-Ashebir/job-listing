import type { JobPosting } from '../types';

interface JobCardProps {
  job: JobPosting;
}

const JobCard = ({ job }: JobCardProps) => {
  const isOnline = job.about.location.toLowerCase().includes('remote') || 
                   job.description.toLowerCase().includes('remote') ||
                   job.description.toLowerCase().includes('online');
  const locationType = isOnline ? 'Online' : 'In Person';

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '30px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#D6DDEB',
        padding: '24px'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '24px',
          width: '100%',
          maxWidth: '844px'
        }}
      >
        <img
          src={job.image}
          alt={`${job.company} logo`}
          style={{
            width: '66px',
            height: '59px',
            objectFit: 'contain'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/66x59?text=' + job.company.charAt(0);
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1
          }}
        >
          <span
            style={{
              height: '24px',
              fontFamily: 'Epilogue',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#25324B'
            }}
          >
            {job.title}
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              padding: '0.5px'
            }}
          >
            <span
              style={{
                fontFamily: 'Epilogue',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '160%',
                letterSpacing: '0%',
                color: '#7C8493'
              }}
            >
              {job.company}
            </span>

            <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2" cy="2" r="2" fill="#7C8493"/>
            </svg>

            <span
              style={{
                fontFamily: 'Epilogue',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '160%',
                letterSpacing: '0%',
                color: '#7C8493'
              }}
            >
              {job.about.location}
            </span>
          </div>

          <span
            style={{
              fontFamily: 'Epilogue',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '160%',
              letterSpacing: '0%',
              color: '#25324B'
            }}
          >
            {job.description}
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                background: '#56CDAD1A',
                gap: '8px',
                borderRadius: '80px',
                paddingTop: '6px',
                paddingRight: '10px',
                paddingBottom: '6px',
                paddingLeft: '10px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontFamily: 'Epilogue',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '160%',
                  letterSpacing: '0%',
                  height: '19px',
                  color: '#56CDAD'
                }}
              >
                {locationType}
              </span>
            </span>

            {job.about.categories.length > 0 && (
              <>
                <div
                  style={{
                    height: '100%',
                    width: '1px',
                    backgroundColor: '#D6DDEB'
                  }}
                />

                {job.about.categories.map((category, index) => {
                  const isEven = index % 2 === 0;
                  const borderColor = isEven ? '#FFB836' : '#4640DE';
                  const textColor = isEven ? '#FFB836' : '#4640DE';

                  return (
                    <span
                      key={index}
                      style={{
                        gap: '8px',
                        borderRadius: '80px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: borderColor,
                        paddingTop: '5px', // Note: accouting for 1px border - different from how things are in figma
                        paddingRight: '9px', // Note: accouting for 1px border - different from how things are in figma
                        paddingBottom: '5px', // Note: accouting for 1px border - different from how things are in figma
                        paddingLeft: '9px', // Note: accouting for 1px border - different from how things are in figma
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          height: '19px',
                          color: textColor,
                          fontFamily: 'Epilogue',
                          fontWeight: 600,
                          fontSize: '12px',
                          lineHeight: '160%',
                          letterSpacing: '0%'
                        }}
                      >
                        {category}
                      </span>
                    </span>
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


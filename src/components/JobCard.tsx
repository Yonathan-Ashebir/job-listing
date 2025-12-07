import type { JobPosting } from '../types';

interface JobCardProps {
  job: JobPosting;
}

const JobCard = ({ job }: JobCardProps) => {
  // Determine if job is "In Person" or "Online" based on location
  // For now, we'll use a simple heuristic - if location contains specific keywords
  const isOnline = job.about.location.toLowerCase().includes('remote') || 
                   job.description.toLowerCase().includes('remote') ||
                   job.description.toLowerCase().includes('online');
  const locationType = isOnline ? 'Online' : 'In Person';

  return (
    <div className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow" style={{ border: '1px solid #7C8493' }}>
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img 
            src={job.image} 
            alt={`${job.company} logo`}
            className="w-16 h-16 object-contain rounded-lg"
            style={{ border: '1px solid #7C8493' }}
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/64?text=' + job.company.charAt(0);
            }}
          />
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          {/* Job Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>

          {/* Company Name */}
          <p className="text-sm mb-3" style={{ color: '#7C8493' }}>
            {job.company}
          </p>

          {/* Description */}
          <p className="text-sm mb-4 line-clamp-2" style={{ color: '#7C8493' }}>
            {job.description}
          </p>

          {/* Location Type and Tags */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Type Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {locationType}
            </span>

            {/* Industry Tags */}
            {job.about.categories.map((category, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#7C8493', color: '#ffffff' }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;


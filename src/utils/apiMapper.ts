/**
 * Utility functions to map API response data to our JobPosting interface
 */

import type { JobPosting } from '../types';
import type { ApiOpportunity } from '../services/api';

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jul 1, 2023")
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Splits a newline-separated string into an array
 * @param text - String with newlines
 * @returns Array of strings
 */
function splitByNewlines(text: string): string[] {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim().length > 0);
}

/**
 * Parses ideal candidate traits from the API string
 * The API provides a single string, we need to convert it to traits array
 * @param idealCandidate - String description of ideal candidate
 * @returns Array of trait strings
 */
function parseIdealCandidateTraits(idealCandidate: string): string[] {
  if (!idealCandidate) return [];
  
  // Try to split by common separators or return as single trait
  const traits = idealCandidate
    .split(/[.;]\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
  
  return traits.length > 0 ? traits : [idealCandidate];
}

/**
 * Maps API opportunity data to JobPosting interface
 * @param apiOpportunity - Opportunity data from API
 * @returns JobPosting object
 */
export function mapApiOpportunityToJobPosting(apiOpportunity: ApiOpportunity): JobPosting {
  // Convert responsibilities string to array
  const responsibilities = splitByNewlines(apiOpportunity.responsibilities);
  
  // Parse ideal candidate - API provides string, we need object with age, gender, traits
  // Since API doesn't provide age/gender, we'll use "Any" as default
  const idealCandidateTraits = parseIdealCandidateTraits(apiOpportunity.idealCandidate);
  
  // Format location array to string
  const locationString = apiOpportunity.location && apiOpportunity.location.length > 0
    ? apiOpportunity.location.join(', ')
    : 'Location not specified';
  
  return {
    title: apiOpportunity.title,
    description: apiOpportunity.description,
    responsibilities: responsibilities.length > 0 ? responsibilities : ['No specific responsibilities listed'],
    ideal_candidate: {
      age: 'Any', // API doesn't provide age
      gender: 'Any', // API doesn't provide gender
      traits: idealCandidateTraits,
    },
    when_where: apiOpportunity.whenAndWhere || 'Location and date to be determined',
    about: {
      posted_on: formatDate(apiOpportunity.datePosted),
      deadline: formatDate(apiOpportunity.deadline),
      location: locationString,
      start_date: formatDate(apiOpportunity.startDate),
      end_date: formatDate(apiOpportunity.endDate),
      categories: apiOpportunity.categories || [],
      required_skills: apiOpportunity.requiredSkills || [],
    },
    company: apiOpportunity.orgName || 'Organization',
    image: apiOpportunity.logoUrl || '/vite.svg', // Fallback to default image
  };
}


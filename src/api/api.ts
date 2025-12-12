/**
 * API Service for fetching job opportunities
 * Base URL: https://akil-backend.onrender.com/
 */

const API_BASE_URL = 'https://akil-backend.onrender.com';

export interface ApiOpportunity {
  id: string;
  title: string;
  description: string;
  responsibilities: string; // Newline-separated string
  requirements: string;
  idealCandidate: string;
  categories: string[];
  opType: 'inPerson' | 'virtual';
  startDate: string;
  endDate: string;
  deadline: string;
  location: string[];
  requiredSkills: string[];
  whenAndWhere: string;
  orgName: string;
  logoUrl: string;
  datePosted: string;
  status: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiOpportunity[] | null;
  errors: any;
  count: number;
}

export interface ApiSingleResponse {
  success: boolean;
  message: string;
  data: ApiOpportunity | null;
  errors: any;
}

/**
 * Fetches all opportunities from the API
 * @returns Promise with array of opportunities or null if error
 */
export async function fetchOpportunities(): Promise<ApiOpportunity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/opportunities/search`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch opportunities');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
}

/**
 * Fetches a single opportunity by ID
 * @param id - The opportunity ID
 * @returns Promise with opportunity object or null if error
 */
export async function fetchOpportunityById(id: string): Promise<ApiOpportunity> {
  try {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiSingleResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch opportunity');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    throw error;
  }
}


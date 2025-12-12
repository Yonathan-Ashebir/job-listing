/**
 * Bookmark Service
 * Handles bookmarking and unbookmarking job opportunities
 * Base URL: https://akil-backend.onrender.com/
 */

import { getToken } from './authService';

const API_BASE_URL = 'https://akil-backend.onrender.com';

export interface Bookmark {
  id: string;
  eventID: string;
  userId: string;
  createdAt?: string;
}

export interface BookmarkResponse {
  success: boolean;
  message: string;
  data?: Bookmark[];
  errors?: any;
  count?: number;
}

/**
 * Gets the authorization header with token
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Fetches all bookmarks for the authenticated user
 * @returns Promise with array of bookmarks
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please sign in to view bookmarks');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: BookmarkResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch bookmarks');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
}

/**
 * Creates a bookmark for a job opportunity
 * @param eventID - The job opportunity ID to bookmark
 * @returns Promise with bookmark response
 */
export async function createBookmark(eventID: string): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${eventID}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({}), // Empty body as per API spec
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please sign in to bookmark jobs');
      }
      if (response.status === 400) {
        throw new Error('Bad request: Invalid job ID or already bookmarked');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: BookmarkResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to create bookmark');
    }

    return result;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    throw error;
  }
}

/**
 * Removes a bookmark for a job opportunity
 * @param eventID - The job opportunity ID to unbookmark
 * @returns Promise with bookmark response
 */
export async function deleteBookmark(eventID: string): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${eventID}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please sign in to unbookmark jobs');
      }
      if (response.status === 404) {
        throw new Error('Bookmark not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: BookmarkResponse = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to delete bookmark');
    }

    return result;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
}


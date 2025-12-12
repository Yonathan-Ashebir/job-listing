import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getBookmarks, createBookmark, deleteBookmark } from '../api/bookmarkService';
import { useAuth } from '../auth/AuthContext';
import { getToken } from '../api/authService';

interface BookmarkContextType {
  bookmarkedIds: Set<string>;
  isLoading: boolean;
  toggleBookmark: (eventID: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

// Helper function to check if user is authenticated via Google
const isGoogleAuth = (): boolean => {
  const token = getToken();
  return token ? token.startsWith('google-') : false;
};

// Helper functions for localStorage per email
const getLocalStorageKey = (email: string): string => {
  return `job-listing-bookmarks-${email}`;
};

const loadBookmarksFromLocalStorage = (email: string): Set<string> => {
  try {
    const stored = localStorage.getItem(getLocalStorageKey(email));
    if (stored) {
      const bookmarks = JSON.parse(stored) as string[];
      return new Set(bookmarks);
    }
  } catch (e) {
    console.error('Error loading bookmarks from localStorage:', e);
  }
  return new Set();
};

const saveBookmarksToLocalStorage = (email: string, bookmarks: Set<string>): void => {
  try {
    const bookmarksArray = Array.from(bookmarks);
    localStorage.setItem(getLocalStorageKey(email), JSON.stringify(bookmarksArray));
  } catch (e) {
    console.error('Error saving bookmarks to localStorage:', e);
  }
};

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch bookmarks from API or localStorage
  const refreshBookmarks = useCallback(async () => {
    if (!isAuthenticated || !user?.email) {
      setBookmarkedIds(new Set());
      return;
    }

    // If Google auth, use localStorage per email
    if (isGoogleAuth()) {
      try {
        setIsLoading(true);
        const bookmarks = loadBookmarksFromLocalStorage(user.email);
        setBookmarkedIds(bookmarks);
      } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Otherwise, use API
    try {
      setIsLoading(true);
      const bookmarks = await getBookmarks();
      const ids = new Set(bookmarks.map(bookmark => bookmark.eventID));
      setBookmarkedIds(ids);
    } catch (error) {
      console.error('Error refreshing bookmarks:', error);
      // Don't clear bookmarks on error, keep current state
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  // Load bookmarks on mount and when auth state changes
  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  // Toggle bookmark with optimistic update
  const toggleBookmark = useCallback(async (eventID: string) => {
    if (!isAuthenticated || !user?.email) {
      throw new Error('Please sign in to bookmark jobs');
    }

    const isBookmarked = bookmarkedIds.has(eventID);
    
    // Optimistic update: immediately update UI
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (isBookmarked) {
        newSet.delete(eventID);
      } else {
        newSet.add(eventID);
      }
      return newSet;
    });

    try {
      // If Google auth, use localStorage per email
      if (isGoogleAuth()) {
        const newBookmarks = new Set(bookmarkedIds);
        if (isBookmarked) {
          newBookmarks.delete(eventID);
        } else {
          newBookmarks.add(eventID);
        }
        saveBookmarksToLocalStorage(user.email, newBookmarks);
        // No need to refresh, state is already updated optimistically
        return;
      }

      // Otherwise, use API
      if (isBookmarked) {
        await deleteBookmark(eventID);
      } else {
        await createBookmark(eventID);
      }
      
      // Refresh from server to ensure consistency
      await refreshBookmarks();
    } catch (error) {
      // Revert optimistic update on error
      setBookmarkedIds(prev => {
        const newSet = new Set(prev);
        if (isBookmarked) {
          newSet.add(eventID);
        } else {
          newSet.delete(eventID);
        }
        return newSet;
      });
      
      // Re-throw error so component can handle it
      throw error;
    }
  }, [isAuthenticated, user?.email, bookmarkedIds, refreshBookmarks]);

  const value: BookmarkContextType = {
    bookmarkedIds,
    isLoading,
    toggleBookmark,
    refreshBookmarks,
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}


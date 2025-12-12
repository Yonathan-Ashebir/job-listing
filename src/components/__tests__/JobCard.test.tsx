import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import JobCard from '../JobCard';
import { BookmarkProvider } from '../../contexts/BookmarkContext';
import { AuthProvider } from '../../auth/AuthContext';
import type { JobPosting } from '../../types';

// Mock the bookmark service
vi.mock('../../api/bookmarkService', () => ({
  getBookmarks: vi.fn(() => Promise.resolve([])),
  createBookmark: vi.fn(() => Promise.resolve({ success: true })),
  deleteBookmark: vi.fn(() => Promise.resolve({ success: true })),
}));

// Mock the auth service
vi.mock('../../api/authService', () => ({
  getToken: vi.fn(() => 'mock-token'),
  storeToken: vi.fn(),
  removeToken: vi.fn(),
  storeUserData: vi.fn(),
  getUserData: vi.fn(() => ({
    id: '1',
    name: 'Test User',
    email: 'test@a2sv.org',
    role: 'user',
  })),
  removeUserData: vi.fn(),
}));

const mockJob: JobPosting = {
  title: 'Software Engineer',
  company: 'Tech Corp',
  description: 'A great job opportunity',
  image: 'https://example.com/logo.png',
  about: {
    posted_on: '2024-01-01',
    deadline: '2024-02-01',
    location: 'Remote',
    start_date: '2024-03-01',
    end_date: '2024-12-31',
    categories: ['Technology', 'Engineering'],
    required_skills: ['JavaScript', 'React'],
  },
  responsibilities: ['Code', 'Test'],
  ideal_candidate: {
    age: '25-34',
    gender: 'Any',
    traits: ['Hardworking', 'Team player'],
  },
  when_where: 'Remote work',
};

const renderWithProviders = (component: ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <BookmarkProvider>
          {component}
        </BookmarkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('JobCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job card with correct information', () => {
    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('A great job opportunity')).toBeInTheDocument();
  });

  it('renders bookmark button for authenticated users', () => {
    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    const bookmarkButton = screen.getByTitle('Bookmark this job');
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('toggles bookmark when clicked', async () => {
    const { createBookmark } = await import('../../api/bookmarkService');
    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    const bookmarkButton = screen.getByTitle('Bookmark this job');
    
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(createBookmark).toHaveBeenCalledWith('test-id');
    });
  });

  it('shows bookmarked state when job is bookmarked', async () => {
    const { getBookmarks } = await import('../../api/bookmarkService');
    vi.mocked(getBookmarks).mockResolvedValueOnce([
      { id: '1', eventID: 'test-id', userId: '1' },
    ]);

    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    await waitFor(() => {
      const bookmarkButton = screen.getByTitle('Remove bookmark');
      expect(bookmarkButton).toBeInTheDocument();
    });
  });

  it('renders job card with clickable area', () => {
    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    const card = screen.getByTestId('job-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('cursor-pointer');
  });

  it('displays error message when bookmark fails', async () => {
    const { createBookmark } = await import('../../api/bookmarkService');
    vi.mocked(createBookmark).mockRejectedValueOnce(new Error('Failed to bookmark'));

    renderWithProviders(<JobCard job={mockJob} jobIndex={0} jobId="test-id" />);

    const bookmarkButton = screen.getByTitle('Bookmark this job');
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to bookmark/i)).toBeInTheDocument();
    });
  });
});


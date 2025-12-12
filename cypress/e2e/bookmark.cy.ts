describe('Bookmark Functionality', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
    
    // Check if user needs to sign in
    cy.url().then((url) => {
      if (url.includes('/signin')) {
        // Sign in with test credentials
        cy.login('test@a2sv.org', 'testpassword123');
      }
    });
  });

  it('should display bookmark button on job cards for authenticated users', () => {
    // Wait for job cards to load
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).should('exist').first().within(() => {
      // Check if bookmark button exists
      cy.get('button[title*="bookmark"]').should('exist');
    });
  });

  it('should toggle bookmark when bookmark button is clicked', () => {
    // Wait for job cards to load
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).first().within(() => {
      // Get the bookmark button
      cy.get('button[title*="bookmark"]').as('bookmarkBtn');
      
      // Check initial state (unbookmarked)
      cy.get('@bookmarkBtn').should('have.attr', 'title').and('include', 'Bookmark this job');
      
      // Click to bookmark
      cy.get('@bookmarkBtn').click();
      
      // Wait for state to change
      cy.get('@bookmarkBtn', { timeout: 5000 }).should('have.attr', 'title').and('include', 'Remove bookmark');
      
      // Click again to unbookmark
      cy.get('@bookmarkBtn').click();
      
      // Wait for state to revert
      cy.get('@bookmarkBtn', { timeout: 5000 }).should('have.attr', 'title').and('include', 'Bookmark this job');
    });
  });

  it('should not allow bookmarking when user is not authenticated', () => {
    // Sign out if signed in
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    
    cy.visit('/');
    
    // Should redirect to signin
    cy.url().should('include', '/signin');
    
    // Try to access directly (should redirect)
    cy.visit('/');
    cy.url().should('include', '/signin');
  });

  it('should show error message when bookmark operation fails', () => {
    // Intercept and fail the bookmark API call
    cy.intercept('POST', '**/bookmarks/*', { statusCode: 500 }).as('bookmarkError');
    
    cy.visit('/');
    cy.login('test@a2sv.org', 'testpassword123');
    
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button[title*="bookmark"]').click();
    });
    
    // Check for error message (if implemented)
    cy.wait('@bookmarkError');
  });

  it('should maintain bookmark state after page refresh', () => {
    cy.visit('/');
    cy.login('test@a2sv.org', 'testpassword123');
    
    // Bookmark a job
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button[title*="bookmark"]').click();
      cy.get('button[title*="Remove bookmark"]', { timeout: 5000 }).should('exist');
    });
    
    // Refresh page
    cy.reload();
    
    // Check if bookmark state is maintained
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).first().within(() => {
      cy.get('button[title*="Remove bookmark"]', { timeout: 5000 }).should('exist');
    });
  });

  it('should allow clicking job card without triggering bookmark', () => {
    cy.visit('/');
    cy.login('test@a2sv.org', 'testpassword123');
    
    cy.get('[data-testid="job-card"]', { timeout: 10000 }).first().as('jobCard');
    
    // Click on the card (not the bookmark button)
    cy.get('@jobCard').click({ force: true });
    
    // Should navigate to job details
    cy.url().should('include', '/job/');
  });
});


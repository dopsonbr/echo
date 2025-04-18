import { getGreeting } from '../support/app.po';

describe('Echo App', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for Angular to be ready
    cy.get('app-root').should('exist');
    cy.get('app-echo-form').should('exist');
    cy.get('textarea').should('be.visible');
  });

  it('should display the app header and form', () => {
    cy.get('h1').should('contain', 'Echo App');
    cy.get('textarea').should('exist');
    cy.get('button').should('contain', 'SUBMIT').and('be.disabled');
  });

  it('should enable submit button when text is entered', () => {
    cy.get('textarea').type('Hello World');
    cy.get('button').should('be.enabled');
  });

  it('should submit text and display the echoed result', () => {
    const testText = 'Testing echo functionality';
    
    // Intercept API call
    cy.intercept('POST', '**/api/echo').as('echoRequest');
    
    cy.get('textarea').type(testText);
    cy.get('button').click();

    // Wait for API response
    cy.wait('@echoRequest');

    // Check list items
    cy.get('.ant-list-items').should('exist');
    cy.get('.ant-list-item').first().should('contain', testText);
    
    // Verify processing time and timestamp are shown
    cy.get('.meta').first().should('contain', 'Processing Time');
    cy.get('.meta').first().should('contain', new Date().getFullYear());
  });

  it('should handle multiple submissions', () => {
    const texts = ['First message', 'Second message', 'Third message'];
    
    // Intercept API calls
    cy.intercept('POST', '**/api/echo').as('echoRequest');

    texts.forEach((text) => {
      cy.get('textarea').type(text);
      cy.get('button').click();
      cy.wait('@echoRequest');
      cy.get('.ant-list-items', { timeout: 10000 }).should('exist');
      cy.get('.ant-list-item', { timeout: 10000 }).first().should('contain', text);
    });

    // Verify all messages are displayed in reverse order
    texts.reverse().forEach((text, index) => {
      cy.get('.ant-list-item').eq(index).should('contain', text);
    });
  });

  it('should enforce character limit', () => {
    // Generate a string longer than 500 characters
    const longText = 'a'.repeat(501);
    
    cy.get('textarea').type(longText, { delay: 0 });
    
    // Debug: Log the actual value
    cy.get('textarea')
      .invoke('val')
      .then((val) => {
        const value = val as string;
        cy.log('Actual textarea value:', value);
        cy.log('Actual length:', value.length);
      });
    
    // Check the length is exactly 500
    cy.get('textarea').invoke('val').should('have.length', 500);
    
    // Verify all characters are 'a'
    cy.get('textarea').invoke('val').should('match', /^a{500}$/);
  });

  it('should clear form after successful submission', () => {
    // Intercept API call
    cy.intercept('POST', '**/api/echo').as('echoRequest');
    
    cy.get('textarea').type('Test message');
    cy.get('button').click();
    cy.wait('@echoRequest');
    cy.get('textarea').should('have.value', '');
  });

  it('should be responsive on mobile viewport', () => {
    // Set viewport to mobile size
    cy.viewport('iphone-6');
    
    // Check if the layout changes to column
    cy.get('.echo-container').should('have.css', 'flex-direction', 'column');
    
    // Verify form is still usable
    cy.intercept('POST', '**/api/echo').as('echoRequest');
    cy.get('textarea').type('Mobile test');
    cy.get('button').click();
    cy.wait('@echoRequest');
    cy.get('.ant-list-items', { timeout: 10000 }).should('exist');
    cy.get('.ant-list-item', { timeout: 10000 }).first().should('contain', 'Mobile test');
  });

  it('should show loading state during submission', () => {
    // Intercept API call but delay the response
    cy.intercept('POST', '**/api/echo', (req) => {
      req.reply({
        delay: 1000,
        body: { echo: 'Test loading', timestamp: new Date().toISOString() }
      });
    }).as('echoRequest');

    cy.get('textarea').type('Test loading');
    cy.get('button').click();
    
    // Check for loading state
    cy.get('button').should('have.class', 'ant-btn-loading');
    
    // Wait for submission to complete
    cy.wait('@echoRequest');
    cy.get('.ant-list-items', { timeout: 10000 }).should('exist');
    cy.get('.ant-list-item', { timeout: 10000 }).first().should('contain', 'Test loading');
  });

  it('should handle API errors gracefully', () => {
    // Intercept the API call and force an error
    cy.intercept('POST', '**/api/echo', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('echoRequest');

    cy.get('textarea').type('Error test');
    cy.get('button').click();

    // Wait for the failed request
    cy.wait('@echoRequest');

    // Verify error message is shown
    cy.get('.ant-message').should('be.visible');
    cy.get('.ant-message').should('contain', 'Failed to echo text');
  });

  it('should match the design system colors', () => {
    // Check header background color
    cy.get('header').should('have.css', 'background').and('include', 'rgb(63, 81, 181)');
    
    // Check text colors
    cy.get('h1').should('have.css', 'color', 'rgb(255, 255, 255)');
    
    // Submit a test message to check list item styling
    cy.get('textarea').type('Test message');
    cy.get('button').click();
    cy.get('.ant-list-item').first().should('have.css', 'background-color', 'rgb(249, 249, 249)');
  });

  it('should have proper card styling', () => {
    // Check input section card
    cy.get('.input-section').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('.input-section').should('have.css', 'border-radius', '4px');
    
    // Check results section card
    cy.get('.results-section').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get('.results-section').should('have.css', 'border-radius', '4px');
  });

  it('should have proper spacing and layout', () => {
    // Check container max width
    cy.get('main').should('have.css', 'max-width', '1200px');
    
    // Check section spacing
    cy.get('.echo-container').should('have.css', 'gap', '32px');
    
    // Check equal width sections in desktop view
    cy.get('.input-section').should('have.css', 'flex', '1 1 0%');
    cy.get('.results-section').should('have.css', 'flex', '1 1 0%');
  });

  it('should have proper footer styling', () => {
    cy.get('footer').should('exist');
    cy.get('footer').should('have.css', 'background').and('include', 'rgb(63, 81, 181)');
    cy.get('footer p').should('have.css', 'color', 'rgb(255, 255, 255)');
  });
});

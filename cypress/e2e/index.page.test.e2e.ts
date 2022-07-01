export {};

describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should set document title', () => {
    cy.title().should('eq', 'Home | In/Tangible European Heritage (InTaVia)');
  });

  it('should display page title', () => {
    cy.findByRole('heading', { name: 'Welcome to InTaVia!' }).should('be.visible');
  });
});

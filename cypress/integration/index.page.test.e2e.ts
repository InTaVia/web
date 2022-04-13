export {};

describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it.skip('should set document title', () => {
    cy.title().contains('Home');
  });

  it('should display page title', () => {
    cy.get('h1').contains('Welcome to InTaVia!');
  });
});

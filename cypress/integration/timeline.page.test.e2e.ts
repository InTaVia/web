export {};

describe('TimelinePage', () => {
  beforeEach(() => {
    /** Visit search page before timeline page, in order to populate the entities store with search results. */
    cy.visit('/search');
    cy.contains('Results');
    cy.findByRole('link', { name: 'Timeline' }).click();
    cy.location('pathname').should('include', 'timeline');
  });

  it('should set document title', () => {
    cy.title().should('eq', 'Timeline | In/Tangible European Heritage (InTaVia)');
  });

  it('should display page title', () => {
    cy.findByRole('heading', { name: 'Timeline' }).should('be.visible');
  });

  it('should display a tooltip on hover over a person', () => {
    cy.get('svg#timeline g[id^="person-"]').first().trigger('mouseover');
    cy.get('[role="tooltip"] h5').contains('Deborah Knoll V');
  });

  it('should create a timeline brush', () => {
    cy.window().then((window) => {
      cy.get('svg#timeline').should('be.visible');

      cy.get('svg#timeline g#x-axis__brush rect.overlay').then((element) => {
        const { top, left, width, height } = (
          element[0] as unknown as SVGRectElement
        ).getBoundingClientRect();

        cy.get('svg#timeline g#x-axis__brush rect.overlay')
          .trigger('mousedown', {
            view: window,
            force: true,
            clientX: left + width / 4,
            clientY: top + height / 2,
          })
          .trigger('mousemove', {
            force: true,
            view: window,
            clientX: left + width / 2,
            clientY: top + height / 2,
          })
          .trigger('mouseup', {
            force: true,
            view: window,
            clientX: left + width / 2,
            clientY: top + height / 2,
          });

        cy.get('svg#timeline g#x-axis__brush rect.selection')
          .should('have.attr', 'x')
          .and('not.be.null');
        cy.get('svg#timeline g#x-axis__brush rect.selection')
          .should('have.css', 'display')
          .and('not.equal', 'none');
      });
    });
  });
});

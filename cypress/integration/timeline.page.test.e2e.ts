import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';

describe('TimelinePage', () => {
  beforeEach(() => {
    cy.visit('/timeline');
  });

  it.skip('should set document title', () => {
    cy.window().title().contains('Timeline');
  });

  it('should display page title', () => {
    cy.get('h1').contains('Timeline');
  });

  it('should display first page of search results and hide loading message', () => {
    const loadingMessage = 'Loading';

    cy.contains(loadingMessage);
    cy.get('svg#timeline g[id^="person-"]').should('have.length', 10);
    cy.contains(loadingMessage).should('not.exist');
  });

  it('should update search results when search form submitted via button', () => {
    const searchTerm = 'emily';

    cy.findByRole('searchbox').type(searchTerm);
    cy.findByRole('button', { name: 'Search' }).click();
    cy.location('search').should('include', `q=${searchTerm}`);

    cy.get('svg#timeline g[id^="person-"]').should('have.length', 1);
  });

  it('should update search results when search form submitted via keyboard', () => {
    const searchTerm = 'emily';

    cy.findByRole('searchbox').type(searchTerm + '{enter}');
    cy.location('search').should('include', `q=${searchTerm}`);

    cy.get('svg#timeline g[id^="person-"]').should('have.length', 1);
  });

  it('should populate search field with search term from search params', () => {
    const searchTerm = 'emily';

    cy.visit(`/search?q=${searchTerm}`);
    cy.findByRole('searchbox').should('have.value', searchTerm);
  });

  it('should display error notification when search request fails', () => {
    cy.window().then((window) => {
      const { rest, worker } = window.msw;

      worker.use(
        rest.get(
          String(createIntaviaApiUrl({ pathname: '/api/persons' })),
          (request, response, context) => {
            return response(context.status(500));
          },
        ),
      );

      const errorMessage = 'Rejected';

      cy.clock();
      cy.get('#__next').findByRole('alert').contains(errorMessage);
      cy.contains('Nothing to see');
      cy.tick(10000);
      cy.get('#__next').contains(errorMessage).should('not.exist');
    });
  });

  it('should display message when no search results found', () => {
    cy.visit('/search?q=123');
    cy.contains('Nothing to see');
  });

  it('should display a tooltip on hover over a person', () => {
    cy.get('svg#timeline g[id^="person-"]').first().trigger('mouseover');
    cy.get('[role="tooltip"] h5').contains('Deborah Knoll V');
  });

  it('should create a timeline brush', () => {
    cy.window().then((win) => {
      cy.get('svg#timeline').should('be.visible');

      cy.get('svg#timeline g#x-axis__brush rect.overlay').then((el) => {
        const { top, left, width, height } = (
          el[0] as unknown as SVGRectElement
        ).getBoundingClientRect();

        cy.get('svg#timeline g#x-axis__brush rect.overlay')
          .trigger('mousedown', {
            view: win,
            force: true,
            clientX: left + width / 4,
            clientY: top + height / 2,
          })
          .trigger('mousemove', {
            force: true,
            view: win,
            clientX: left + width / 2,
            clientY: top + height / 2,
          })
          .trigger('mouseup', {
            force: true,
            view: win,
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

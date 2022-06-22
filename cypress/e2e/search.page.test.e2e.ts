import { createIntaviaApiUrl } from '@/lib/create-intavia-api-url';

describe('SearchPage', () => {
  beforeEach(() => {
    cy.visit('/search');
  });

  it('should set document title', () => {
    cy.title().should('eq', 'Search | In/Tangible European Heritage (InTaVia)');
  });

  it('should display page title', () => {
    cy.findByRole('heading', { name: 'Search' }).should('be.visible');
  });

  it('should display first page of search results and hide loading message', () => {
    const loadingMessage = 'Loading';

    cy.contains(loadingMessage);
    cy.get('article').should('have.length', 10);
    cy.contains(loadingMessage).should('not.exist');
  });

  it('should add aria-current to current page in pagination', () => {
    cy.findByRole('link', { name: 'page 1' })
      .should('have.attr', 'href', '/search')
      .should('have.attr', 'aria-current', 'true');
    cy.findByRole('link', { name: 'Go to page 2' })
      .should('have.attr', 'href', '/search?page=2')
      .should('not.have.attr', 'aria-current');
  });

  it('should go to next search results page when pagination link clicked', () => {
    cy.findByRole('link', { name: 'Go to next page' }).click();
    cy.location('search').should('include', 'page=2');
  });

  it('should update search results when search form submitted via button', () => {
    const searchTerm = 'emily';

    cy.findByRole('searchbox').type(searchTerm);
    cy.findByRole('button', { name: 'Search' }).click();
    cy.location('search').should('include', `q=${searchTerm}`);

    cy.get('article').should('have.length', 1);
  });

  it('should update search results when search form submitted via keyboard', () => {
    const searchTerm = 'emily';

    cy.findByRole('searchbox').type(searchTerm + '{enter}');
    cy.location('search').should('include', `q=${searchTerm}`);

    cy.get('article').should('have.length', 1);
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
});

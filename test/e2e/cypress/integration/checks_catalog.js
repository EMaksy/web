import {
  availableChecks,
  checkDataByProvider,
} from '../fixtures/checks-catalog/available_checks';

context('Checks catalog', () => {
  before(() => {
    cy.navigateToItem('Checks catalog');
    cy.url().should('include', '/catalog');
  });

  describe('Checks catalog should be available', () => {
    it('should show 5 check groups in the catalog', () => {
      cy.get('div.check-group').should('have.length', 5);
    });
    it('should show 35 checks in the catalog', () => {
      cy.get('div.check-row').should('have.length', 34);
    });
  });

  describe('Checks grouping and identification is correct', () => {
    availableChecks.forEach((checks, group) => {
      it(`should include group '${group}'`, () => {
        cy.get('.check-group > div > h3').should('contain', group);
      });
      checks.forEach((checkId) => {
        it(`should include check '${checkId}'`, () => {
          cy.get('.check-row').should('contain', checkId);
        });
      });
    });
  });

  describe('Provider selection', () => {
    checkDataByProvider.forEach((checkData, provider) => {
      it(`should include the correct check data '${checkData} for provider '${provider}'`, () => {
        cy.get('.cloud-provider-selection-dropdown').click();
        cy.get('.cloud-provider-selection-dropdown')
          .get('span')
          .contains(provider)
          .click();
        cy.get('div.check-row').first().should('contain', checkData);
      });
    });
  });

  describe('Individual checks data is expanded', () => {
    it('should expand check data when clicked', () => {
      cy.get('div.check-row')
        .first()
        .parent()
        .invoke('attr', 'id')
        .then(() => {
          cy.get('div.check-row').first().click();
          cy.get(`.check-panel`).should('exist');
          cy.get('div.check-row').first().click();
          cy.get('.check-panel').should('not.exist');
        });
    });
  });
});

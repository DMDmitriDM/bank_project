/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Начало тестирования', () => {
  beforeEach(() => {
    cy.intercept('/accounts').as('accountsList');
    cy.intercept('/account/74213041477477406320783754').as('account');
    cy.visit('http://localhost:8080/');
  });

  it('Перевести деньги', () => {
    cy.get('[id=id-login-input]').type('developer');
    cy.get('[id=id-password-input]').type('skillbox');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    // cy.wait(3000);
    cy.url().should('include', '/accounts');
    // cy.intercept('/accounts').as('accountsList');
    cy.wait('@accountsList');

    cy.contains('.account-card', '74213041477477406320783754').within(() => {
      cy.get('.account-card-btn').click();
    });

    // wait
    // cy.wait(3000);
    cy.url().should('include', '/account/74213041477477406320783754');
    cy.wait('@account');

    cy.get('.caption-account__balance-value').then((captionBalance) => {
      const balance = captionBalance.text();

      cy.get('[id=id-receiver-input]').type('61253747452820828268825011');
      cy.get('[id=id-sum-input]').type('3000');
      cy.get('[id=id-form-send-btn]').should('not.be.disabled');
      cy.get('[id=id-form-send-btn]').click();

      // wait
      cy.wait(5000);
      cy.url().should('include', '/account/74213041477477406320783754');
      // cy.wait('@account');

      cy.get('.caption-account__balance-value').then((captionBalanceNew) => {
        const balanceNew = captionBalanceNew.text();
        expect(parseInt(balance)).not.to.equal(parseInt(balanceNew));
      });
    });
  });
});

/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Начало тестирования', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('Список не должен быть пустым', () => {
    cy.get('[id=id-login-input]').type('developer');
    cy.get('[id=id-password-input]').type('skillbox');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    cy.wait(3000);
    cy.url().should('include', '/accounts');
    cy.get('.box-accounts').children().should('not.have.length', 0);
  });

  it('Создание нового счёта', () => {
    cy.get('[id=id-login-input]').type('developer');
    cy.get('[id=id-password-input]').type('skillbox');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    cy.wait(3000);
    cy.url().should('include', '/accounts');
    cy.get('.box-accounts')
      .children()
      .its('length')
      .then((count) => {
        cy.get('[id=id-caption-accounts-btn]').click();

        // wait
        cy.wait(3000);
        cy.url().should('include', '/accounts');
        cy.get('.box-accounts')
          .children()
          .its('length')
          .then((countNew) => {
            expect(count).not.to.equal(countNew);
          });
      });
  });
});

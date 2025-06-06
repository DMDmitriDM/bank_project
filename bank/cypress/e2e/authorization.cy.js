/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Начало тестирования', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });

  it('Авторизация - не верный логин', () => {
    cy.get('[id=id-login-input]').type('badlogin');
    cy.get('[id=id-password-input]').type('developer');
    cy.get('[id=id-form-login-btn]').should('not.be.disabled');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    cy.wait(3000);
    cy.get('[id=id-form-login-btn]').should('be.disabled');
    cy.url().should('not.include', '/accounts');
  });

  it('Авторизация - не верный пароль', () => {
    cy.get('[id=id-login-input]').type('developer');
    cy.get('[id=id-password-input]').type('developer');
    cy.get('[id=id-form-login-btn]').should('not.be.disabled');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    cy.wait(3000);
    cy.get('[id=id-form-login-btn]').should('be.disabled');
    cy.url().should('not.include', '/accounts');
  });

  it('Авторизация - вход', () => {
    cy.get('[id=id-login-input]').type('developer');
    cy.get('[id=id-password-input]').type('skillbox');
    cy.get('[id=id-form-login-btn]').should('not.be.disabled');
    cy.get('[id=id-form-login-btn]').click();

    // wait
    cy.wait(3000);
    cy.url().should('include', '/accounts');
  });
});

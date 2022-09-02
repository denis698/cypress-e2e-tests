import "@testing-library/cypress/add-commands";

import users from "./users.json";

const DEFAULT_USER_KEY = "signInTestUser";
export const DEFAULT_USER = users[DEFAULT_USER_KEY];

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('forceClick', {prevSubject: 'element'}, (subject, options) => {
  cy.wrap(subject).click({force: true})
});

Cypress.Commands.add("loginViaUI", (username, password) => {
  //given
  cy.intercept('POST', '/api/token').as("signIn")

  cy.visit("/");
  cy.url().should('include', '/login?continue_to=%2F');
  cy.title().should('eq', 'Sign in to Nexudus Platform');

  let loginUrl = "";
  cy.url().then(url => {
    loginUrl = url
    cy.log('Login URL is : ' + loginUrl)
  })

  //when
  cy.get('input[name="Email"]', {timeout: 20000}).should('be.visible').type(username);
  cy.get('input[name="Password"]').should('be.visible').type(password);
  cy.findByRole('button', {name: /Sign in/i}).click();

  cy.wait('@signIn', {timeout: 30000}).its('response.statusCode').should('eq', 200);

  //then
  cy.url().should('include', 'dashboards/now', {timeout: 20000});
  cy.url().then(url => {
    cy.log('Dashboard URL is : ' + url)
  })
  cy.url().should('not.eq', loginUrl);
  cy.title().should('eq', 'Kalkio Space - East Side');
  cy.get('._headerLocationMenu-module__currentLocation').should("be.visible").should('have.text', 'Kalkio Space - East Side');;
  cy.get('.euiPage').should("be.visible");
  cy.get('.recharts-surface').should("be.visible");
});

Cypress.Commands.add("accessProductsFromDashboard", () => {
  cy.get('[href="/billing"]').should("be.visible").should('have.text', 'Inventory').click();
  cy.get('.euiCard__titleAnchor[href="/billing/products"]').should('be.visible').should('have.text', 'Products').click()
  cy.url().should('include', '/billing/products?s_product=', {timeout: 10000});

  let productsUrl = "";
  cy.url().then(url => {
    productsUrl = url
    cy.log('Products URL is : ' + url)
  })

  cy.url().should('include', productsUrl);
  cy.title().should('eq', 'Products list - Kalkio Space - East Side');
  cy.findByRole('button', {name: /Add product/i}).should("be.visible");
});

Cypress.Commands.add("addNewProject", (projectName, projectDescription, projectPrice) => {
  cy.findByText(projectName).should('not.exist');
  cy.findByRole('button', {name: /Add product/i}).click();
  cy.get('.euiModalHeader__title').should("be.visible").should('have.text', 'Add product');
  cy.findByRole('button', {name: /Manual entry/i}).click();
  cy.get('button[aria-label="Close this dialog"]').should("be.visible");
  cy.findByRole('button', {name: /Save changes/i}).should("be.visible");

  cy.get('input[data-test-subj="product_Name"]').should('be.visible').type(projectName);
  cy.get('textarea[data-test-subj="product_Description"]').should('be.visible')
      .type(projectDescription);
  cy.get('input[data-test-subj="product_Price"]').should('be.visible').click().wait(1000);
  cy.get('input[data-test-subj="product_Price"]').should('be.visible').clear().type(projectPrice);

  cy.get('button[data-test-subj="product_Visible"]').should("be.visible").click();
  cy.findByRole('button', {name: /Save changes/i}).should("be.visible").click();
  cy.findAllByText(projectName).should('have.length', 1)
  cy.findByText(projectName).should('exist');
});

Cypress.Commands.add("deleteFirstProject", (projectName) => {
  cy.findByText(projectName).should('exist').wait(2000);
  cy.get('input[type="checkbox"][aria-label="Select this row"]').first().click();
  cy.findByRole('button', {name: /Assign to all resources/i}).should("be.visible");
  cy.findByRole('button', {name: /Copy product/i}).should("be.visible");
  cy.findByRole('button', {name: /Adjust stock/i}).should("be.visible");
  cy.get('button[aria-label="Close this dialog"]').should("be.visible");

  cy.findByRole('button', {name: /Delete 1 record/i}).click();
  cy.get('[data-test-subj="confirmModalTitleText"]').should("be.visible").should('have.text', 'Delete \'0_CambridgeOffice (100.00 USD)\'?');
  cy.findByRole('button', {name: /Yes, do it/i}).click();
  cy.get('[aria-label="Notification"]').should("be.visible").should('have.text', 'Delete completed');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

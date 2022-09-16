import users from "../support/users.json";

const signInTestUser = users["signInTestUser"];
const invalidTestUser = users["invalidTestUser"];

describe("Log-in", () => {

  it("#001 - log-in page shows a clear error message when invalid details are provided", () => {
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
    cy.get('input[name="Email"]', {timeout: 20000}).should('be.visible').type(invalidTestUser['username']);
    cy.get('input[name="Password"]').should('be.visible').type(invalidTestUser['password']);
    cy.findByRole('button', {name: /Sign in/i}).click();

    cy.wait('@signIn', {timeout: 30000}).its('response.statusCode').should('eq', 400);

    //then
    cy.url().should('include', '/login?continue_to=%2F');
    cy.url().then(url => {
      cy.log('SignIn URL is : ' + url)
    })
    cy.url().should('include', loginUrl);
    cy.title().should('eq', 'Sign in to Nexudus Platform');
    cy.get('.euiCallOut--danger').should("be.visible").should('have.text', 'The email or password is incorrect.');;
  });

  it("#002 - log-in page logs user in when valid details are provided", () => {
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
    cy.get('input[name="Email"]', {timeout: 20000}).should('be.visible').type(signInTestUser['username']);
    cy.get('input[name="Password"]').should('be.visible').type(signInTestUser['password']);
    cy.findByRole('button', {name: /Sign in/i}).click();

    cy.wait('@signIn', {timeout: 30000}).its('response.statusCode').should('eq', 200);

    //then
    cy.url().should('include', 'dashboards/now', {timeout: 20000});
    cy.url().then(url => {
      cy.log('Dashboard URL is : ' + url)
    })
    cy.url().should('not.eq', loginUrl);
    cy.title().should('eq', 'Kalkio Space - East Side');
    cy.get('._headerLocationMenu-module__currentLocation').should("be.visible").should('have.text', 'Kalkio Space - East Side');
    cy.get('.euiPage').should("be.visible");
    cy.get('.recharts-surface').should("be.visible");
    cy.get('[aria-label="John Doe"]').should("be.visible");
  });

});

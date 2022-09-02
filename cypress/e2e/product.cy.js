import {DEFAULT_USER} from "../support/commands";
import users from "../support/users.json";

const { username, password } = DEFAULT_USER;

const projectName = "0_CambridgeOffice";
const projectDescription = "This is a new project in Cambridge. Please contact denis.gershengoren@nexudus.com for more details";
const projectPrice = "100";

describe("New Product", () => {

  it("#003 - Can add and delete a product from the products list", () => {
    //given
    cy.loginViaUI(username, password);
    cy.accessProductsFromDashboard();

    //when
    cy.addNewProject(projectName, projectDescription, projectPrice);

    //and
    cy.deleteFirstProject(projectName);

    //then
    cy.findByText(projectName).should('not.exist');
    cy.get('input[type="checkbox"][aria-label="Select this row"]').first().should('not.have.text', projectName);
  });

});

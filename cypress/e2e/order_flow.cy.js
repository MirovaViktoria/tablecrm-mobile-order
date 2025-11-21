describe('TableCRM Mobile Order Flow', () => {
    const TEST_TOKEN = 'af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77';

    beforeEach(() => {
        // Clear local storage to ensure fresh start
        cy.clearLocalStorage();
    });

    it('completes the full order creation journey', () => {
        // 1. Authentication
        cy.visit('/');
        cy.contains('TableCRM Login').should('be.visible');

        cy.get('input[placeholder="Enter your API token"]').type(TEST_TOKEN);
        cy.contains('button', 'Continue').click();

        // Verify redirection to Order Form
        cy.contains('New Order').should('be.visible');

        // 2. Client Selection
        // Mocking the client search response to ensure stability
        cy.intercept('GET', '**/contragents/**', {
            statusCode: 200,
            body: {
                result: [
                    { id: 1, name: 'Test Client', phone: '79991234567' }
                ]
            }
        }).as('searchClients');

        cy.get('input[placeholder="Search by phone or name..."]').type('7999');
        cy.wait('@searchClients');
        cy.contains('Test Client').click();
        cy.contains('Selected: Test Client').should('be.visible');

        // 3. Metadata Selection
        // Mocking metadata responses
        cy.intercept('GET', '**/warehouses/**', { body: { result: [{ id: 1, name: 'Main Warehouse' }] } }).as('getWarehouses');
        cy.intercept('GET', '**/organizations/**', { body: { result: [{ id: 1, name: 'My Org' }] } }).as('getOrgs');
        cy.intercept('GET', '**/pboxes/**', { body: { result: [{ id: 1, name: 'Cash' }] } }).as('getPayboxes');
        cy.intercept('GET', '**/price_types/**', { body: { result: [{ id: 1, name: 'Retail' }] } }).as('getPriceTypes');
        cy.intercept('GET', '**/nomenclature/**', {
            body: {
                result: [
                    { id: 101, name: 'Product A', price: 100 },
                    { id: 102, name: 'Product B', price: 200 }
                ]
            }
        }).as('getProducts');

        // Wait for initial data load (happens on mount)
        // Note: In a real app, these calls happen immediately after login.
        // Since we just logged in, they should have fired.

        // Select Organization
        cy.contains('label', 'Organization').next('select').select('1');

        // Select Warehouse
        cy.contains('label', 'Warehouse').next('select').select('1');

        // Select Price Type
        cy.contains('label', 'Price Type').next('select').select('1');

        // Select Paybox
        cy.contains('label', 'Paybox').next('select').select('1');

        // 4. Product Selection
        cy.contains('Product A').should('be.visible');
        cy.contains('Product A').parent().parent().find('button').click(); // Add Product A

        cy.contains('Product B').should('be.visible');
        cy.contains('Product B').parent().parent().find('button').click(); // Add Product B
        cy.contains('Product B').parent().parent().find('button').click(); // Add Product B again (qty 2)

        // Verify Cart
        cy.contains('Order Summary').should('be.visible');
        cy.contains('Product A').should('be.visible');
        cy.contains('Product B').should('be.visible');
        cy.contains('200 ₽ x 2').should('be.visible'); // Product B qty check

        // Total calculation: 100*1 + 200*2 = 500
        cy.contains('Total:').next().should('contain', '500 ₽');

        // 5. Order Submission
        cy.intercept('POST', '**/docs_sales/', {
            statusCode: 200,
            body: { success: true, id: 12345 }
        }).as('createOrder');

        cy.get('textarea[placeholder="Order notes..."]').type('Test Order via Cypress');
        cy.contains('button', 'Create Order').click();

        cy.wait('@createOrder').then((interception) => {
            const body = interception.request.body;
            expect(body.contragent_id).to.eq(1);
            expect(body.warehouse_id).to.eq('1'); // Select values are strings
            expect(body.products).to.have.length(2);
            expect(body.sum).to.exist; // Basic check
        });

        // Verify success alert (Cypress automatically handles alerts but we can check side effects)
        // In our code, we reset the cart on success.
        cy.on('window:alert', (str) => {
            expect(str).to.contain('created successfully');
        });

        // Cart should be empty
        cy.contains('Order Summary').should('not.exist');
    });
});

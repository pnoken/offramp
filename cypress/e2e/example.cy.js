describe('My First Test', () => {
    it('Visits the homepage', () => {
        cy.visit('http://localhost:3000')
        cy.contains('Welcome').should('exist')
    })
})

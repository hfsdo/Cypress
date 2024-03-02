describe('IBAN Testing', () => {
  beforeEach(() => {
    cy.visit('https://d2r3v7evrrggno.cloudfront.net/')

    cy.contains('IBAN').click()
  })
  it('can generate an IBAN', () => {
    cy.get('[id$=iban-generate-button]').click()
    cy.get('#iban-text').should('be.visible').invoke('text').should('not.be.empty')
    cy.get('#iban-text').invoke('text').should(($p) => {
      expect(($p.match(/\n/g)||[]).length).equal(0)
    })
  })

  it('can generate multiple IBAN\'s', () => {
    var amount = 72
    cy.get('[id$=iban-1]').type(amount)
    cy.get('[id$=iban-generate-button]').click()
    cy.get('#iban-text').should('be.visible').invoke('text').should('not.be.empty')

    cy.get('#iban-text').invoke('text').should(($p) => {
      expect(($p.match(/\n/g)||[]).length).equal(amount-1)
      
    })

  })
})


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

  it('can generate multiple valid IBAN\'s', () => {
    var amount = 5
    cy.get('[id$=iban-1]').type(amount)
    cy.get('[id$=iban-generate-button]').click()
    cy.get('#iban-text').should('be.visible').invoke('text').should('not.be.empty')

    cy.get('#iban-text').invoke('text').should(($p) => {
      expect(($p.match(/\n/g)||[]).length).equal(amount-1)
      var ibanArr = $p.split('\n')
      ibanArr.forEach(checkValidIban)
    })
  })

  function checkValidIban(item, index, arr) {
    var checkval = item.replaceAll(' ', '')
    checkval = checkval.substring(4)+checkval.substring(0,4)
    checkval = checkval.replaceAll(/[A-Z]/g, m => m.charCodeAt() - 64+9)
    checkval = BigInt(checkval) % BigInt(97)
    expect(parseInt(checkval)).equals(1)
  }

})


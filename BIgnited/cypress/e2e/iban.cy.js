describe('IBAN Testing', () => {
  var countryList = {
    'notYetImplemented':/[A-Z0-9 ]*/g,
    'Netherlands':/NL[0-9]{2} [A-Z]{4} [0-9]{4} [0-9]{4} [0-9]{2}/g,
    'Belgium':/BE[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4}/g,
    'test':'testdata'}

 
  
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

  it.skip('can generate multiple valid IBAN\'s for a certain country', () => {
    var amount = 5
    //first attempt at testing multiple countries
    cy.get('[id$=iban-0]>option').each(($el,  index, $list)=>{
      var selText = $el.text()
      alert(selText)
      if(selText=='Open this select menu') {
        var selRegex = countryList['Belgium']
      } else {
        var selRegex = countryList[selText]
      }
      if (typeof selRegex === 'undefined') {
        selRegex = countryList['notYetImplemented']
      }
      
      if(selText!="Open this select menu") {
        cy.get('[id$=iban-0]').select(selText)
      }
      cy.get('[id$=iban-1]').type(amount)
      cy.get('[id$=iban-generate-button]').click()
      cy.get('#iban-text').should('be.visible').invoke('text').should('not.be.empty')
      cy.get('#iban-text').invoke('text').should(($p) => {
        expect(($p.match(/\n/g)||[]).length).equal(amount-1)
        var ibanArr = $p.split('\n')
        ibanArr.forEach(checkValidIban)
        ibanArr.forEach(checkValidPatternIban, {_self: this, regex: selRegex})
      })
      
    
    })
  
  })

  //check if IBAN MOD 97 calculates to 1
  function checkValidIban(item, index, arr) {
    var checkVal = item.replaceAll(' ', '')
    checkVal = checkVal.substring(4)+checkVal.substring(0,4)
    checkVal = checkVal.replaceAll(/[A-Z]/g, m => m.charCodeAt() - 64+9)
    checkVal = BigInt(checkVal) % BigInt(97)
    expect(parseInt(checkVal)).equals(1)
  }

  //check if IBAN adheres to country format
  function checkValidPatternIban(item, index, arr) {
    expect(item.match(this.regex)[0]).equal(item)
  }

})


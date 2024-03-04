//Defined countries
var countryArr = [
  {'country':'Netherlands', 'regex':/NL[0-9]{2} [A-Z]{4} [0-9]{4} [0-9]{4} [0-9]{2}/g},
  {'country':'Belgium', 'regex':/BE[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4}/g},
  {'country':'Georgia', 'regex':/GE[0-9]{2} [A-Z]{2}[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{2}/g},
  {'country':'Italy', 'regex':/IT[0-9]{2} [A-Z]{1}[0-9]{3} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{3}/g},
  {'country':'Sweden', 'regex':/SE[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}/g}
]

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

//check if generated IBAN's are valid and according to country spec
describe('IBAN multi Testing', () => {
    beforeEach(() => {
        cy.visit('https://d2r3v7evrrggno.cloudfront.net/')
    
        cy.contains('IBAN').click()
    })

    ;countryArr.forEach((country) => {
        it('Can generate IBAN\'s for ' + country.country,() => {
            var amount = 5
            cy.get('[id$=iban-0]').select(country.country)
            cy.get('[id$=iban-1]').type(amount)
            cy.get('[id$=iban-generate-button]').click()
            cy.get('#iban-text').should('be.visible').invoke('text').should('not.be.empty')
            cy.get('#iban-text').invoke('text').should(($p) => {
                expect(($p.match(/\n/g)||[]).length).equal(amount-1)
                var ibanArr = $p.split('\n')
                ibanArr.forEach(checkValidIban)
                ibanArr.forEach(checkValidPatternIban, {_self: this, regex: country.regex})
            })
        })
    })
})
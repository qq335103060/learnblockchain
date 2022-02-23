const okTestToken = artifacts.require("OkTestToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', ([owner, investor]) =>{
  let okTest
  
  before(async () => {
    okTest = await okTestToken.new(web3.utils.toWei('1000', 'ether'), web3.utils.toWei('1000', 'ether'));
  });

  describe('Token Name', async () => {
    it('has a name', async () => {
      const name = await okTest.name()
      assert.equal(name, 'OKT Test Token')
    })
  })
})

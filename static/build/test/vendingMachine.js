/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require('../js/vendingMachine');
var expect = require('../node_modules/chai/chai').expect;

describe("VendingMachine",function(){
    
   describe("Verify Inserted Coin is Valid",function(){
       it("Accepts Dimes,Nickles,and Quarters",function(){
           expect(VendOMatic.coinSlot.InsertCoin("DIME")).to.equal(true);
           expect(VendOMatic.coinSlot.InsertCoin("NICKLE")).to.equal(true);
           expect(VendOMatic.coinSlot.InsertCoin("QUARTER")).to.equal(true);
       });
   }); 
   
   
});



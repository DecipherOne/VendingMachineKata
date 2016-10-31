/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require('../js/vendingMachine');
var expect = require('../node_modules/chai/chai').expect;

describe("Vending Machine",function(){
    
    describe("Coin Slot",function(){
       describe("Verify Inserted Coin is Valid",function(){
            it("Accepts Dimes,NICKELs,and Quarters",function(){
                expect(VendOMatic.coinSlot.InsertCoin("DIME")).to.equal(true);
                expect(VendOMatic.coinSlot.InsertCoin("NICKEL")).to.equal(true);
                expect(VendOMatic.coinSlot.InsertCoin("QUARTER")).to.equal(true);
            });

            it("Rejects Coins that are not Dimes, NICKELs, and Quarters",function(){
                expect(VendOMatic.coinSlot.InsertCoin("PENNY")).to.equal(false);
                expect(VendOMatic.coinSlot.InsertCoin("HALFDOLLAR")).to.equal(false);
                expect(VendOMatic.coinSlot.InsertCoin("METALWASHER")).to.equal(false);
            });
        }); 
   
        describe("Verify accepted coin is added to total purchase amount.",function(){
           it("Adds the value of an inserted coin, that is valid, to the current total purchase amount.",function(){
              VendOMatic.coinSlot.ReturnInsertedCoins();
              VendOMatic.coinSlot.InsertCoin("DIME");
              expect(VendOMatic.GetCurrentTotalPurchaseAmount()).to.equal(0.10); 
              VendOMatic.coinSlot.InsertCoin("NICKEL");
              expect(VendOMatic.GetCurrentTotalPurchaseAmount()).to.equal(0.15);
              VendOMatic.coinSlot.InsertCoin("Quarter");
              expect(VendOMatic.GetCurrentTotalPurchaseAmount()).to.equal(0.40);

           }); 
        }); 
        
        it("Returns inserted coins to the coin return, when the coin return button is pressed.", function(){
            
            VendOMatic.coinSlot.ReturnInsertedCoins();
            VendOMatic.coinSlot.InsertCoin("Dime");
            VendOMatic.coinSlot.InsertCoin("NICKEL");
            VendOMatic.coinSlot.ReturnInsertedCoins();
            expect(VendOMatic.GetCurrentTotalPurchaseAmount()).to.equal(0);
        });
        
        
    });
    
   
   
   describe("Vending Display",function(){
      
       it("Shows INSERT COIN when no Coin is inserted.",function(){
           VendOMatic.coinSlot.ReturnInsertedCoins();
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
       });
       
       it("Shows the updated Purchase Amount when coins are inserted.",function(){
          VendOMatic.coinSlot.ReturnInsertedCoins();
          expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
          VendOMatic.coinSlot.InsertCoin("QUARTER");
          expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("0.25");
       });
           
       
   });
   
   
   
});



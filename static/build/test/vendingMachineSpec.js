/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require('../js/vendingMachine');
var expect = require('../node_modules/chai/chai').expect;


describe("Vending Machine",function(){
    
    before("Stock The Machine",function(){
       VendOMatic.products.StockProducts("COLA",1.00,6); 
       VendOMatic.products.StockProducts("CHIPS",0.5,2);
       VendOMatic.products.StockProducts("CANDY",0.65,1);
    });
    
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
       
       it("Displays EXACT CHANGE ONLY when the machine is not able to make change with money currently in the machine.",function(){
           
           VendOMatic.coinBank.EmptyBank();
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("EXACT CHANGE ONLY");
           
       });
      
       it("Shows INSERT COIN when no Coin is inserted.",function(){
           VendOMatic.coinBank.AddChangeToBank(2,2,3);
           expect(VendOMatic.coinBank.GetBankTotal()).to.equal(1.05);
           VendOMatic.coinSlot.ReturnInsertedCoins();
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
       });
       
       it("Shows the updated Purchase Amount when coins are inserted.",function(){
          VendOMatic.coinSlot.ReturnInsertedCoins();
          expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
          VendOMatic.coinSlot.InsertCoin("QUARTER");
          expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("0.25");
       });
       
       it("When the button is pressed and enough money has been inserted, the product is dispensed and the machine displays THANK YOU",function(){
           VendOMatic.coinSlot.ReturnInsertedCoins();
           var c = 0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<4);
           
           expect(VendOMatic.products.Order("cola")).to.equal("THANK YOU");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
           c=0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<3);
           
           expect(VendOMatic.products.Order("chips")).to.equal("THANK YOU");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
           
           c=0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<3);
           
           expect(VendOMatic.products.Order("candy")).to.equal("THANK YOU");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("INSERT COIN");
           
           
       });
       
       it("When an item is ordered without the proper amount, the machine displays PRICE and the price of the item.",function(){
           VendOMatic.coinSlot.ReturnInsertedCoins();
           var c = 0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<3);
           
           expect(VendOMatic.products.Order("cola")).to.equal("PRICE : $1");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("0.75");
           
           VendOMatic.coinSlot.ReturnInsertedCoins();
           c = 0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<1);
           
           expect(VendOMatic.products.Order("CHIPS")).to.equal("PRICE : $0.5");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("0.25");
           
           VendOMatic.coinSlot.ReturnInsertedCoins();
           c = 0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<2);
           
           expect(VendOMatic.products.Order("CANDY")).to.equal("PRICE : $0.65");
           expect(VendOMatic.LCD.ShowCurrentPurchaseAmount()).to.equal("0.5");
       });
       
       it("When a selected item is sold out, SOLD OUT displays.",function(){
           
           VendOMatic.products.StockProducts("CHIPS",0.5,0);
           var c = 0;
           do{
               VendOMatic.coinSlot.InsertCoin("Quarter");
               c++;
           }while(c<3);
           
           expect(VendOMatic.products.Order("CHIPS")).to.equal("SOLD OUT");
        });
      
   });
   
   
   
});



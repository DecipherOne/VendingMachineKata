/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function OperateVendingMachine(VendOMatic){
    
    
    VendOMatic = VendOMatic|| {};
    VendOMatic.coinSlot = VendOMatic.coinSlot || {};
    VendOMatic.LCD = VendOMatic.LCD || {};
    VendOMatic.coinBank = VendOMatic.coinBank || {};
    VendOMatic.products = VendOMatic.products || {};
    
    var numOfDimesInSlot, numOfNickelsInSlot, numOfQuartersInSlot,
    bankNickles,bankDimes,bankQuarters,bankTotalHoldings,
    currentTotalPurchaseAmount = 0;
    
    VendOMatic.coinSlot.ValidateInsertedCoin = function(COINTYPE){
        
        if(COINTYPE.toString().toUpperCase()==="DIME"||
           COINTYPE.toString().toUpperCase()==="NICKEL"||
           COINTYPE.toString().toUpperCase()==="QUARTER"){
       
           return true;
        }
        else{
            
            return false;
        }
    };
    
    VendOMatic.coinSlot.InsertCoin = function(COINTYPE){
        if(this.ValidateInsertedCoin(COINTYPE)){
            //add money to active money cache
            var curAmount = currentTotalPurchaseAmount;
            
            switch(COINTYPE.toString().toUpperCase()){
                case "DIME":{
                        curAmount += 0.10;
                        numOfDimesInSlot += 1;
                        break;
                }
                case "NICKEL":{
                        curAmount += 0.05;
                        numOfNickelsInSlot += 1;
                        break;
                }
                case "QUARTER":{
                        curAmount += 0.25;
                        numOfQuartersInSlot += 1;
                        break;
                }
                default:{
                        
                }
            }
            
            SetCurrentTotalPurchaseAmount(curAmount);
            return true;
        }
        else{
            //reject coin to coin slot
            return false;
        }
    };
    
    VendOMatic.coinSlot.ReturnInsertedCoins = function(){
        
        var amount = currentTotalPurchaseAmount;
        
        for(var i=0;i<numOfDimesInSlot;i++){
            amount -= 0.10;
        }
        
        for(var a=0;a<numOfNickelsInSlot;a++){
            amount -= 0.05;
        }
        
        for(var b=0;b<numOfQuartersInSlot;b++){
            amount -= 0.25;
        }
        
        SetCurrentTotalPurchaseAmount(amount);
        ClearCoinSlotCache();
    };
    
    VendOMatic.GetCurrentTotalPurchaseAmount = function(){
        return currentTotalPurchaseAmount;
    };
    
    VendOMatic.LCD.ShowCurrentPurchaseAmount = function(){
        
        var amount = currentTotalPurchaseAmount;
        
        if(!VendOMatic.coinBank.CanMakeChange()){
           return "EXACT CHANGE ONLY"; 
        }
        else if(amount<= 0){
            return "INSERT COIN";
        }
        else{
            return amount.toString();
        }
    };
    
    VendOMatic.LCD.ShowThankYou = function(){
        return "THANK YOU";
    };
    
    VendOMatic.coinBank.CanMakeChange = function (){
        
        if(bankTotalHoldings===0){
            return false;
        }
        else{
            return true;    
        }
    };
    
    VendOMatic.coinBank.EmptyBank = function(){
       bankNickles = 0; 
       bankDimes = 0; 
       bankQuarters = 0; 
       bankTotalHoldings = 0; 
    };
    
    VendOMatic.coinBank.AddChangeToBank = function(numNickles,numDimes,numQuarters){
        bankNickles += numNickles;
        bankDimes += numDimes;
        bankQuarters += numQuarters;
        bankTotalHoldings = CalcValueOfCoins(bankNickles,bankDimes,bankQuarters);
    };
    
    VendOMatic.coinBank.AddSlotChangeToBank = function(){
      
        
        for(var i=0;i<numOfDimesInSlot;i++){
            bankDimes += 1;
        }
        
        for(var a=0;a<numOfNickelsInSlot;a++){
            bankNickles += 1;
        }
        
        for(var b=0;b<numOfQuartersInSlot;b++){
            bankQuarters += 1;
        }
        bankTotalHoldings = CalcValueOfCoins(bankNickles,bankDimes,bankQuarters);
        SetCurrentTotalPurchaseAmount(0);
        ClearCoinSlotCache();
    }
    
    VendOMatic.coinBank.GetBankTotal = function(){
        return bankTotalHoldings;
    };
    
    VendOMatic.products.Order = function(prodName){
        switch(prodName.toString().toUpperCase()){
            case "COLA":{
                    if(currentTotalPurchaseAmount>=1.0){
                        VendOMatic.coinBank.AddSlotChangeToBank();
                        return VendOMatic.LCD.ShowThankYou();
                    }
                    break;
            } 
        }
    };
    
    VendOMatic.products.dispenseItem
    function CalcValueOfCoins(numN,numD,numQ){
     
        var  n = 0,
             d = 0,
             q = 0;
     
             
        if(numN>0)
        n = parseFloat(numN) * 0.05;
        if(numD>0)
        d = parseFloat(numD) * 0.10;
        if(numQ>0)
        q = parseFloat(numQ) * 0.25;
        
        return  parseFloat(n+d+q);
    }
    
    function ClearCoinSlotCache(){
        numOfDimesInSlot = 0;
        numOfNickelsInSlot = 0;
        numOfQuartersInSlot = 0;
    }
    
    function SetCurrentTotalPurchaseAmount(amount){
        var money = parseFloat(amount);
        money = decimalAdjust('round', money, -2);
        currentTotalPurchaseAmount = money;
    };

    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */

    function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    return VendOMatic;
    
})(VendOMatic = this.VendOMatic||{});


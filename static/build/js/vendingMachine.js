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
    VendOMatic.coinBank.madeChange = VendOMatic.coinBank.madeChange || {};
    VendOMatic.products = VendOMatic.products || {};
    VendOMatic.products.bays =  VendOMatic.products.bays || new Array(3);
    
    var numOfDimesInSlot = 0, numOfNickelsInSlot = 0, numOfQuartersInSlot = 0,
    bankNickles= 0,bankDimes= 0,bankQuarters= 0,bankTotalHoldings= 0,
    currentTotalPurchaseAmount = 0;
    
   function product(name,price,inStock){
      this.name = name;
      this.price = parseFloat(price);
      this.inStock = parseInt(inStock);
    };
    
    
   
    VendOMatic.products.StockProducts = function(name,price,inStock){
        var stocked = false;
        for(var i=0;i<VendOMatic.products.bays.length;i++){
            if(VendOMatic.products.bays[i] == null){
                VendOMatic.products.bays[i] =  new product(name.toUpperCase(),price,inStock);
                stocked = true;
                break;
            }
            else if(VendOMatic.products.bays[i].name === name.toUpperCase()){
                
                VendOMatic.products.bays[i].inStock = inStock;
                VendOMatic.products.bays[i].price = parseFloat(price);
                stocked = true;
                break;
            }
        }
        
        if(stocked){
            return true;
        }
        else{
            return false;
        }
     
    };
    
    VendOMatic.products.Dispense = function(name){
        
        var purchAmount = currentTotalPurchaseAmount;
        for(var i=0; i<VendOMatic.products.bays.length;i++){
          
            if(VendOMatic.products.bays[i].name === name){
                if(VendOMatic.products.bays[i].inStock <1 ){
                    return false; 
                    break;
                }
                else{
                    VendOMatic.products.bays[i].inStock -= 1;
                    if(purchAmount > VendOMatic.products.bays[i].price){
                       VendOMatic.coinBank.MakeChange(purchAmount, VendOMatic.products.bays[i].price); 
                    }
                    return true;
                    break;
                }
            }
        }
    };
    
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
    
    VendOMatic.LCD.ShowSoldOut= function(){
        return "SOLD OUT";
    };
    
    VendOMatic.LCD.ShowItemPrice = function(prodName){
        
        for(var i=0; i<VendOMatic.products.bays.length; i++){
            if(VendOMatic.products.bays[i].name === prodName.toString().toUpperCase()){
                return "PRICE : $"+VendOMatic.products.bays[i].price;
                break;
            }
        }
    };
    
    VendOMatic.coinBank.CanMakeChange = function (){
        
        if(bankTotalHoldings===0||bankTotalHoldings<1.0){
            return false;
        }
        else{
            return true;    
        }
    };
    
    VendOMatic.coinBank.MakeChange = function(amountInSlot,purchaseAmount){
        
        var changeToDispense = decimalAdjust('round',(parseFloat(amountInSlot - purchaseAmount)),-2),
            changeCalcBuffer = changeToDispense,result = 0,tempMoney=parseFloat(0);
    
        if (changeCalcBuffer > 0 && changeCalcBuffer >= .25 && bankQuarters >= 1)
        {
            result = changeCalcBuffer / .25;
            
            if(result %1 !== 0){
              result = Math.floor(result); 
       
            
            }
            
            if(result>bankQuarters){
                do{

                    result--;

                }while(result>bankQuarters)
            }

            bankQuarters -= result;
            tempMoney += CalcValueOfCoins(0,0,result);
            changeCalcBuffer = decimalAdjust('round',(changeCalcBuffer -= tempMoney),-2);
                
        }  

        if (changeCalcBuffer > 0 && changeCalcBuffer >= .10 && bankDimes >= 1)
        {
            result = changeCalcBuffer / .1;
            if(result %1 !== 0){
              result = Math.floor(result);
            }
           
           if(result>bankDimes){
                do{

                    result--;

                }while(result>bankDimes)
            }

            bankDimes -= result;
            tempMoney += CalcValueOfCoins(0,result,0);
            changeCalcBuffer = decimalAdjust('round',(changeCalcBuffer -= tempMoney),-2);
        }

        if (changeCalcBuffer > 0 && changeCalcBuffer >= .05 && bankNickles >= 1)
        {
            result = changeCalcBuffer / .05;
            if(result %1 !== 0){
               result = Math.floor(result);
            }
            if(result>bankNickles){
                do{

                    result--;

                }while(result>bankNickles)
            }

            bankNickles -= result;
            tempMoney += CalcValueOfCoins(result,0,0);
            changeCalcBuffer = decimalAdjust('round',(changeCalcBuffer -= tempMoney),-2);
        }
        
        bankTotalHoldings = CalcValueOfCoins(bankNickles,bankDimes,bankQuarters);
        return this.madeChange = tempMoney;

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
    };
    
    VendOMatic.coinBank.GetBankTotal = function(){
        return bankTotalHoldings;
    };
    
    VendOMatic.products.Order = function(prodName){
        
        prodName = prodName.toString().toUpperCase();
        
        for(var i=0; i<VendOMatic.products.bays.length; i++){
            if(VendOMatic.products.bays[i].name === prodName){
                if(currentTotalPurchaseAmount >= VendOMatic.products.bays[i].price){
                    if(VendOMatic.products.Dispense(prodName)){
                       VendOMatic.coinBank.AddSlotChangeToBank();
                       return VendOMatic.LCD.ShowThankYou();  
                       break;
                    }else{
                        return VendOMatic.LCD.ShowSoldOut();
                        break;
                    }
                }
                else{
                        return VendOMatic.LCD.ShowItemPrice(prodName);
                        break;
                    }
            }
        }
    };
    
  
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


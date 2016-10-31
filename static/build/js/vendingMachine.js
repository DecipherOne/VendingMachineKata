/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//TO DO : Remove these requires before actual build, just needed for testing
var $ = require('../node_modules/jquery/dist/jquery.js');

(function OperateVendingMachine($,VendOMatic){
    
    
    VendOMatic = VendOMatic|| {};
    VendOMatic.coinSlot = VendOMatic.coinSlot || {};
    VendOMatic.LCD = VendOMatic.LCD || {};
    var numOfDimesInSlot, numOfNickelsInSlot, numOfQuartersInSlot = 0;
    
    var currentTotalPurchaseAmount = 0.0;
    
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
    
    SetCurrentTotalPurchaseAmount = function(amount){
        var money = parseFloat(amount);
        money = decimalAdjust('round', money, -2);
        currentTotalPurchaseAmount = money;
    };
    
    VendOMatic.LCD.ShowCurrentPurchaseAmount = function(){
        
        var amount = currentTotalPurchaseAmount;
        
        if(amount<= 0){
            return "INSERT COIN";
        }
        else{
            return amount.toString();
        }
    };
    
    
    function ClearCoinSlotCache(){
        numOfDimesInSlot = 0;
        numOfNickelsInSlot = 0;
        numOfQuartersInSlot = 0;
    }

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
    
})($ /*jQuery */,VendOMatic = this.VendOMatic||{});


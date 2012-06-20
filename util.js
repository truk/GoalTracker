var Util = exports.Util = function(){}

Util.prototype = {
  dateList: function(numDays){
    var dates = [];
    for (var i=0; i<numDays; i++){
      var today = new Date();
      today.setDate(today.getDate() - i);
      dates.push(today);
    }
    return dates;
  }
}
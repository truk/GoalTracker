var Goal = exports.Goal = function(action, quantity, unit, period){
  this.action = action;
  this.quantity = quantity;
  this.unit = unit;
  this.period = new Period(period);
  this.records = [];
}

var Period = exports.Period = function(name){
  var hours = { 'Year': 8760,
                'Month': 730,
                'Week': 168,
                'Day': 24,
                'Hour': 1 };
  this.name = name;
  this.hours = hours[name];
  this.days = hours[name]/24;
}

var Record = exports.Record = function(date, quantity){
  this.date = date;
  this.quantity = quantity;
}
var Goal = function(action, quantity, unit, period){
  this.action = action;
  this.quantity = quantity;
  this.unit = unit;
  this.period = new Period(period);
  this.records = [];
}

var Period = function(name){
  var hours = { 'Year': 8760,
          'Month': 730,
          'Week': 168,
          'Day': 24,
          'Hour': 1};
  this.name = name;
  this.hours = hours[name];
  this.days = hours[name]/24;
}

var Record = function(date, quantity){
  this.date = date;
  this.quantity = quantity;
}

var Model = exports.Model = function(host, port){
  this.goals = {};
  this.goalId = 0;
  this.goalCounter = 0;
  this.init();
}

Model.prototype = {
  
  init: function(){
    var g = new Goal('Do', 10000, 'Pushups', 'Year');
    g._id = this.goalCounter++;
    var d = new Date();
    g.records.push(new Record(new Date(), 30));
    g.records.push(new Record(new Date(), 20));
    this.goals[g._id] = g;

    g = new Goal('Run', 5, 'miles', 'Week');
    g._id = this.goalCounter++;
    g.records.push(new Record(new Date(), 2));
    this.goals[g._id] = g;
  },

  _numGoals: function(){
    var size = 0, key;
    for (key in this.goals){
      if (this.goals.hasOwnProperty(key)) size++;
    }
    return size;
  },
  
  addGoal: function(action, quantity, unit, period, callback){
    var g = new Goal(action, quantity, unit, period);
    g._id = this.goalCounter++;
    this.goals[g._id] = g;
    callback(null, g);
  },
  
  deleteGoal: function(goalId, callback){
    var goal = this.goals[goalId];
    delete this.goals[goalId];
    callback(null, goal);
  },
  
  getGoal: function(goalId, callback){
    var goal = this.goals[goalId];
    if (goal !== void 0){
      this.getRemaining(goal, function(err, remaining){
        goal.remaining = remaining;
        callback(null, goal);
      });
    }else{
      callback(new Error("Goal " + goalId + " not found"), null);
    }
  },
  
  getGoals: function(callback){
    var self = this;
    var numLeft = this._numGoals();
    if (numLeft == 0){
      return callback(null, {});
    }
    for (var i in this.goals){
      this.getRemaining(this.goals[i], function(err, remaining){
        self.goals[i].remaining = remaining;
        if (--numLeft <= 0){
          callback(null, self.goals);
        }
      });
    }
  },
  
  addRecord: function(goalId, date, quantity, callback){
    this.getGoal(goalId, function(err, goal){
      if (err){
        callback(err, null);
      }else{
        var rec = new Record(date, quantity);
        goal.records.push(rec);
        callback(null, rec);
      }
    })
  },
  
  getRecords: function(goalId, callback){
    this.getGoal(goalId, function(err, goal){
      if (err){
        callback(err, null);
      }else{
        callback(null, goal.records);
      }
    })
  },
  
  getRemaining: function(goal, callback){
    var remain = goal.quantity;
    for (var i=0; i<goal.records.length; i++){
      remain -= goal.records[i].quantity;
    }
    callback(null, remain);
  }
}


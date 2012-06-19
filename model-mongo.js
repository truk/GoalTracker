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
                'Hour': 1 };
  this.name = name;
  this.hours = hours[name];
  this.days = hours[name]/24;
}

var Record = function(date, quantity){
  this.date = date;
  this.quantity = quantity;
}


var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;


var Model = exports.Model = function(host, port){
  var self = this;
  this.db = new Db('node-mongo-goals', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(err, p_client){
    //self.init();
  });
}

Model.prototype = {
  
  _getCollection: function(callback){
    this.db.collection('goals', function(err, collection){
      if (err){
        callback(err);
      }else{
        callback(null, collection);
      }
    });
  },
  
  _getRemaining: function(goal, callback){
    var remain = goal.quantity;
    for (var i=0; i<goal.records.length; i++){
      remain -= goal.records[i].quantity;
    }
    callback(null, remain);
  },

  save: function(goals, callback){
    this._getCollection(function(err, collection){
      if (err){
        callback(err);
      }else{
        collection.insert(goals, {safe:true}, function(err, objects){
          if (err){
            callback(err);
          }else{
            callback(null, goals);
          }
        });
      }
    });
  },
  
  addGoal: function(action, quantity, unit, period, callback){
    var g = new Goal(action, quantity, unit, period);
    this.save(g, function(err, goals){
      if (err){
        callback(err);
      }else{
        callback(null, g);
      }
    });
  },
  
  deleteGoal: function(goalId, callback){
    this._getCollection(function(err, collection){
      if (err){
        callback(err);
      }else{
        collection.remove({ _id: ObjectID(goalId) }, function(err, results){
          if (err){
            callback(err);
          }else{
            callback(null, results);
          }
        });
      }
    });
  },

  getGoals: function(callback){
    var self = this;
    this._getCollection(function(err, collection){
      if (err){
        callback(err);
      }else{
        collection.find().toArray(function(err, results){
          var updated = 0;
          if (err){
            callback(err);
          }else{
            if (results.length == 0){
              return callback(null, []);
            }
            for (var i=0; i<results.length; i++){
              self._getRemaining(results[i], function(err, remaining){
                results[i].remaining = remaining;
                if (++updated >= results.length){
                  callback(null, results);
                }
              });
            }
          }
        });
      }
    });
  },
  
  getGoal: function(goalId, callback){
    var self = this;
    this._getCollection(function(err, collection){
      if (err){
        callback(err);
      }else{
        collection.findOne({ _id: ObjectID(goalId) }, function(err, goal){
          if (err){
            callback(err);
          }else{
            if (goal == null){
              callback(new Error("Goal not found"))
            }else{
              self._getRemaining(goal, function(err, remaining){
               goal.remaining = remaining;
                callback(null, goal);
              })
            }
          }
        });
      }
    });
  },
  
  addRecord: function(goalId, date, quantity, callback){
    var rec = new Record(date, quantity);
    this._getCollection(function(err, collection){
      if (err){
        callback(err);
      }else{
        collection.update({ _id: ObjectID(goalId) }, { $push: { records: rec } },
          function(err, goal){
            if (err){
              callback(err);
            }else{
              callback(null, goal);
            }
        });
      }
    });
  },
  
  getRecords: function(goalId, callback){
    this.getGoal(goalId, function(err, goal){
      if (err){
        callback(err);
      }else{
        callback(null, goal.records);
      }
    })
  },
  
}

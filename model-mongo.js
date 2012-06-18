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
	this.db = new Db('node-mongo-goals', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}

Model.prototype = {
	
	_getCollection: function(callback){
		this.db.collection('goals', function(err, collection){
			if (err){
				callback(err, null);
			}else{
				callback(null, collection);
			}
		});
	},

	save: function(goals, callback){
		this._getCollection(function(err, collection){
			if (err){
				callback(err, null);
			}else{
				if (typeof(goals.length) == "undefined"){
					goals = [goals];
				}
				collection.insert(goals, function(){
					callback(null, goals);
				});
			}
		});
	},
	
	init: function(){
		var g = new Goal('Do', 10000, 'Pushups', 'Year');
		var d = new Date();
		g.records.push(new Record(new Date(), 30));
		g.records.push(new Record(new Date(), 20));
		this.save(g, function(err, goals){});

		g = new Goal('Run', 5, 'miles', 'Week');
		g.records.push(new Record(new Date(), 2));
		this.save(g, function(err, goals){});
	},
	
	addGoal: function(action, quantity, unit, period, callback){
		var g = new Goal(action, quantity, unit, period);
		this.save(g, function(err, goals){
			if (err){
				return callback(err,null);
			}else{
				callback(null, g);
			}
		});
	},

  getGoals: function(callback){
    var self = this;
    this._getCollection(function(err, collection){
      if (err){
        callback(err, null);
      }else{
        collection.find().toArray(function(err, results){
          var updated = 0;
          if (err){
            callback(err, null);
          }else{
            for (var i=0; i<results.length; i++){
              self.getRemaining(results[i], function(err, remaining){
                console.log(updated,i,results.length);
                results[i].remaining = remaining;
                if (++updated == results.length){
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
				callback(err, null);
			}else{
				collection.findOne({ _id: ObjectID(goalId) }, function(err, goal){
					if (err){
						callback(err, null);
					}else{
            self.getRemaining(goal, function(err, remaining){
             goal.remaining = remaining;
  						callback(null, goal);
            })
					}
				});
			}
		});
	},
	
	addRecord: function(goalId, date, quantity, callback){
		var rec = new Record(date, quantity);
		this._getCollection(function(err, collection){
			if (err){
				callback(err, null);
			}else{
				collection.update({ _id: ObjectID(goalId) }, { $push: { records: rec } },
				 	function(err, goal){
						if (err){
							callback(err, null);
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

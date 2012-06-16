var Goal = function(action, quantity, unit, period){
	this.action = action;
	this.quantity = quantity;
	this.unit = unit;
	this.period = new Period(period);
	this.records = [];
}

Goal.prototype = {
	remaining: function(){
		var remain = this.quantity;
		for (var i=0; i<this.records.length; i++){
			remain -= this.records[i].quantity;
		}
		return remain;
	}
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

var Model = exports.Model = function(){
	this.goals = [];
	this.goalId = 0;
}

Model.prototype = {
	
	init: function(){
		var g = new Goal('Do', 10000, 'Pushups', 'Year');
		var d = new Date();
		g.records.push(new Record(new Date(), 30));
		g.records.push(new Record(new Date(), 20));
		this.goals.push(g);

		g = new Goal('Run', 5, 'miles', 'Week');
		g.records.push(new Record(new Date(), 2));
		this.goals.push(g);
		
	},
	
	addGoal: function(action, quantity, unit, period, callback){
		var g = new Goal(action, quantity, unit, period);
		this.goals.push(g);
		callback(null, g);
	},
	
	getGoal: function(goalId, callback){
		if (this.goals[goalId] !== void 0){
			callback(null, this.goals[goalId]);
		}else{
			callback(new Error("Goal " + goalId + " not found"), null);
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
	}
}


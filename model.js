var Goal = function(name, quantity, period){
	this.name = name;
	this.quantity = quantity;
	this.period = period;
	this.records = [];
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
		var g = new Goal('Pushups', 10000, 'year');
		g.records.push(new Record(new Date(), 30));
		g.records.push(new Record(new Date(), 20));
		this.goals.push(g);

		g = new Goal('Running', 5, 'day');
		g.records.push(new Record(new Date(), 2));
		this.goals.push(g);
		
	},
	
	addGoal: function(name, quantity, period, callback){
		var g = new Goal(name, quantity, period);
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
		var goal = this.getGoal(goalId, function(err, res){
			if (err){
				callback(err, null);
			}else{
				var rec = new Record(date, quantity);
				res.records.push(rec);
				callback(null, rec);
			}
		})
	},
	
	getRecords: function(goalId, callback){
		var goal = this.getGoal(goalId, function(err, res){
			if (err){
				callback(err, null);
			}else{
				callback(null, res.records);
			}
		})
	}
}


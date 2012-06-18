
/**
 * Module dependencies.
 */

var express = require('express')
  , Model = require('./model-mongo').Model;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var model = new Model('localhost', 27017);
model.init();

// Routes

app.get('/', function(req, res){
  model.getGoals(function(err, goals){
    if (err){
      goals = [];
    }
	  res.render('index', { title: 'Goals', goals: goals });
  });
})

app.get('/goal/:id', function(req, res){
	model.getGoal(req.param('id'), function(err, goal){
		if (err){
			console.log(err);
			res.redirect('/');
		}else{
			res.render('goal', { title: 'Goal:' + goal.name, goal: goal });
		}
	})
})

app.post('/add/:id', function(req, res){
	model.addRecord(req.param('id'), 
		new Date(), 
		req.param('quantity'), 
		function(err, rec){
			res.redirect('/');
	})
})

app.post('/new', function(req, res){
	model.addGoal(req.param('action'), 
		req.param('quantity'),
		req.param('unit'), 
		req.param('period'), 
		function(err, goal){
			res.redirect('/');
	})
})

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

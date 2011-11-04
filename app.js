var express = require('express');
var mongoose = require('mongoose');
var stylus = require('stylus');
var logger = require('./lib/logger');

var config = require('./config');

var app = express.createServer();
var port = process.env.NODE_ENV === 'production' ? 80 : 8080;
var host = process.env.NODE_ENV === 'production' ? config.host : 'localhost';

// Connect to Mongoose using our database config.
mongoose.connect('mongodb://localhost:27017/SJWedding', function(err) {
	logger.error(err);
	if (!err) {
		logger.info('Mongoose connected');
	}
});

app.configure(function(){

	app.use(express.bodyParser());

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	
	// Set the default view engine
	app.set('views', __dirname + '/views')
	app.set('view engine', 'ejs');
});

// Initialise our Picture model.
var Event = require('./models/event');
var Picture = require('./models/picture');

app.all('/', function(req, res){

	res.render('splash');

});

// Add a new event
app.all('/event/add', function(req, res){
	
	var message;

	if(req.body){
		//This is a post request, so try and save a new event with the data.

		var event = new Event();

		event.name = req.body.name;
		event.created = new Date();

		event.save(function(err){
		    if(err){
		        throw err;
		        logger.trace(err);
		        message = 'There was an error adding your event';
		    }else{
		        logger.trace('New event saved');
		        message = 'Your event was added';
		        res.render('event/add', {'message': message});
		    }
		});

	}else{
		message = 'Please enter an event name';
		res.render('event/add', {'message': message});
	}

});

// Show all events which are currently in the DB
app.all('/event', function(req, res){
	Event.find({}, function (err, docs) {
  		logger.debug(docs);
	});

	res.render('message', {'message':'rendered'});
});

// Add a picture to an event
app.all('/picture/add/:eventName', function(req, res){

	//logger.debug(req.body);
	
	var picture = new Picture();

	picture.image.full = 'http://image.com/full';
	picture.image.thumb = 'http://image.com/thumb';
	picture.caption = 'Hot stuff';
	picture.uuid = 'asdfghjkl1234567890';
	picture.date = new Date();

	// Find the correct event and add the picture
	Event.findOne({ name:req.params.eventName }, function (err, event){
		if (!err) {
		    event.pictures.push(picture);
		    event.save(function (err) {
		      // do something
		      res.json({'success':true});
		      logger.debug(event);
		    });
	  	}else{
	  		res.json({'success':false});
	  	}
	});
});

// Start the server
app.listen(port, function(){
	logger.trace('App is listening on ', port);
});

// Catch any unhandled errors
process.on('uncaughtException', function (err) {
	logger.uncaught(err.stack);
});
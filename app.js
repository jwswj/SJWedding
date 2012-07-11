var express = require('express');
var mongoose = require('mongoose');
var stylus = require('stylus');
var logger = require('./lib/logger');

var config = require('./config');

var app = express.createServer();
var port = process.env.NODE_ENV === 'production' ? 80 : 8080;
var host = process.env.NODE_ENV === 'production' ? config.host : 'localhost';

// Connect to Mongoose using our database config.
mongoose.connect('mongodb://jason:smale@staff.mongohq.com:10049/WeddingPics', function(err) {
	logger.error(err);
	if (!err) {
		logger.info('Mongoose connected');
	}
});

// Configuration settings
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

// Main splash page
app.all('/', function(req, res){
	res.render('splash');
});

// Basic contact page
app.all('/contact', function(req, res){
	res.render('contact');
});

// Show all events which are currently in the DB
app.all('/events/all', function(req, res){
	Event.find({}, ['name'], function (err, events) {
  		logger.debug(events);
  		res.json(events);
	});
});

// Add a new event
app.all('/events/add', function(req, res){
	
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
		        res.render('events/add', {'message': message});
		    }
		});

	}else{
		message = 'Please enter an event name';
		res.render('events/add', {'message': message});
	}

});

// Get all pictures associated to an event
app.all('/pictures/all/:eventName', function(req, res){
	// Find the correct event and add the picture
	Event.findOne({ name:req.params.eventName }, function (err, event){
		if (!err) {
		    res.json(event.pictures);
	  	}else{
	  		res.json({'success':false});
	  	}
	});
});

// Add a picture to an event
app.post('/pictures/add/:eventName', function(req, res){

	logger.debug(req.body);

	// Find the correct event and add the picture
	Event.findOne({ name:req.params.eventName }, function (err, event){
		if (!err) {
		    event.pictures.push(req.body);
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

// Add a picture to an event
app.all('/pictures/view/:eventName', function(req, res){

	// Find the correct event and add the picture
	Event.findOne({ name:req.params.eventName }, function (err, event){
		if (!err) {
		      res.render('pictures/view', {'pictures':event.pictures});
		      //logger.debug(event);
	  	}
	});
});

// Debug page
app.all('/fake', function(req, res){

	if(req.body){
		res.render('fake', {});
	}else{
		res.render('fake', {});
	}

});

// Start the server
app.listen(port, function(){
	logger.trace('App is listening on ', port);
});

// Catch any unhandled errors
process.on('uncaughtException', function (err) {
	logger.uncaught(err.stack);
});

// 
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

	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	
	// Set the default view engine
	app.set('views', __dirname + '/views')
	app.set('view engine', 'ejs');
});

// Initialise our Picture model.
var Picture = require('./models/picture');

app.all('/', function(req, res){

	res.render('splash');

});

app.post('/newpic/:id', function(req, res){

	logger.trace(req.params.id);
	logger.debug(req.body);
		
	var picture = new Picture();

	picture.image.full = 'http://image.com/full';
	picture.image.thumb = 'http://image.com/thumb';
	picture.caption = 'Hot stuff';
	picture.uuid = 'asdfghjkl1234567890';
	picture.date = new Date();

	logger.debug(picture);

	picture.save(function(err){
	    if(err){
	        throw err;
	        logger.trace(err);
	    }else{
	        logger.trace('saved!');
	    }
	});

	res.json({'success':true});

});

app.listen(port, function(){
	logger.trace('App is listening on ', port);
});

process.on('uncaughtException', function (err) {
	logger.uncaught(err.stack);
});
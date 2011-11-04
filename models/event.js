/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

// recursive embedded-document schema
var schema = new Schema({
    name     	: {type: String, index: true, unique: true}
  , pictures	: [
  					new Schema({
					    full    : String
					  , thumb	: String
					  , caption : String
					  , uuid    : String
					  , created : Date
					})
				  ]
  , created   	: Date
});

/*
// Model methods.
schema.static({
       example: function(foo) {
});

// Model methods.
schema.method({
       example: function(foo) {
});

*/

/**
 * Define model.
 */

var Model, Event;
mongoose.model('event', schema);
module.exports = Model = Event = mongoose.model('event');
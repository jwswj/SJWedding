/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Picture = require('./picture');

/**
 * Schema definition
 */

// recursive embedded-document schema
var schema = new Schema({
    name     	: String
  , pictures	: [Picture]
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
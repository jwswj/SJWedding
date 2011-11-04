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
    image     : { 
        full: String,
        thumb: String,
    }
  , caption   : String
  , uuid      : String
  , created   : Date
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

var Model, Picture;
mongoose.model('picture', schema);
module.exports = Model = Picture = mongoose.model('picture');
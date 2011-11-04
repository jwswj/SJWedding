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
    _id       : ObjectId,
    image     : { 
        full: String,
        thumb: String,
    }
  , caption   : String
  , uuid      : String
  , created   : Date
});

/**
 * Define model.
 */

var Model, Picture;
mongoose.model('picture', schema);
module.exports = Model = Picture = mongoose.model('picture');
/**
 * Logger.
 */

var path = require('path');
var sys = require('sys');

var BASE_PATH = path.join(__dirname, '../');

var levels = {
	'todo':  30, // Gray
	'trace':  1, // White
	'debug': 34, // Soft Blue
	'info':  32, // Soft Green
	'warn':  33, // Soft Yellow
	'error': 31, // Soft Orange
	'fatal': 91, // Red
	'uncaught': 35, // Purple
};

module.exports = logger();

function logger(useColor) {
	var useColor = useColor || true;

	var logger = {};

	var addLogFunction = function(level) {
		var uLevel = level.toUpperCase();

		logger[level] = function log() {
			var calleeData = getCalleeData();

			var startColor = useColor ? '\x1B[' + levels[level] + 'm' : '';
			var endColor = useColor ? '\x1B[0m' : '';

			var message = getMessage(arguments);
			var content = getDate() + ' ' + uLevel + ' ' + calleeData.file + ':' + calleeData.line + ' - ' + message;
			var output = useColor ? startColor + content + endColor : content;

			// We have a special rule that ignores error messages if they are undefined.
			// This allows us to always write logger.error(err); and have it automatically ignored if there isn't actually an error.
			if (!(level === 'error' && (message === 'undefined' || message === 'null'))) {
				sys.puts(output);
			}

			// Return the raw content, so the logger.fn() can be embedded in callbacks, etc.
			// E.g. callback(logger.error('Foo is a required field when adding a new bar object'), null);
			return content;
		};
	}

	for (var level in levels) {
		addLogFunction(level);
	}

	return logger;
};

function getDate() {
	return new Date().toString();
};

function getCalleeData() {
	var data = {};

	// Throwing an exception to get file details from the error stack.
	try {
		throw new Error();
	}
	catch(e) {
		// @NOTE: The magic number 3 is because logger itself has
		// three levels of functions when determining the callee data.
		var callee = e.stack.split('\n')[3];
		var parts = callee.split(':');

		// Determine the callee partial filepath and line number.
		data.file = parts[0].replace(new RegExp('.*' + BASE_PATH), '');
		data.line = parts[1];
	}
	return data;
};

function getMessage(args) {
	var message = '';
	var delimeter = ' - ';

	for (var i = 0; i < args.length; i++) {
		if (typeof args[i] === 'string') {
			message += args[i];
		}
		else {
			message += sys.inspect(args[i], false, 3);
		}
		message += delimeter;
	}

	return message.substr(0, message.length - delimeter.length);
};
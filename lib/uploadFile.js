<<<<<<< HEAD
var parseCommands_pre_1_9 = require("./parseCommands_pre_1_9");
var parseCommands_1_9 = require("./parseCommands_1_9");
var showParsedOutput = require("./showParsedOutput");
=======
var parseCommands = require("./parseCommands");
>>>>>>> added browserify

var uploadFile = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.onload = function(fileLoadEvent){
<<<<<<< HEAD
		showParsedOutput(parseCommands_pre_1_9(fileLoadEvent.target.result));
=======
		parseCommands(fileLoadEvent.target.result);
>>>>>>> added browserify
	};

	reader.readAsText(file);
};

module.exports = uploadFile;
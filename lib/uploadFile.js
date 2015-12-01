var parseCommands_pre_1_9 = require("./parseCommands_pre_1_9");
var parseCommands_1_9 = require("./parseCommands_1_9");

var uploadFile = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.onload = function(fileLoadEvent){
		parseCommands_pre_1_9(fileLoadEvent.target.result);
	};

	reader.readAsText(file);
};

module.exports = uploadFile;
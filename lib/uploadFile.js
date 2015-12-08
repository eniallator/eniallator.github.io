var parseCommands = require("./parseCommands");

var uploadFile = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.onload = function(fileLoadEvent){
		parseCommands(fileLoadEvent.target.result);
	};

	reader.readAsText(file);
};

module.exports = uploadFile;
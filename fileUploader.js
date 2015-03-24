(function(){
	CommandGenerator.handleFileSelect = function(event){
		var file = event.target.files[0];
		var reader = new FileReader();

		reader.onload = function(fileLoadEvent){
			CommandGenerator.parseCommands(fileLoadEvent.target.result);
		};

		reader.readAsText(file);
	};
})();
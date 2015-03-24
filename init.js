$(document).ready(function () {

	$(".js-generate").on( "click", function() {
	  CommandGenerator.parseCommands(inputCommands.value);
	});

	$(".js-file-input").hide().on("change", CommandGenerator.handleFileSelect);

	$(".js-file-upload").removeClass("hidden").on( "click", function(){
		$(".js-file-input").click();
	});

});
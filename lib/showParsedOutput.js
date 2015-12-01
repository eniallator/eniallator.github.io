var SCROLL_SPEED = 1000;

var showParsedOutput = function(parsedCommands){
	$("#outputCommand").val(parsedCommands);

	$('.outputContainer').removeClass("hidden");

	$('body').animate({
		scrollTop: $(".outputContainer").offset().top - 45
	}, SCROLL_SPEED);
}

module.exports = showParsedOutput;
var domUtils = require("./utils/domUtils");
var SCROLL_SPEED = 1000;
var firstRun = true;

var showParsedOutput = function(parsedCommands){
	document.getElementById("outputCommand").value = parsedCommands;

	if (firstRun){
		var outputContainer = document.getElementsByClassName('outputContainer')[0];
		animateScroll = false;
		outputContainer.className = domUtils.removeClass(outputContainer.className,"hidden")

		$('body').animate({
			scrollTop: $(".outputContainer").offset().top - 45
		}, SCROLL_SPEED);

	}
}

module.exports = showParsedOutput;

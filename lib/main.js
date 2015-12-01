var parseFillClockCommands_pre_1_9 = require("./parseFillClockCommands_pre_1_9");
var parseFastClockCommands_1_9 = require("./parseFastClockCommands_1_9");
var parseCommands_pre_1_9 = require("./parseCommands_pre_1_9");
var parseCommands_1_9 = require("./parseCommands_1_9");
var uploadFile = require("./uploadFile");
var testTemplate = require("./templates/testTemplate.ms");

console.log(testTemplate.render({foo: 'bodmin'}));

var SCROLL_SPEED = 1000;

function showParsedCommands(parsedCommands) {
	$("#outputCommand").val(parsedCommands);

	$('.outputContainer').removeClass("hidden");

	$('body').animate({
		scrollTop: $(".outputContainer").offset().top - 45
	}, SCROLL_SPEED);
}

var mode = "singleUse";
var version = "1_8";

$(".js-generate").on("click", function() {
	var input;
	if (version == "1_8"){
		if (mode === "singleUse") {
			input = inputCommands.value;
		} else {
			input = startFillClockCommands.value + "\n" + parseFillClockCommands_pre_1_9(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
		}

		showParsedCommands(parseCommands_pre_1_9(input));
	} else {
		if (mode === "singleUse") {
			input = inputCommands.value;
		} else {
			input = startFillClockCommands.value + "\n" + parseFastClockCommands_1_9(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
		}

		showParsedCommands(parseCommands_1_9(input));
	}
});

$(".js-file-input").on("change", uploadFile);

$(".js-file-upload").on("click", function() {
	$(".js-file-input").click();
});

$(".js-command-version").on("change", function(event) {
	version = $(event.currentTarget).val();
});

$(".js-command-mode").on("change", function(event) {
	mode = $(event.currentTarget).val();
	if (mode === "singleUse") {
		$(".js-single-use-input").removeClass("hidden");
		$(".js-fill-clock-input").addClass("hidden");
	} else {
		$(".js-single-use-input").addClass("hidden");
		$(".js-fill-clock-input").removeClass("hidden");
	}

});

$(".copy-button").tooltip();
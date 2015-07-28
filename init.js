$(document).ready(function() {

	var SCROLL_SPEED = 1000;

	function showParsedCommands(parsedCommands) {
		$("#outputCommand").val(parsedCommands);

		$('.outputContainer').removeClass("hidden");

		$('body').animate({
			scrollTop: $(".outputContainer").offset().top
		}, SCROLL_SPEED);
	}

	var mode = "singleUse";

	$(".js-generate").on("click", function() {
		var input;

		if (mode === "singleUse") {
			input = inputCommands.value;
		} else {
			input = startFillClockCommands.value + "\n" + CommandGenerator.parseFillClockCommands(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
		}

		showParsedCommands(CommandGenerator.parseCommands(input));
	});

	$(".js-file-input").on("change", CommandGenerator.handleFileSelect);

	$(".js-file-upload").on("click", function() {
		$(".js-file-input").click();
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

});
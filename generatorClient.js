$(document).ready(function () {
	
	function getRidingBlock(userCommand){
		// If user enters bad/empty input, DON'T LET IT BREAK lol
		if(userCommand === ""){
			userCommand = "say Missing input.";
		}
		var cmdType = typeof userCommand;
		cmdType = cmdType.toString();
		if(cmdType !== "string"){
			// It's not a string! :O
			userCommand = "say Bad input: " + userCommand;
		}
		
		return ",Riding:{id:FallingSand,Time:1,Block:command_block,TileEntityData:{Command:" + userCommand + "}";
	}

	function parseCommands(inputCommandsEl, outputCommandEl){
		var prefix = "summon FallingSand ~ ~1 ~ {Time:1";
		var inputCommandsValue = inputCommandsEl.value;
		var arrayCommands = inputCommandsValue.split("\n").reverse();
		var numberFillBlocks = arrayCommands.length + 1;
		var outputCommand = "";

		arrayCommands.unshift("fill ~ ~1 ~ ~ ~-" + numberFillBlocks + " ~1 air");
		arrayCommands.push("fill ~ ~1 ~1 ~ ~" + numberFillBlocks + " ~1 redstone_block");

		outputCommand += prefix;

		arrayCommands.forEach(function (val){
			outputCommand += getRidingBlock(val);
		});
		
		for (var j = 0 ; j < arrayCommands.length + 1;j++){
			outputCommand += "}";
		}

		$('.outputContainer').removeClass("hidden");

		outputCommandEl.value = outputCommand;
	}

	$(".js-generate").on( "click", function() {
	  parseCommands(inputCommands, outputCommand);
	});

});

function getRidingBlock(userCommand){
	return ",Riding:{id:FallingSand,Time:1,Block:command_block,TileEntityData:{Command:" + userCommand + "}";
}

var parseCommands = function (inputCommandsValue){
	var prefix = "summon FallingSand ~ ~1 ~ {Time:1";
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

	return outputCommand;
};

module.exports = parseCommands;
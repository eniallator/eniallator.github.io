var parseCommands_1_9 = function (inputCommandsValue){

	var arrayCommands = inputCommandsValue.split("\n").reverse();

	var output = arrayCommands.reduce(function commandTransformify(memo, item, iterator) {
		var commandBlockType =  (iterator < arrayCommands.length - 1 ? "chain_" : "") + "command_block";

	    memo.command += ",Passengers:[{Time:1,id:FallingSand,Block:" + commandBlockType + ",TileEntityData:{auto:1,Command:" + item + "}";
		memo.appendix = "}]" + memo.appendix;

		return memo;
	},{
		command: "summon FallingSand ~ ~1 ~ {Time:1,Block:chain_command_block,TileEntityData:{auto:1,Command:fill ~ ~ ~ ~ ~" + (arrayCommands.length + 1) + " ~ air}",
		appendix: "}"
	});

	return output.command + output.appendix
};

module.exports = parseCommands_1_9;
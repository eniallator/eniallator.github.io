var parseFillClockCommands = function (inputCommands){
	var offsetCoordinates = {x: 2, y: -3, z: 0};
	var coordinates = clone(offsetCoordinates);
	var yMapping = [ -2, 1, -2, -1];
	var zMapping = ["", "", -1, 1];
	var fillCommands = [];

	function clone (obj) {
	  return Object.keys(obj).reduce(function (memo, item) {
	    memo[item] = obj[item];
	    return memo;
	  },{});
	}

	inputCommands.split("\n").forEach(function iterator(command, index){
		index += 2;
		coordinates.x = Math.floor(index / 4) + 2;
		coordinates.y += yMapping[index % 4];
		coordinates.z = zMapping[index % 4];
		fillCommands.push("setblock ~" + coordinates.x + " ~" + coordinates.y + " ~" + coordinates.z + " command_block 0 0 {Command:" + command + "}");
	});

	var startCommands = [
		"setblock ~" + offsetCoordinates.x + " ~" + offsetCoordinates.y + " ~ command_block 0 0 {Command:fill ~ ~1 ~ ~" + (coordinates.x - 2) + " ~1 ~ air}",
		"setblock ~" + offsetCoordinates.x + " ~" + (offsetCoordinates.y + 1) + " ~ command_block 0 0 {Command:fill ~ ~-1 ~ ~" + (coordinates.x - 2) + " ~-1 ~ redstone_block}",
		"setblock ~" + offsetCoordinates.x + " ~" + (offsetCoordinates.y - 1) + " ~ redstone_block"
	];

	var outputCommands = startCommands.concat(fillCommands);

	return outputCommands.join("\n");
};

module.exports = parseFillClockCommands;
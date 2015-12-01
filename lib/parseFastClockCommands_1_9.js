var xInput = 3;
var zInput = 4;
const initialCoordinates = {x:2, y:-1, z:0};

function printCoord(coord) {
	return coord ? coord : "";
}

function getSimpleOutput(coordinates, commandBlockType, direction, inputCommand) {
	return `setblock ~${printCoord(coordinates.x)} ~${printCoord(coordinates.y)} ~${printCoord(coordinates.z)} `+
		`${commandBlockType}_command_block ${direction} 0 {auto:1,Command:${inputCommand}}`;
}

function getDirection(iterator,elevation){

	var zOffset = elevation%2;
	var area = zInput*xInput;
	var nextStep = iterator + 1

	if (nextStep % area == 0){

		return 1;
	} else if (nextStep % xInput == 0){

		return 3 - zOffset;
	} else {

		return 5 - Math.floor(nextStep / xInput)%2;
	}
}

function getGradCoord(iterator, input){
	var offset = iterator % input;
  	var offsetDirection = Math.floor(iterator / input) % 2;

  	return offsetDirection ? (input - 1) - offset : offset;
}

function getLineTransformer(){

	return function(inputCommand, iterator){

    	var elevation = Math.floor(iterator/(xInput*zInput));
    	var direction = getDirection(iterator,elevation);
    	var coordinates = {
    		x: initialCoordinates.x + getGradCoord(iterator,xInput),
    		y: initialCoordinates.y + (iterator - elevation)*-1,
    		z: initialCoordinates.z + getGradCoord(Math.floor(iterator/xInput),zInput)
    	};

    	return getSimpleOutput(coordinates, (iterator ? 'chain' : 'repeating'), direction, inputCommand);
	}
}

var parseFastClockCommands_1_9 = function(inputCommandsValue) {

    var inputCommands = inputCommandsValue.split("\n").reverse();
	return inputCommands.map(getLineTransformer()).reverse();
}

module.exports = parseFastClockCommands_1_9;
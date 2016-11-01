/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var parseFillClockCommands_pre_1_9 = __webpack_require__(1);
	var parseFastClockCommands_1_9 = __webpack_require__(2);
	var parseCommands_pre_1_9 = __webpack_require__(3);
	var parseCommands_1_9 = __webpack_require__(4);
	var uploadFile = __webpack_require__(5);
	var showParsedOutput = __webpack_require__(6);

	var mode = "singleUse";
	var version = "1_8";

	// console.log("HELLO WORLD")

	$(".js-generate").on("click", function(event) {
		event.preventDefault();

		var input;
		if (version == "1_8"){
			if (mode === "singleUse") {
				input = inputCommands.value;
			} else {
				input = startFillClockCommands.value + "\n" + parseFillClockCommands_pre_1_9(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
			}

			showParsedOutput(parseCommands_pre_1_9(input));
		} else {
			if (mode === "singleUse") {
				input = inputCommands.value;
			} else {
				input = startFillClockCommands.value + "\n" + parseFastClockCommands_1_9(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
			}

			showParsedOutput(parseCommands_1_9(input));
		}
	});

	$(".js-file-input").on("change", uploadFile);

	$(".js-file-upload").on("click", function(event) {
		event.preventDefault()
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var parseCommands_pre_1_9 = __webpack_require__(3);
	var parseCommands_1_9 = __webpack_require__(4);
	var showParsedOutput = __webpack_require__(6);

	var uploadFile = function(event){
		var file = event.target.files[0];
		var reader = new FileReader();

		reader.onload = function(fileLoadEvent){
			showParsedOutput(parseCommands_pre_1_9(fileLoadEvent.target.result));
		};

		reader.readAsText(file);
	};

	module.exports = uploadFile;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var domUtils = __webpack_require__(7);
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	var domUtils = {

		removeClass: function(className,classToRemove){

			var classArray = className.split(" ")

			var filteredClassArray = classArray.filter(function(item){
				return classToRemove !== item;
			})

			return filteredClassArray.join(" ")
			
		}
	}

	module.exports = domUtils

/***/ }
/******/ ]);
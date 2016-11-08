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
/******/ 	__webpack_require__.p = "C:\\Users\\niall\\OneDrive\\Documents\\Master Command Generator\\eniallator.github.io\\build";

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

	__webpack_require__(8);

	var mode = "singleUse";
	var version = "1_8";


	$(".js-generate").on("click", function(event) {
		console.log("HELLO WORLD!!");
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(11)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./commandGenerator.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./commandGenerator.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(10)();
	// imports


	// module
	exports.push([module.id, "/* Space out content a bit */\r\nbody {\r\n  padding-top: 20px;\r\n  padding-bottom: 20px;\r\n}\r\n\r\n.content {\r\n  margin-top: 45px;\r\n}\r\n\r\n.favorite {\r\n  color: orange;\r\n  font-size: 20px;\r\n}\r\n\r\n.favorite:hover {\r\n  text-decoration: none;\r\n}\r\n\r\n.favoriteContainer {\r\n  position: absolute;\r\n  right:30px;\r\n}\r\n\r\n.outputContainer {\r\n  position: relative;\r\n}\r\n\r\n.betterTextBox {\r\n  padding-top: 10px;\r\n  padding-bottom: 5px;\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  border-radius: 2px;\r\n  color: inherit;\r\n  word-wrap: break-word;\r\n  background-color: #eee;\r\n  }\r\n\r\ntextarea.input {\r\n  resize: vertical;\r\n  white-space: nowrap;\r\n}\r\n\r\n/* Everything but the jumbotron gets side spacing for mobile first views */\r\n.header,\r\n.footer {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n}\r\n\r\n/* Custom page header */\r\n.header {\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\n/* Make the masthead heading the same height as the navigation */\r\n.header h3 {\r\n  padding-bottom: 19px;\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n  line-height: 40px;\r\n}\r\n\r\n.header h3 .subheading {\r\n  font-size: 12px;\r\n}\r\n\r\n/* Custom page footer */\r\n.footer {\r\n  padding-top: 19px;\r\n  color: #777;\r\n  border-top: 1px solid #e5e5e5;\r\n}\r\n\r\n/* Customize container */\r\n@media (min-width: 768px) {\r\n  .container {\r\n    max-width: 730px;\r\n  }\r\n}\r\n\r\n.controls {\r\n  margin: 20px 0;\r\n}\r\n/* Responsive: Portrait tablets and up */\r\n@media screen and (min-width: 768px) {\r\n  /* Remove the padding we set earlier */\r\n  .header,\r\n  .footer {\r\n    padding-right: 0;\r\n    padding-left: 0;\r\n  }\r\n  /* Space out the masthead */\r\n  .header {\r\n    margin-bottom: 30px;\r\n  }\r\n}\r\n", ""]);

	// exports


/***/ },
/* 10 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
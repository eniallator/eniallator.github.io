(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var parseFillClockCommands = require("./parseFillClockCommands");
var parseCommands = require("./parseCommands");
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

$(".js-generate").on("click", function() {
	var input;

	if (mode === "singleUse") {
		input = inputCommands.value;
	} else {
		input = startFillClockCommands.value + "\n" + parseFillClockCommands(fillClockCommands.value)+ "\n" + endFillClockCommands.value;
	}

	showParsedCommands(parseCommands(input));
});

$(".js-file-input").on("change", uploadFile);

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
},{"./parseCommands":2,"./parseFillClockCommands":3,"./templates/testTemplate.ms":4,"./uploadFile":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var t = new (require('hogan.js/lib/template')).Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div>");_.b(_.v(_.f("foo",c,p,0)));_.b("</div>");return _.fl();;});module.exports = {  render: function () { return t.render.apply(t, arguments); },  r: function () { return t.r.apply(t, arguments); },  ri: function () { return t.ri.apply(t, arguments); }};
},{"hogan.js/lib/template":6}],5:[function(require,module,exports){
var parseCommands = require("./parseCommands");

var uploadFile = function(event){
	var file = event.target.files[0];
	var reader = new FileReader();

	reader.onload = function(fileLoadEvent){
		parseCommands(fileLoadEvent.target.result);
	};

	reader.readAsText(file);
};

module.exports = uploadFile;
},{"./parseCommands":2}],6:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);


},{}]},{},[1]);

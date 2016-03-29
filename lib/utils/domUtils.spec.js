var test = require("tape");
var domUtils = require("./domUtils");

test("removeClass removes a class from a class name string",function(t){
	
	t.plan(1);

	var testClassName = "foo bar test";
	var expected = "foo test";

 	var actual = domUtils.removeClass(testClassName,"bar");

	t.equal(actual,expected);
});
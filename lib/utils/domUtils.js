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
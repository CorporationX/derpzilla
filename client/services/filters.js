angular.module("chatApp").filter("usernameFilter", ["dataFactory", function (dataFactory) {
	return function (name) {
		if (name === dataFactory.getConnectedUser()) {
			return "You";
		}
		return name;
	};
}]);
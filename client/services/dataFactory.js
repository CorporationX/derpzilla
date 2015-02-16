angular.module("chatApp").factory("dataFactory", [function () {

	var connectedUser = "";

	return {
		setConnectedUser: function (user) {
			connectedUser = user;
		},
		getConnectedUser: function () {
			return connectedUser;
		}
	};

}]);
angular.module("chatApp").controller("RoomController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		$scope.connectedUser = dataFactory.getConnectedUser();

		var init = function () {

			if (!$scope.connectedUser) {
				$location.path("/login");
			} else {
				console.log('wtf');
			}

		};

		init();
	}
]);
angular.module("chatApp").controller("RoomsController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		var initRooms = false;

		$scope.users = [];
		$scope.rooms = [];
		$scope.connectedUser = "";

		var init = function () {

			$scope.connectedUser = dataFactory.getConnectedUser();

			if (!$scope.connectedUser) {
				$location.path("/login");
			}

		};

		init();

	}
]);
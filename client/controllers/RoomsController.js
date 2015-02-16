angular.module("chatApp").controller("RoomsController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		var initRooms = false;

		$scope.users = [];
		$scope.rooms = [];
		$scope.connectedUser = "";

		$scope.getRooms = function () {
			socket.emit("rooms");
		};

		socket.on("roomlist", function (rooms) {
			console.log(rooms);
			$scope.rooms = rooms;
		});

		var init = function () {

			$scope.connectedUser = dataFactory.getConnectedUser();

			if (!$scope.connectedUser) {
				$location.path("/login");
			}

			$scope.getRooms();

		};

		init();

	}
]);
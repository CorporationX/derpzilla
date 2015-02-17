angular.module("chatApp").controller("RoomsController", ["$scope", "$location", "socket", "dataFactory",

	function ($scope, $location, socket, dataFactory) {

		var initRooms = false;

		$scope.users = [];
		$scope.rooms = [];
		$scope.connectedUser = "";

		$scope.getRooms = function () {
			socket.emit("rooms");
		};

		$scope.joinRoom = function (room) {
			var roomObj = {
				room: room
			};

			socket.emit("joinroom", roomObj, function (success, reason) {
				if (success) {
					$location.path("/room/" + room);
				} else {
					console.log("Failed to join", reason);
				}
			});
		};

		socket.on("roomlist", function (rooms) {
			$scope.rooms = rooms;
		});

		socket.on("updateusers", function (data1, data2, data3) {
			console.log("updateusers", data1, " - ", data2, " - ", data3);
		});

		socket.on("updatetopic", function (data1, data2, data3) {
			console.log("updatetopic", data1, " - ", data2, " - ", data3);
		});

		socket.on("servermessage", function (data1, data2, data3) {
			console.log("servermessage", data1, " - ", data2, " - ", data3);
		});

		socket.on("updatechat", function (data1, data2, data3) {
			console.log("updatechat", data1, " - ", data2, " - ", data3);
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
angular.module("chatApp").controller("RoomController", ["$scope", "$location", "$routeParams", "socket", "dataFactory",

	function ($scope, $location, $routeParams, socket, dataFactory) {

		$scope.connectedUser = "";
		$scope.currentRoom = $routeParams.roomName;
		$scope.users = {};
		$scope.inputText = "";
		$scope.topic = "";
		$scope.messages = [];

		$scope.sendText = function () {
			if ($scope.inputText) {
				socket.emit("sendmsg", {
					roomName: "lobby",
					msg: $scope.inputText
				});

				$scope.inputText = "";
			}
		};

		$scope.toRooms = function () {
			socket.emit("partroom", $scope.currentRoom);
			$location.path("/rooms");
		};

		socket.on("updateusers", function (data1, data2, data3) {
			console.log("updateusers", data1, " - ", data2, " - ", data3);
			if ($scope.currentRoom === data1) {
				$scope.users = data2;
			}
		});

		socket.on("updatetopic", function (data1, data2, data3) {
			if ($scope.currentRoom === data1) {
				$scope.topic = data2;
			}
		});

		socket.on("servermessage", function (data1, data2, data3) {
			if ("join" === data1) {

				if ($scope.currentRoom === data2) {

					// if ($scope.connectedUser === data3) {
					// 	$scope.messages.push({
					// 		nick: "Server",
					// 		message: "Welcome to the lobby - chat with other users"
					// 	});
					// } else {
					// 	$scope.messages.push({
					// 		user: "Server",
					// 		msg: data3 + " has joined"
					// 	});
					// }

				}


			}
		});

		socket.on("updatechat", function (data1, data2, data3) {
			if ($scope.currentRoom === data1) {
				$scope.messages = data2;
			}
		});

		var init = function () {

			$scope.connectedUser = dataFactory.getConnectedUser();

			if (!$scope.connectedUser) {
				$location.path("/login");
			}

		};

		init();
	}
]);
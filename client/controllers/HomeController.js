angular.module("chatApp").controller("HomeController", ["$scope",
	function ($scope) {

		var socket = io.connect("http://localhost:8080");

		$scope.users = [];

		$scope.createRoom = function () {

			console.log("joinRoom");

			var roomObject = {
				room: $scope.room.name
			};

			socket.emit("joinroom", roomObject, function (success, reason) {
				console.log("success", success);
				console.log("reason", reason);
			});

		};

		$scope.getRooms = function () {

			socket.emit("rooms");

		};

		socket.on("updateusers", function (data) {
			socket.emit("users");
		});
		socket.on("updatechat", function (data) {
			console.log("updatechat", data);
		});
		socket.on("updatetopic", function (data) {
			console.log("updatetopic", data);
		});
		socket.on("servermessage", function (data) {
			console.log("servermessage", data);
		});
		socket.on("roomlist", function (data) {
			console.log("roomlist", data);
		});


	}
]);
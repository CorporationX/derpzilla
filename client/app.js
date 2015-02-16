angular.module("chatApp", ["ng", "ngRoute"])


.config(["$routeProvider", function ($routeProvider) {

	$routeProvider.when("/login", {
			templateUrl: "/client/views/login.html",
			controller: "LoginController"
		}).when("/rooms", {
			templateUrl: "/client/views/rooms.html",
			controller: "RoomsController"
		}).when("/room/:roomName", {
			templateUrl: "/cleint/views/room.html",
			controller: "RoomController"
		})
		.otherwise({
			redirectTo: "/login"
		});

}]);
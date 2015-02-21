angular.module("chatApp", ["ng", "ngRoute", "ui.bootstrap"])


.config(["$routeProvider", function ($routeProvider) {

	$routeProvider.when("/login", {
			templateUrl: "/client/views/login.html",
			controller: "LoginController"
		}).when("/home", {
			templateUrl: "/client/views/home.html",
			controller: "HomeController"
		})
		.otherwise({
			redirectTo: "/home"
		});

}]);
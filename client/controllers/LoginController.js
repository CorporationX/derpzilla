angular.module("chatApp").controller("LoginController", ["$scope", "$location",
	function ($scope, $location) {

		var socket = io.connect("http://localhost:8080");

		$scope.login = "login";

		$scope.user = {
			username: ""
		};

		$scope.errors = {
			available: false
		};

		$scope.login = function () {

			socket.emit("adduser", $scope.user.username, function (available) {

				if (!available) {
					$scope.errors.available = false;
				} else {
					$scope.$apply(function () {
						$location.path("/home")
					});
				}

			});

		};

	}
]);
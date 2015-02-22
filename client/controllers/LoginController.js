angular.module("chatApp").controller("LoginController", ["$scope", "$location", "socket", "dataFactory",
	function ($scope, $location, socket, dataFactory) {

		$scope.login = "login";

		$scope.user = {
			username: ""
		};

		$scope.connectedUser = dataFactory.getConnectedUser();

		$scope.errors = {
			available: false
		};

		$scope.submitted = false;

		$scope.login = function () {

			$scope.submitted = true;

			if (!$scope.user.username){

				return;
			}

			socket.emit("adduser", $scope.user.username, function (available) {

				if (!available) {
					$scope.errors.available = true;
				} else {
					dataFactory.setConnectedUser($scope.user.username);
					$location.path("/rooms");
				}

			});

		};

	}
]);
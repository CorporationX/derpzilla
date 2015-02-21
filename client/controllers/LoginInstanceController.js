angular.module("chatApp").controller("LoginInstanceController", ["$scope", "$modalInstance", "name",
	function ($scope, $modalInstance, name) {

		$scope.roomName = name;

		$scope.submitted = false;

		$scope.ok = function () {

			if (!$scope.roomPassword) {
				$scope.submitted = true;
				return;
			}

			$modalInstance.close($scope.roomPassword);

		};

		$scope.cancel = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
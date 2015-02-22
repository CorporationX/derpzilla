angular.module("chatApp").controller("ListInstanceController", ["$scope", "$modalInstance", "roomObject",
	function ($scope, $modalInstance, roomObject) {

		$scope.roomObj = roomObject;

		$scope.returnValue = true;

		$scope.ok = function () {

			$modalInstance.close($scope.returnValue);

		};

		$scope.close = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
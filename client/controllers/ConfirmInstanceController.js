angular.module("chatApp").controller("ConfirmInstanceController", ["$scope", "$modalInstance", "roomObject",
	function ($scope, $modalInstance, roomObject) {

		$scope.roomObj = roomObject;

		$scope.returnValue = true;

		$scope.ok = function () {

			$modalInstance.close($scope.returnValue);

		};

		$scope.cancel = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
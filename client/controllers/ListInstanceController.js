angular.module("chatApp").controller("ListInstanceController", ["$scope", "$modalInstance", "roomObject",
	function ($scope, $modalInstance, roomObject) {

		$scope.roomObj = roomObject;

		$scope.ok = function (value) {

			$modalInstance.close(value);

		};

		$scope.close = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
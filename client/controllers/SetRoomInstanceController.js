angular.module("chatApp").controller("SetRoomInstanceController", ["$scope", "$modalInstance", "roomObject",
	function ($scope, $modalInstance, roomObject) {

		$scope.roomObj = roomObject;

		$scope.returnValue = "";

		$scope.submitted = false;

		$scope.ok = function () {

			if (!$scope.returnValue) {
				$scope.submitted = true;
				return;
			}

			$modalInstance.close($scope.returnValue);

		};

		$scope.cancel = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
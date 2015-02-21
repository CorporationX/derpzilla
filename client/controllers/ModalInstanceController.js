angular.module("chatApp").controller("ModalInstanceController", ["$scope", "$modalInstance",
	function ($scope, $modalInstance) {

		$scope.submitted = false;

		$scope.newRoom = {};

		$scope.ok = function () {

			if (!$scope.newRoom.name) {
				$scope.submitted = true;
				return;
			}

			$modalInstance.close($scope.newRoom);

		};

		$scope.cancel = function () {
			$modalInstance.dismiss("cancel");
		};

	}
]);
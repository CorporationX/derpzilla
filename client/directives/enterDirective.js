angular.module("chatApp").directive("enterDirective", [function () {
	return {
		restrict: "A",
		scope: {
			enter: "&"
		},
		link: function (scope, elem, attrs) {

			$(elem).bind('keypress', function (e) {
				var code = e.keyCode || e.which;

				if (code == 13) {
					scope.enter();
				}

			});

		}
	};
}]);
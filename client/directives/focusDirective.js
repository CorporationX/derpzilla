angular.module("chatApp").directive("focusDirective", [function () {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			$(elem).focus();
		}
	};
}]);
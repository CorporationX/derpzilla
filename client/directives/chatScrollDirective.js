angular.module("chatApp").directive("chatScrollDirective", [function () {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
			$(elem).focus();
		}
	};
}]);
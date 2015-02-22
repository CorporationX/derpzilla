angular.module("chatApp").directive("focusDirective", ["$timeout", "$parse", function ($timeout, $parse) {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {

			scope.$watch("focus", function (value){
				
				if (value === true){
		            
		            $timeout(function () {
		                $(elem).focus();
		            });
				
				}
			
			});

			scope.focus = true;

		}
	};
}]);
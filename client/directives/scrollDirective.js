angular.module("chatApp").directive("scrollDirective", [function () {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {

			scope.$on("newData", function (){

				console.log("new Data");
  				// var scrollHeight = $(elem)[0].scrollHeight;
  				// $(elem).scrollTop(scrollHeight);
			
			});

		}
	};
}]);
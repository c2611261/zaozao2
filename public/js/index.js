angular.module('indexModule', ['ngRoute']).
config(['$locationProvider', function($locationProvider){
	$locationProvider.html5Mode(true);
}]).
controller('IndexController', ['$scope', '$http', '$location',
	function($scope, $http, $location) {
		var util = new DomainNameUtil($location);
		initTagBackground();
		console.log('params=', $location.search().code);
		if($location.search().code !== undefined){

		}
		$http.get(util.getBackendServiceUrl() + "/course_tags")
			.success(function(e) {
				console.log('get course tags:', e);
				
				for (var i = 0; i < e.length; i++) {
					$scope.courseTags[i].imageUrl =
						util.getResourceUrl(e[i].imageUrl);
				}
				console.log('resource url:', $scope.courseTags);
			});

		function initTagBackground() {
			$scope.courseTags = new Array();
			for(var i=0; i<4; i++){
				$scope.courseTags = {};
			}
			$scope.courseTags[0].backgroundCls = 'yellow';
			$scope.courseTags[1].backgroundCls = 'light-brown';
			$scope.courseTags[2].backgroundCls = 'green';
			$scope.courseTags[3].backgroundCls = 'dark-brown';
		}
	}
]);
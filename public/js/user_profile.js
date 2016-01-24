var angularjs = angular.module('userProfileModule', ['ngCookies', 'ngVideo']);
angularjs.controller('UserProfileController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'$sce', '$cookies', '$httpParamSerializer', 'video', '$route',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, $sce, $cookies, $httpParamSerializer,
		video, $route) {

		var util = new DomainNameUtil($location);
		$http.get(util.getBackendServiceUrl() + '/user', {
			headers: {
				'access_token': $cookies.get('access_token')
			}
		}).success(function(e){
			console.log('get user ', e);
			$scope.userInfo = e;
		}).error(function(e){

		})

	}
]);
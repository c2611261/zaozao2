var angularjs = angular.module('articleDetailModule', ['courseTagServiceModule']);
angularjs.controller('ArticleDetailController', ['$scope',
	'$http', '$stateParams', '$state', '$location',
	function($scope, $http, $stateParams, $state, $location) {
		if ($stateParams.courseId === undefined) {
			$state.go('home');
		}
		var util = new DomainNameUtil($location);
		$http.get(util.getBackendServiceUrl() +
			'/course/querycourse/' + $stateParams.courseId).
		success(function(e) {
			console.log('get course ', e);
			$scope.course = e;
			document.getElementById('article_content').innerHTML=$scope.course.content;

		}).error(function(e) {

		});
	}
]);
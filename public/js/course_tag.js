angular.module('courseTagModule', ['ngRoute', 'courseTagServiceModule']).
config(['$locationProvider', function($locationProvider) {
	//$locationProvider.html5Mode(true);
}]).
controller('CourseTagController', ['$scope', '$http', '$location', 'CourseTagService',
	function($scope, $http, $location, courseTagSrv) {
		console.log('course tag id ', $location.search().tagId);
		$scope.tagId = $location.search().tagId;
		var util = new DomainNameUtil($location);

		$scope.courseTag = courseTagSrv.getCourseTag($scope.tagId);
		$http.get(util.getBackendServiceUrl() + '/course/proposal/query_by_date?tag_id=' + $scope.tagId)
			.success(function(e) {
				console.log('get course ', e);
				$scope.courses = e;
			}).error(function(e) {

			});


	}
]);
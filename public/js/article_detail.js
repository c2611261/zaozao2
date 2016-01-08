var angularjs = angular.module('articleDetailModule', ['courseTagServiceModule']);
angularjs.controller('ArticleDetailController', ['$scope',
	'$http', '$stateParams', '$state', '$location','CourseTagService','$sce',
	function($scope, $http, $stateParams, $state, $location, courseTagSrv,$sce) {
		if ($stateParams.courseId === undefined) {
			$state.go('home');
		}
		var util = new DomainNameUtil($location);
		$http.get(util.getBackendServiceUrl() +
			'/course/proposal/' + $stateParams.courseId).
		success(function(e) {
			console.log('get course ', e);
			$scope.course = e;
			$scope.course.videoUrl = $sce.trustAsResourceUrl($scope.course.videoUrl);
			document.getElementById('article_content').innerHTML = $scope.course.content;

		}).error(function(e) {

		});

		$http.get(util.getBackendServiceUrl() +
				'/course/proposal/query?number=3')
			.success(function(e) {
				console.log('get related courses ', e);
				$scope.relatedCourses = e;
			}).error(function(e){

			});
		courseTagSrv.getCourseTags().then(function(e) {
			$scope.courseTags = e;
		});
	}
]);
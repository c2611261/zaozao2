angular.module('courseTagModule', ['ngRoute', 'courseTagServiceModule', 'infinite-scroll', 'mgcrea.pullToRefresh']).
config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]).
controller('CourseTagController', ['$rootScope', '$scope', '$http', '$location', 'CourseTagService', '$stateParams',
	function($rootScope, $scope, $http, $location, courseTagSrv, $stateParams) {
		console.log('course tag id ', $stateParams.courseTagId);
		$scope.tagId = $stateParams.courseTagId;
		var util = new DomainNameUtil($location);

		refresh();

		function refresh() {
			$scope.currentPageIdx = 0;
			$scope.courses = [];
			$scope.loadBusy = false;
		}

		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')',
				'background-size': '100%'
			};
		}

		$scope.loadingCourses = function() {
			console.log('load cournses ', $scope.currentPageIdx);
			if ($scope.loadBusy === true) {
				return;
			}
			$scope.loadBusy = true;
			loadCourses();
		}

		function loadCourses(){
			$http.get(util.getBackendServiceUrl() + 
				'/course/proposal/query_by_date?tag_id=' +
					$scope.tagId + '&number=' + 3 + '&page_index=' + $scope.currentPageIdx)
				.success(function(e) {
					console.log('get course ', e);
					var num = Object.getOwnPropertyNames(e).length;
					var lastCourse = null;
					if (num > 0) {

						var tags = null;
						for (var course in e) {
							var c = e[course];
							$scope.courses.push({
								date: course,
								course: c
							});
							tags = c[0].tags;
							lastCourse = c;
						}
						if (tags !== null) {
							for (var i = 0; i < tags.length; i++) {
								if (tags[i].id.toString() === $scope.tagId) {
									$scope.courseTag = tags[i];
									$rootScope.title = $scope.courseTag.name;
									var $body = $('body');
									var $iframe = $('<iframe src="/favicon.ico"></iframe>');
									$iframe.on('load', function() {
										setTimeout(function() {
											$iframe.off('load').remove();
										}, 0);
									}).appendTo($body);
									break;
								}
							}
						}

						$scope.loadBusy = false;
						$scope.currentPageIdx++;
						for (var i = 0; i < $scope.courses.length; i++) {
							var l = $scope.courses[i].course.length;
							$scope.courses[i].course[l - 1].bottom = "";
						}
						if (lastCourse !== null && lastCourse.length > 0) {
							lastCourse[lastCourse.length - 1].bottom = "browse-bottom";
						}
					} else {
						$scope.loadBusy = true;
					}

					console.log('couses:', $scope.courses);
					console.log('course tag:', $scope.courseTag);
				}).error(function(e) {

				});
		}
		$scope.pullToRefresh = function() {
			console.log('refresh');
			refresh();
		}

	}
]);
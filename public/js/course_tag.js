angular.module('courseTagModule', ['ngRoute', 'courseTagServiceModule', 'infinite-scroll', 'mgcrea.pullToRefresh']).
config(['$locationProvider', function($locationProvider) {
	//$locationProvider.html5Mode(true);
}]).
controller('CourseTagController', ['$rootScope', '$scope',
	'$http', '$location', 'CourseTagService', '$stateParams', '$state',
	function($rootScope, $scope, $http, $location, courseTagSrv, $stateParams, $state) {
		console.log('course tag id ', $stateParams.courseTagId);
		$scope.tagId = $stateParams.courseTagId;
		var util = new DomainNameUtil($location);
		$rootScope.title = $stateParams.courseName;
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
		
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

		$scope.goToCourseTag = function(tag, $event) {
			console.log('go to course tag');
			$state.go('course_tags', {
				courseTagId: tag.id,
				courseName: tag.name
			});
			$event.stopPropagation();
		}

		function loadCourses() {
			$http.get(util.getBackendServiceUrl() +
					'/course/proposal/query?tag_id=' +
					$scope.tagId + '&number=' + 3 + '&page_index=' + $scope.currentPageIdx)
				.success(function(e) {
					console.log('get course ', e);
					var num = Object.getOwnPropertyNames(e).length;
					var lastCourse = null;
					if (num > 1) {
						var tags = null;
						for (var i=0; i<e.length; i++) {
							$scope.courses.push(e[i]);
						}
						$scope.loadBusy = false;
						$scope.currentPageIdx++;
						
					} else {
						$scope.loadBusy = true;
					}
					if($scope.courses.length > 0){
						for (var i = 0; i < $scope.courses.length-1; i++) {
							$scope.courses[i].bottom = "";
						}
						$scope.courses[$scope.courses.length-1].bottom="browse-bottom";
					}
					//console.log('couses:', $scope.courses);
				}).error(function(e) {

				});
		}
		$scope.pullToRefresh = function() {
			console.log('refresh');
			refresh();
		}

	}
]);
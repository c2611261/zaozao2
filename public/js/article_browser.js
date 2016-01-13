angular.module('courseListModule', ['ngRoute', 'courseTagServiceModule',
	'infinite-scroll', 'mgcrea.pullToRefresh'
]).

controller('CourseListController', ['$rootScope', '$scope', '$http', '$location',
	'CourseTagService', '$stateParams',
	function($rootScope, $scope, $http, $location, courseTagSrv, $stateParams) {
		var util = new DomainNameUtil($location);
		refresh();
		// loadCourses();
		$rootScope.title = "早早TV";
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);

		function refresh() {
			$scope.courses = [];
			$scope.loadBusy = false;
			$scope.currentPageIdx = 0;
			$scope.stopLoading = false;
		}

		$scope.pullToRefresh = function() {
			console.log('refresh');
			refresh();
		}

		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')',
				'background-size': '100%'
			};
		}
		$scope.loadingCourses = function() {
			console.log('loading courses ', $scope.loadBusy);
			if ($scope.loadBusy === true) {
				return;
			}
			$scope.loadBusy = true;
			loadCourses();

		}

		function loadCourses() {
			console.log('load cournses ', $scope.currentPageIdx);
			$http.get(util.getBackendServiceUrl() +
					'/course/proposal/query_by_date?' + 'number=' + 10 + "&page_index=" + $scope.currentPageIdx)
				.success(function(e) {
					console.log('get course ', e);
					var num = Object.getOwnPropertyNames(e).length;
					if (num > 0) {
						var lastCourse = null;
						for (var course in e) {
							var c = e[course];
							$scope.courses.push({
								date: course,
								course: c
							});
							lastCourse = c;
						}
						for (var i = 0; i < $scope.courses.length; i++) {
							$scope.courses[i].course[$scope.courses[i].course.length - 1].bottom = "";
						}
						if (lastCourse !== null && lastCourse.length > 0) {
							lastCourse[lastCourse.length - 1].bottom = "browse-bottom";
						}
						$scope.currentPageIdx++;
						$scope.loadBusy = false;
					} else {
						$scope.loadBusy = true;
						$scope.stopLoading = true;
					}
				});
		}
	}


]);
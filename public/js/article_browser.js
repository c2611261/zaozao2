angular.module('courseListModule', ['ngRoute', 'courseTagServiceModule',
	'infinite-scroll', 'mgcrea.pullToRefresh'
]).

controller('CourseListController', ['$scope', '$http', '$location',
	'CourseTagService', '$stateParams',
	function($scope, $http, $location, courseTagSrv, $stateParams) {
		var util = new DomainNameUtil($location);
		refresh();
		// loadCourses();

		function refresh(){
			$scope.courses = [];
			$scope.loadBusy = false;
			$scope.currentPageIdx = 0;
		}

		$scope.pullToRefresh = function(){
			console.log('refresh');
			refresh();
		}

		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')'
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
						for (var course in e) {
							var c = e[course];
							$scope.courses.push({
								date: course,
								course: c
							});
						}
						$scope.currentPageIdx++;
						$scope.loadBusy = false;
					} else {
						$scope.loadBusy = true;
					}
				});
		}
	}


]);
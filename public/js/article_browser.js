angular.module('courseListModule', ['ngRoute', 'courseTagServiceModule',
	'infinite-scroll', 'mgcrea.pullToRefresh'
]).

controller('CourseListController', ['$rootScope', '$scope', '$http', '$location',
	'CourseTagService', '$stateParams', '$state',
	function($rootScope, $scope, $http, $location, courseTagSrv, $stateParams, $state) {
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

		$scope.goToCourseTag = function(tag, $event){
			console.log('go to course tag');
			$state.go('course_tags',{courseTagId:tag.id,courseName: tag.name});
			$event.stopPropagation();
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
			console.log('load course ', $scope.currentPageIdx);
			$http.get(util.getBackendServiceUrl() +
					'/course/proposal/query?' + 'number=' + 3 + "&page_index=" + $scope.currentPageIdx)
				.success(function(e) {
					console.log('get course ', e);
					var num = Object.getOwnPropertyNames(e).length;
					console.log('get course count:', num);
					if (num > 1) {
						for (var i=0; i<e.length; i++) {
							$scope.courses.push(e[i]);
						}
						
						$scope.currentPageIdx++;
						$scope.loadBusy = false;
					} else {
						$scope.loadBusy = true;
						$scope.stopLoading = true;
					}
					if($scope.courses.length > 0){
						for (var i = 0; i < $scope.courses.length-1; i++) {
							$scope.courses[i].bottom = "";
						}
						$scope.courses[$scope.courses.length-1].bottom="browse-bottom";
					}
					//console.log('total course ', $scope.courses);
					console.log('total number of courses ', $scope.courses.length);
				});
		}
	}


]);
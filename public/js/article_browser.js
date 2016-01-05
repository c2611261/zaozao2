angular.module('courseListModule', ['ngRoute', 'courseTagServiceModule']).

controller('CourseListController', ['$scope', '$http', '$location', 'CourseTagService', '$stateParams',
	function($scope, $http, $location, courseTagSrv, $stateParams) {
		var util = new DomainNameUtil($location);

		$http.get(util.getBackendServiceUrl() + '/course/proposal/query_by_date?' + 'number=' + 10)
			.success(function(e) {
				console.log('get course ', e);
				$scope.courses = [];
				for (var course in e) {
					var c = e[course];
					$scope.courses.push({
						date: course,
						course: c
					});

				}
				console.log('couses:', $scope.courses);
			}).error(function(e) {

			});
		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')'
			};
		}
	}
]);
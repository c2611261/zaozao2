angular.module('courseTagModule', ['ngRoute', 'courseTagServiceModule']).
config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]).
controller('CourseTagController', ['$scope', '$http', '$location', 'CourseTagService', '$stateParams',
	function($scope, $http, $location, courseTagSrv, $stateParams) {
		console.log('course tag id ', $stateParams.courseTagId);
		$scope.tagId = $stateParams.courseTagId;
		var util = new DomainNameUtil($location);

		$http.get(util.getBackendServiceUrl() + '/course/proposal/query_by_date?tag_id=' + $scope.tagId + '&number=' + 10)
			.success(function(e) {
				console.log('get course ', e);
				$scope.courses = [];
				var tags = null;
				for (var course in e) {
					var c = e[course];
					$scope.courses.push({
						date: course,
						course: c
					});
					tags = c[0].tags;
				}
				if(tags !== null){
					for(var i=0; i<tags.length; i++){
						if(tags[i].id.toString() === $scope.tagId){
							$scope.courseTag = tags[i];
							break;
						}
					}
				}
				console.log('couses:', $scope.courses);
				console.log('course tag:', $scope.courseTag);
			}).error(function(e) {

			});

		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')'
			};
		}
	}
]);
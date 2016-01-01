angular.module('courseTagModule', ['ngRoute', 'courseTagServiceModule']).

controller('CourseTagController', ['$scope', '$http', '$location', 'CourseTagService', '$stateParams',
	function($scope, $http, $location, courseTagSrv, $stateParams) {
		console.log('course tag id ', $stateParams.courseTagId);
		$scope.tagId = $stateParams.courseTagId;
		var util = new DomainNameUtil($location);

		$scope.courseTag = courseTagSrv.getCourseTag($scope.tagId);
		$http.get(util.getBackendServiceUrl() + '/course/proposal/query_by_date?tag_id=' + $scope.tagId+'&number='+10)
			.success(function(e) {
				console.log('get course ', e);
				$scope.courses = [];
				for (var course in e) {
					var c = e[course];
					for (var i = 0; i < c.length; i++) {
						if (c[i].tags !== undefined) {
							var tags = c[i].tags.split(',');
							c[i].tags = [];
							for(var j=0; j<tags.length; j++){
								c[i].tags[j] = {
									id: courseTagSrv.getCourseTagId(tags[j]),
									name: tags[j]
								};
							}
						}
						c[i].backgroundImg='red';
					}
					$scope.courses.push({
						date: course,
						course: c
					});

				}
				console.log('couses:', $scope.courses);
			}).error(function(e) {

			});
		$scope.background = function(course){
			console.log('background ',course.titleImageUrl);
			return {'background-image': 'url('+course.titleImageUrl+')'};
		}

	}
]);
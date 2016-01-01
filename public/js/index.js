angular.module('indexModule', ['ngRoute', 'courseTagServiceModule', 'ui.router', 'courseTagModule','courseListModule']).
config(['$locationProvider', function($locationProvider) {
	//$locationProvider.html5Mode(true);
}]).
controller('IndexController', ['$scope', '$http', '$location', 'CourseTagService',
	function($scope, $http, $location, courseTagService) {
		var util = new DomainNameUtil($location);
		console.log('params=', $location.search().code);
		if ($location.search().code !== undefined) {
			$http.get($location.protocol() + "://" + $location.host() + ":80" + "/education/zaozao/wechat/login")
				.success(function(e) {
					console.log(e);
				});
		}
		courseTagService.getCourseTags().then(function(e) {
			$scope.courseTags = e;
		});
		$http.get(util.getBackendServiceUrl() + "/course/proposal/query")
			.success(function(e) {
				console.log('get course ', e);
				$scope.courses = e;
				for (var i = 0; i < $scope.courses.length; i++) {
					$scope.courses[i].imageUrl = e[i].titleImageUrl;
					var tags = $scope.courses[i].tags.split(',');
					$scope.courses[i].tags = [];
					for (var j = 0; j < tags.length; j++) {
						$scope.courses[i].tags[j] = {
							id: courseTagService.getCourseTagId(tags[j]),
							name: tags[j]
						};
					}
				}
			}).error(function(e) {

			});
		$http.get(util.getBackendServiceUrl() + "/homeconfig")
			.success(function(e) {
				console.log('home config ', e);
				$scope.homeConfig = e;
			}).error(function(e) {

			});
	}
]).directive('backImage', function() {
	return function(scope, element, attrs) {
		var url = attrs.backImage;
		element.css({
			'background-image': 'url(' + url + ')'
		});
	};
}).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'public/views/home.html',
		controller: 'IndexController'
	}).state('course_tags', {
		url: '/course_tag?courseTagId',
		templateUrl: '/yujiaokecheng_home.html',
		controller: 'CourseTagController'
	}).state('course_list', {
		url: '/course_list',
		templateUrl: '/article_browse.html',
		controller: 'CourseListController'
	});
	$urlRouterProvider.otherwise('/');
});
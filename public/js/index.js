angular.module('indexModule', ['ngRoute', 'courseTagServiceModule',
	'ui.router', 'courseTagModule', 'courseListModule', 'articleDetailModule',
	'angular-gestures'
]).
config(function($locationProvider, hammerDefaultOptsProvider) {
	$locationProvider.html5Mode(true);
	hammerDefaultOptsProvider.set({
        recognizers: [[Hammer.Tap, {time: 250}],
        				[Hammer.Swipe, {time: 250}]]
    });
}).
controller('IndexController', ['$scope', '$http', '$location', 
	'CourseTagService',
	function($scope, $http, $location, courseTagService) {
		var util = new DomainNameUtil($location);
		console.log('params=', $location.search().code);
		if ($location.search().code !== undefined) {
			$http.get(util.getBackendServiceUrl() +
					"/wechat/login?code=" + $location.search().code)
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

				}
			}).error(function(e) {

			});
		$http.get(util.getBackendServiceUrl() + "/homeconfig")
			.success(function(e) {
				console.log('home config ', e);
				$scope.homeConfig = e;
			}).error(function(e) {

			});
		$scope.swipeLeft = function(e){
			console.log('swipe left ',e);
		}
		$scope.swipeRight = function(e){
			console.log('right');
		}
		$scope.swipeDown = function(e){
			console.log('down');
		}
		$scope.swipeUp = function(e){
			console.log('up');
		}
		
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
		templateUrl: 'public/views/course_category.html',
		controller: 'CourseTagController'
	}).state('course_list', {
		url: '/course_list',
		templateUrl: 'public/views/article_browse.html',
		controller: 'CourseListController'
	}).state('article_detail', {
		url: '/article_detail?courseId',
		templateUrl: 'public/views/article_detail.html',
		controller: 'ArticleDetailController'
	});
	$urlRouterProvider.otherwise('/');
});
angular.module('indexModule', ['ngRoute', 'courseTagServiceModule',
	'ui.router', 'courseTagModule', 'courseListModule', 'articleDetailModule',
	'angular-gestures', 'ngAnimate', 'ngCookies'
]).
config(function($locationProvider, hammerDefaultOptsProvider) {
	$locationProvider.html5Mode(true);
	hammerDefaultOptsProvider.set({
		recognizers: [
			[Hammer.Tap, {
				time: 250
			}],
			[Hammer.Swipe, {
				time: 250
			}]
		]
	});
}).
controller('IndexController', ['$scope', '$http', '$location',
	'CourseTagService', '$cookies',
	function($scope, $http, $location, courseTagService, $cookies) {
		var util = new DomainNameUtil($location);
		console.log('params=', $location.search().code);
		if ($location.search().code !== undefined) {
			$http.get(util.getBackendServiceUrl() +
					"/wechat/login?code=" + $location.search().code + "&state=" + $location.search().state)
				.success(function(e) {
					console.log('get token:', e);
					if (e !== '') {
						$cookies.put('access_token', e);
					}
				}).error(function(e) {
					console.log(e);
				});
		}
		courseTagService.getCourseTags().then(function(e) {
			$scope.courseTags = e;
			$scope.courseTags[0].ngClass='fa-cube';
			$scope.courseTags[1].ngClass='fa-columns';
			$scope.courseTags[2].ngClass='fa-eraser';
			$scope.courseTags[3].ngClass='fa-jpy';
		});
		$http.get(util.getBackendServiceUrl() + "/course/proposal/query?number=3")
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
				for (var i = 0; i < $scope.homeConfig.length; i++) {
					$scope.homeConfig[i].index = i;
					if (i === 0) {
						$scope.homeConfig[i].active = true;
					} else {
						$scope.homeConfig[i].active = false;
					}
				}
			}).error(function(e) {

			});
		$scope.swipeLeft = function(e) {
			console.log('swipe left ');
			$("#myCarousel").carousel('next');

		};
		$scope.swipeRight = function() {
			console.log('swipe right');
			$("#myCarousel").carousel('prev');
		}
		$scope.swipeDown = function(e) {
			console.log('down');
		}
		$scope.swipeUp = function(e) {
			console.log('up');
		}
	}
]).directive('backImage', function() {
	return function(scope, element, attrs) {
		var url = attrs.backImage;
		console.log('background image ', url);
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

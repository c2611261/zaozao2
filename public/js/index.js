angular.module('indexModule', ['ngRoute', 'courseTagServiceModule',
	'ui.router', 'courseTagModule', 'courseListModule', 'articleDetailModule',
	'angular-gestures', 'ngAnimate', 'ngCookies'
]).
config(function($locationProvider, hammerDefaultOptsProvider) {
	$locationProvider.html5Mode(true);
	hammerDefaultOptsProvider.set({
		recognizers: [
			[Hammer.Swipe, {
				time: 250
			}]
		]
	});
}).
controller('IndexController', ['$rootScope', '$scope', '$http', '$location',
	'CourseTagService', '$cookies', '$state',
	function($rootScope, $scope, $http, $location, courseTagService, $cookies, $state) {
		var util = new DomainNameUtil($location);
		console.log('params=', $location.search().code);
		$rootScope.title = '早早';
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
		
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
			//$scope.courseTags[0].bkImage = 'public/resources/courses/images/bg2.jpg';

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
		$http.get(util.getBackendServiceUrl() + "/course/proposal/count")
			.success(function(e) {
				$scope.totalCourseCount = e;
			}).error(function(e) {
				$scope.totalCourseCount = 0;
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
		$('#myCarousel').carousel({
			interval: 3000
		});
		$scope.swipeLeft = function(e) {
			console.log('swipe left ');
			$("#myCarousel").carousel('next');

		};
		$scope.swipeRight = function() {
			console.log('swipe right');
			$("#myCarousel").carousel('prev');

		}
		$scope.goToCourseTag = function(tag, $event) {
			console.log('go to course tag');
			$state.go('course_tags', {
				courseTagId: tag.id,
				courseName: tag.name
			});
			$event.stopPropagation();
		}

		// $('#myCarousel').on('slide.bs.carousel', function() {

		// });
		// $('#myCarousel').on('slid.bs.carousel', function() {

		// });
	}
]).directive('backImage', function() {
	return function(scope, element, attrs) {
		var url = attrs.backImage;
		console.log('background image ', url);
		element.css({
			'background-image': 'url(' + url + ')',
			'background-size': '100%'
		});
	};
}).config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'public/views/home.html',
		controller: 'IndexController'
	}).state('course_tags', {
		url: '/course_tag?courseTagId&courseName',
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
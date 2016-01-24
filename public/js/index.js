angular.module('indexModule', ['ngRoute',
	'ui.router', 'courseTagModule', 'courseListModule', 'articleDetailModule',
	'angular-gestures', 'ngAnimate', 'ngCookies', 'userProfileModule', 'favoriteModule'
]).
config(function($locationProvider, hammerDefaultOptsProvider) {
	//$locationProvider.html5Mode(true);
	hammerDefaultOptsProvider.set({
		recognizers: [
			[Hammer.Swipe, {
				time: 250
			}]
		]
	});
}).
controller('IndexController', ['$rootScope', '$scope', '$http', '$location',
	'$cookies', '$state',
	function($rootScope, $scope, $http, $location, $cookies, $state) {
		var util = new DomainNameUtil($location);

		$rootScope.title = '早早';
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
		var token = $location.search().token;
		console.log('locaiton token:', $location.search().token);
		if (token !== undefined) {
			console.log('set token on cookie');
			$cookies.put('access_token', token);
		} else {
			//console.log('not login');
			//console.log('remove access token from cookies');
			//$cookies.put('access_token', undefined);
		}

		$http.get(util.getBackendServiceUrl() + "/course_tags")
			.success(function(e) {
				console.log('get course tags:', e);
				$scope.courseTags = [];
				for (var i = 0; i < e.length; i++) {
					$scope.courseTags[i] = {};
					$scope.courseTags[i].imageUrl = (e[i].imageUrl);
					$scope.courseTags[i].url = 'public/views/course_category.html#?tagId=' + e[i].id;
					$scope.courseTags[i].id = e[i].id.toString();
					$scope.courseTags[i].name = e[i].name;
					console.log('locaiton:', $location.path());
					if (i > 3) {
						$scope.courseTags[i].enabled = false;
						$scope.courseTags[i].opacity = {
							opacity: 0.5
						};
					} else {
						$scope.courseTags[i].enabled = true;
						$scope.courseTags[i].opacity = {
							opacity: 1
						};

					}
				}
			}).error(function(e) {

			});

		$http.get(util.getBackendServiceUrl() + "/course/proposal/query_home_courses")
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

		$scope.goToCourseDetail = function(course) {
			$state.go('article_detail', {
				courseId: course.id
			}, {
				reload: true
			});
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
	}).state('user_profile', {
		url: '/user_profile',
		templateUrl: 'public/views/user_profile.html',
		controller: 'UserProfileController'
	}).state('user_profile_edit', {
		url: '/user_profile_edit',
		templateUrl: 'public/views/user_profile_edit.html',
		controller: 'UserProfileEditController'
	}).state('favorite', {
		url: '/favorite',
		templateUrl: 'public/views/favorite.html',
		controller: 'FavoriteController'
	});
	$urlRouterProvider.otherwise('/');
}).run(['$rootScope', '$location', '$state', '$cookies',
	function($rootScope, $location, $state, $cookies) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			console.log('state changed to ' + toState.name + 'to params', toParams, ', from state ' + fromState.name + ", from params ", fromParams);
			if (toState.name !== 'user_profile') {
				return;
			}
			if ($cookies.get('access_token') === undefined) {
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfe34c2ab5b5c5813&redirect_uri=http%3a%2f%2fwww.imzao.com%2feducation%2fzaozao%2fwechat%2flogin&response_type=code&scope=snsapi_userinfo&state=WECHAT_SERVICE#wechat_redirect';
				return;
			}
		});
	}
]);;
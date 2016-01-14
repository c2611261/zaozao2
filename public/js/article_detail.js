var angularjs = angular.module('articleDetailModule', ['courseTagServiceModule', 'ngCookies']);
angularjs.controller('ArticleDetailController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location', 'CourseTagService', '$sce', '$cookies',
	function($rootScope, $scope, $http, $stateParams, $state, $location, courseTagSrv, $sce, $cookies) {
		if ($stateParams.courseId === undefined) {
			$state.go('home');
		}
		$scope.showShare = false;
		$scope.shareImg = "img/share_400_400_2.png";
		$scope.courseUrl = $location.absUrl();
		console.log('location=', $location);
		var util = new DomainNameUtil($location);
		$scope.originUrl = location.href;
		$http.get(util.getBackendServiceUrl() +
			'/course/proposal/' + $stateParams.courseId, {
				headers: {
					'access_token': $cookies.get('access_token')
				}
			}).
		success(function(e) {
			console.log('get course ', e);
			$scope.course = e;
			$rootScope.title = e.name;

			var $body = $('body');
			var $iframe = $('<iframe src="/favicon.ico"></iframe>');
			$iframe.on('load', function() {
				setTimeout(function() {
					$iframe.off('load').remove();
				}, 0);
			}).appendTo($body);

			$scope.course.videoUrl = $sce.trustAsResourceUrl($scope.course.videoUrl);
			document.getElementById('article_content').innerHTML = $scope.course.content;
			configJSAPI();
		}).error(function(e) {

		});

		$http.get(util.getBackendServiceUrl() +
				'/course/proposal/query?number=3&ignore_course_id=' + $stateParams.courseId)
			.success(function(e) {
				console.log('get related courses ', e);
				$scope.relatedCourses = e;
			}).error(function(e) {

			});
		courseTagSrv.getCourseTags().then(function(e) {
			$scope.courseTags = e;
		});

		$scope.background = function(course) {
			return {
				'background-image': 'url(' + course.titleImageUrl + ')',
				'background-size': '100%'
			};
		}
		
		$scope.goToCourseTag = function(tag, $event){
			console.log('go to course tag');
			$state.go('course_tags',{courseTagId:tag.id});
			$event.stopPropagation();
		}

		$scope.share = function() {
			console.log('share');
			$scope.showShare = true;
		}

		$scope.hideShare = function() {
			$scope.showShare = false;
		}

		function configJSAPI() {
			$http.get(util.getBackendServiceUrl() + '/wechat/jsapi?url=' + $scope.originUrl)
				.success(function(e) {
					console.log(e);
					var signature = e;
					wx.config({
						debug: false,
						appId: e.appid,
						timestamp: e.timestamp,
						nonceStr: e.noncestr,
						signature: e.signature,
						jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage']
					});
					wx.ready(function() {
						console.log('wx ready');

					});
					wx.error(function(res) {
						console.log('wx error');
					});
					wx.onMenuShareTimeline({
						title: $scope.course.name,
						link: $scope.courseUrl,
						imgUrl: $scope.titleImageUrl,
						success: function() {
							console.log('share success');
						},
						cancel: function() {
							console.log('cancel share');
						}
					});
					wx.onMenuShareAppMessage({
						title: $scope.course.name, // 分享标题
						desc: $scope.course.introduction, // 分享描述
						link: $scope.courseUrl, // 分享链接
						imgUrl: $scope.titleImageUrl, // 分享图标
						// 分享类型,music、video或link，不填默认为link
						// 如果type是music或video，则要提供数据链接，默认为空
						success: function(res) {
							// 用户确认分享后执行的回调函数
							console.log('share success');
						},
						cancel: function(res) {
							// 用户取消分享后执行的回调函数
							console.log('cancel share');
						},
						fail: function(res) {

						}
					});
				}).error(function(e) {

				});
		}

		function recordShareFavorite(activity) {
			var req = {
				method: 'POST',
				url: $location.protocol() + '://' + $location.host() + ":" + $location.port() + '/education/zaozao/course/interactive',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				},
				data: $httpParamSerializer({
					course_id: $scope.course.id,
					flag: activity
				})
			};
			$http(req).success(function(e) {
				
			});

		}

	}
]);
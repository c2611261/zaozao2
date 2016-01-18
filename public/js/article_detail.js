var angularjs = angular.module('articleDetailModule', 
	['courseTagServiceModule', 'ngCookies', 'ngVideo']);
angularjs.controller('ArticleDetailController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'CourseTagService', '$sce', '$cookies', '$httpParamSerializer','video',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, courseTagSrv, $sce, $cookies, $httpParamSerializer,
		video) {
		if ($stateParams.courseId === undefined) {
			$state.go('home');
		}
		$scope.showShare = false;
		$scope.shareImg = "img/share_400_400_2.png";
		$scope.courseUrl = $location.absUrl();
		if (location.href !== $scope.courseUrl) {
			if (location.href.indexOf('isappinstall') == -1) {
				location.href = $scope.courseUrl;
			} else {
				$scope.courseUrl = encodeURI(location.href);
			}
		}
		console.log('location=', $location);
		var util = new DomainNameUtil($location);
		$scope.originUrl = window.location.href;
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
			// video.addSource('mp4',$scope.course.videoUrl);
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

		$scope.goToCourseTag = function(tag, $event) {
			console.log('go to course tag');
			$state.go('course_tags', {
				courseTagId: tag.id,
				courseName: tag.name
			});
			$event.stopPropagation();
		}

		$scope.share = function() {
			console.log('share');
			$scope.showShare = true;
		}

		$scope.favorite = function() {
			console.log('favorite');
			recordShareFavorite('FAVORITE');
		}

		$scope.hideShare = function() {
			$scope.showShare = false;
		}

		$scope.showPlayButton = true;
		$scope.showVideo = false;
		$scope.playVideo = function(e) {
			console.log('course video,', $("#course_video"));
			$("#course_video")[0].play();

		}

		document.getElementById('course_video').addEventListener('webkitendfullscreen', function (e) { 
			  // handle end full screen 
			  console.log('webkitendfullscreen');
			  $scope.showVideo = false;
			  $scope.$apply();
		});

		document.getElementById('course_video').addEventListener('webkitenterfullscreen', function (e) { 
			  // handle end full screen 
			  console.log('webkitenterfullscreen');
			  $scope.showVideo = true;
			  $scope.$apply();
		});

		// $scope.videoEnded = function(e) {
		// 	console.log('video ended ');
		// 	$scope.showPlayButton = true;
		// }

		// $scope.videoPaused = function(e) {
		// 	console.log('video paused ');
		// 	$scope.showPlayButton = true;
		// }

		function configJSAPI() {
			$http.get(util.getBackendServiceUrl() + '/wechat/jsapi?url=' + $scope.courseUrl.replace(/&/g, '%26'))
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
						imgUrl: $scope.course.titleImageUrl,
						success: function() {
							console.log('share success');
							recordShareFavorite('SHARE');
						},
						cancel: function() {
							console.log('cancel share');
						}
					});
					var shareDesc = '';
					console.log('share desc:', $scope.course.introduction);
					if ($scope.course.introduction !== null && $scope.course.introduction !== 'undefined') {
						shareDesc = $scope.course.introduction;
					}
					wx.onMenuShareAppMessage({
						title: $scope.course.name, // 分享标题
						desc: shareDesc, // 分享描述
						link: $scope.courseUrl, // 分享链接
						imgUrl: $scope.course.titleImageUrl, // 分享图标
						// 分享类型,music、video或link，不填默认为link
						// 如果type是music或video，则要提供数据链接，默认为空
						success: function(res) {
							// 用户确认分享后执行的回调函数
							console.log('share success');
							recordShareFavorite('SHARE');
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
				url: util.getBackendServiceUrl() + '/course/interactive',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					'access_token': $cookies.get('access_token')
						//'Content-Type': 'multipart/form-data; charset=utf-8;'
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

angularjs.directive('videoLoader', function() {
	return function(scope, element, attrs) {
		scope.$watch(attrs.videoLoader, function() {
			console.log('element:', element);
			$("#course_video").bind('ended', function() {
				console.log('video ended.');
				// element.removeAttr('controls');
				scope.showPlayButton = true;
				scope.showVideo = false;
				scope.$apply();
				// $(this).unbind('ended');
				// if (!this.hasPlayed) {
				// 	return;
				// }
			});
			$("#course_video").bind('pause', function() {
				console.log('video paused.');
				scope.showPlayButton = false;
				scope.showVideo = true;
				// element.attr('controls',true);
				scope.$apply();
				// $(this).unbind('paused');
				// if (!this.hasPlayed) {
				// 	return;
				// }
			});
			$("#course_video").bind('play', function() {
				console.log('video played.');
				scope.showPlayButton = false;
				scope.showVideo = true;
				// element.attr('controls',true);
				scope.$apply();
				// $(this).unbind('played');
				// if (!this.hasPlayed) {
				// 	return;
				// }
			});
			$("#course_video").bind('webkitfullscreenchange mozfullscreenchange fullscreenchange',
				function(event) {
					console.log('full screen ', event);
					
					var state = document.fullscreenElement ||
						document.webkitFullscreenElement ||
						document.mozFullScreenElement ||
						document.msFullscreenElement;
					if(state !== undefined){
						scope.showVideo = true;
					}else{
						scope.showVideo = false;

					}
					scope.$apply();
				});
			
		});
	}
});
var angularjs = angular.module('articleDetailModule', ['courseTagServiceModule', 'ngCookies', 'ngVideo']);
angularjs.controller('ArticleDetailController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'CourseTagService', '$sce', '$cookies', '$httpParamSerializer', 'video', '$route',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, courseTagSrv, $sce, $cookies, $httpParamSerializer,
		video, $route) {
		if ($stateParams.courseId === undefined) {
			$state.go('home');
		}
		var token = $location.search().token;
		if (token !== undefined) {
			console.log('set token on cookie');
			$cookies.put('access_token', token);
		}
		$scope.showShare = false;
		$scope.shareImg = "img/share_400_400_2.png";
		$scope.courseUrl = $location.absUrl();
		console.log('location=', $scope.courseUrl);
		var util = new DomainNameUtil($location);
		$scope.originUrl = window.location.href;
		console.log('get access token:', $cookies.get('access_token'));
		$scope.favoriteCls = 'fontawesome-heart-empty';
		$scope.favoriteText = '收藏';
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
			setFavoriteDom();
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
			// var ret = recordShareFavorite('SHARE');
			// ret.success(function(e){

			// });
		}

		$scope.favorite = function() {
			console.log('favorite');
			$http({
                                method: 'POST',
                                url: 'http://www.imzao.com/payment/education/zaozao/wechat/pay/test',
                                headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                        'access_token': $cookies.get('access_token')
                                },
                                data: $httpParamSerializer({
                                        product_desc: 'product_desc',
                                        product_detail:'product_detail',
                                        price: 1,
                                        'openid': 'oylrrviRhbTDqnuHkStG8m-S5IIA'
                                })
                        }).success(function(e) {
                                console.log('res:',e);
                                var timestamp = (new Date()).valueOf()+"";
                                wx.chooseWXPay({
    timestamp: e.timestamp+'', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    nonceStr: e.nonce_str, // 支付签名随机串，不长于 32 位
    package: "prepay_id="+e.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    paySign: e.sign, // 支付签名
    success: function (res) {
        // 支付成功后的回调函数
        console.log('pay res:', res);
    },
    fail: function(res){
        alert(JSON.stringify(res));
    }
});
                        });
		}

		function setFavoriteDom() {
			if ($scope.course.favorited === true) {
				$scope.favoriteCls = 'fontawesome-heart';
				$scope.favoriteText = '已收藏';
			} else {
				$scope.favoriteCls = 'fontawesome-heart-empty';
				$scope.favoriteText = '收藏';
			}
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

		document.getElementById('course_video').addEventListener('webkitendfullscreen', function(e) {
			// handle end full screen 
			console.log('webkitendfullscreen');
			$scope.showVideo = false;
			$scope.showPlayButton = true;
			$scope.$apply();
		});

		document.getElementById('course_video').addEventListener('webkitenterfullscreen', function(e) {
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
			console.log('js api config:', $scope.courseUrl);
			$http.get(util.getBackendServiceUrl() + '/wechat/jsapi?url=' + $scope.courseUrl.split('#')[0].replace('&', '%26'))
				.success(function(e) {
					console.log(e);
					var signature = e;
					$scope.timestamp=e.timestamp;
					wx.config({
						debug: true,
						appId: e.appid,
						timestamp: e.timestamp,
						nonceStr: e.noncestr,
						signature: e.signature,
						jsApiList: ['checkJsApi', 'chooseWXPay']
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
						imgUrl: encodeURI($scope.course.titleImageUrl),
						success: function() {
							console.log('share success');
							scope.showShare = false;
							recordShareFavorite('SHARE');
						},
						cancel: function() {
							console.log('cancel share');
							scope.showShare = false;
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
						imgUrl: encodeURI($scope.course.titleImageUrl), // 分享图标
						// 分享类型,music、video或link，不填默认为link
						// 如果type是music或video，则要提供数据链接，默认为空
						success: function(res) {
							// 用户确认分享后执行的回调函数
							console.log('share success');
							recordShareFavorite('SHARE');
							scope.showShare = false;
						},
						cancel: function(res) {
							// 用户取消分享后执行的回调函数
							console.log('cancel share');
							scope.showShare = false;
						},
						fail: function(res) {

						}
					});
				}).error(function(e) {

				});
		}

		function recordShareFavorite(activity) {
			var link = util.getBackendServiceUrl() + '/course/interactive';
			if ('FAVORITE' === activity) {
				link = util.getBackendServiceUrl() + '/favorite';
			}
			var req = {
				method: 'POST',
				url: link,
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
			return $http(req);
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
					if (state !== undefined) {
						scope.showVideo = true;
					} else {
						scope.showVideo = false;

					}
					scope.$apply();
				});

		});
	}
});

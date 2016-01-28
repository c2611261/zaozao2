var angularjs = angular.module('userProfileModule', ['ngCookies', 'ngVideo']);
angularjs.controller('UserProfileController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'$sce', '$cookies', '$httpParamSerializer', 'video', '$route',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, $sce, $cookies, $httpParamSerializer,
		video, $route) {
		$rootScope.title = '我';
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
		var util = new DomainNameUtil($location);
		$http.get(util.getBackendServiceUrl() + '/user', {
			headers: {
				'access_token': $cookies.get('access_token')
			}
		}).success(function(e) {
			console.log('get user ', e);
			$scope.userInfo = e;
			if ($scope.userInfo.child === null) {
				console.log('the user doesnot have child');
				$state.go('user_profile_edit');
			} else {
				var child = $scope.userInfo.child;
				console.log('user child:', child);
				var birthdate = new Date(child.childBirthdate);
				$scope.birthdate = birthdate.getFullYear() + '.' + (birthdate.getMonth() + 1) + "." + birthdate.getDate();
				$scope.genderText = child.gender === 'MALE' ? '男孩' : '女孩';
			}
		}).error(function(e) {

		});
	}
]);

angularjs.controller('UserProfileEditController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'$sce', '$cookies', '$httpParamSerializer', 'video', '$route',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, $sce, $cookies, $httpParamSerializer,
		video, $route) {
		$rootScope.title = '我';
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);
		$scope.userInfo = {};
		setupDateElements();
		var util = new DomainNameUtil($location);
		configJSAPI(util);
		$http.get(util.getBackendServiceUrl() + '/user', {
			headers: {
				'access_token': $cookies.get('access_token')
			}
		}).success(function(e) {
			console.log('get user ', e);
			$scope.userInfo = e;
			if ($scope.userInfo.child === null) {

			} else {
				var d = new Date($scope.userInfo.child.childBirthdate);
				console.log('child birthdate:', d.getMonth());
				$scope.childBirthYear = d.getFullYear();
				$scope.childBirthMonth = d.getMonth() + 1;
				$scope.childBirthDay = d.getDate();
				$scope.changeYearMonth($scope.childBirthYear, $scope.childBirthMonth);
				$scope.privilege = e.privilege;
				// $scope.privilege.userName = e.privilege.userName === 1?true:false;
			}
		}).error(function(e) {

		});

		$scope.chooseImage = function(){
			if($scope.privilege.userImage === 0){
			console.log('choose image not allow');
				return;
			}
			console.log('choose image');
			wx.chooseImage({
			    count: 1, // 默认9
			    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			    success: function (res) {
			    	console.log('select image success ', res);
			        $scope.imageIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
			    	console.log('select image id ', imageIds);
			    }
			});
		}

		$scope.submit = function() {
			if($scope.imageIds !== undefined && $scope.imageIds !== null){
				uploadImage();
			} else {
				editUserProfile(null);
			}
		}

		function editUserProfile(mediaId) {
			var birthdate = $scope.childBirthYear + '/' + ($scope.childBirthMonth) + '/' + $scope.childBirthDay;

			$http({
				method: 'POST',
				url: util.getBackendServiceUrl() + '/userprofile',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					'access_token': $cookies.get('access_token')
						//'Content-Type': 'multipart/form-data; charset=utf-8;'
				},
				data: $httpParamSerializer({
					user_name: $scope.userInfo.nickname,
					gender: $scope.userInfo.child.gender,
					child_name: $scope.userInfo.child.childName,
					child_birthdate: birthdate,
					media_id: mediaId
				})
			}).success(function(e) {
				$state.go('user_profile');
			});
		}
		function uploadImage(){
			wx.uploadImage({
			    localId: $scope.imageIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
			    isShowProgressTips: 1, // 默认为1，显示进度提示
			    success: function (res) {
					console.log('upload image server id:', res);
					editUserProfile(res.serverId);
			    }
			});

		}

		$scope.changeYearMonth = function(y, m) {
			console.log('month changed to ', m);
			var d = new Date(y, m, 0).getDate();
			$scope.day = [];
			console.log('there are ' + d + ' days');
			for (var i = 1; i <= d; i++) {
				$scope.day.push(i);
			}
		}

		function setupDateElements() {
			var currentDate = new Date();
			var year = currentDate.getFullYear();
			$scope.year = [];
			for (var i = year - 10; i <= year; i++) {
				$scope.year.splice(0, 0, i);
			}
			$scope.month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			$scope.day = [];
		}

		function configJSAPI(util) {

			$http.get(util.getBackendServiceUrl() + '/wechat/jsapi?url=' + $location.absUrl().split('#')[0])
				.success(function(e) {
					console.log(e);
					var signature = e;
					wx.config({
						debug: false,
						appId: e.appid,
						timestamp: e.timestamp,
						nonceStr: e.noncestr,
						signature: e.signature,
						jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
					});
					wx.ready(function() {
						console.log('wx ready');

					});
					wx.error(function(res) {
						console.log('wx error');
					});
				});

		}

	}
]);

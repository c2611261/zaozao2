var angularjs = angular.module('userProfileModule', ['ngCookies', 'ngVideo']);
angularjs.controller('UserProfileController', ['$rootScope', '$scope',
	'$http', '$stateParams', '$state', '$location',
	'$sce', '$cookies', '$httpParamSerializer', 'video', '$route',
	function($rootScope, $scope, $http, $stateParams,
		$state, $location, $sce, $cookies, $httpParamSerializer,
		video, $route) {

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
			}
			var child = $scope.userInfo.child;
			var birthdate = new Date(child.childBirthdate);
			$scope.birthdate = birthdate.getFullYear()+'.'+(birthdate.getMonth()+1)+"."+birthdate.getDate();
			$scope.genderText = child.gender === 'MALE'?'男孩':'女孩';
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
		$scope.userInfo = {};
		setupDateElements();

		var util = new DomainNameUtil($location);
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
				$scope.childBirthMonth = d.getMonth()+1;
				$scope.childBirthDay = d.getDate();
				$scope.changeYearMonth($scope.childBirthYear, $scope.childBirthMonth);
			}
		}).error(function(e) {

		});

		$scope.submit = function() {
			editUserProfile();
		}

		function editUserProfile() {
			var birthdate = $scope.childBirthYear+'/'+($scope.childBirthMonth )+ '/'+$scope.childBirthDay;
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
					child_birthdate: birthdate
				})
			}).success(function(e) {
				$state.go('user_profile');
			});
		}

		function editUserProfileAndImage() {

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

	}
]);
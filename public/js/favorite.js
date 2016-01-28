angular.module('favoriteModule', ['ngRoute',
	'infinite-scroll', 'mgcrea.pullToRefresh', 'shareFavoriteServiceModule', 'ngDialog'
]).

controller('FavoriteController', ['$rootScope', '$scope', '$http', '$location',
	'$stateParams', '$state', '$cookies', 'ShareFavoriteService', 'ngDialog',
	function($rootScope, $scope, $http, $location, $stateParams, $state, $cookies, favoriteSrv, ngDialog) {
		var util = new DomainNameUtil($location);
		refresh();
		$rootScope.title = "我的收藏";
		var $body = $('body');
		var $iframe = $('<iframe src="/favicon.ico"></iframe>');
		$iframe.on('load', function() {
			setTimeout(function() {
				$iframe.off('load').remove();
			}, 0);
		}).appendTo($body);

		function refresh() {
			$scope.courses = [];
			$scope.loadBusy = false;
			$scope.currentPageIdx = 0;
			$scope.stopLoading = false;
		}

		$scope.pullToRefresh = function() {
			console.log('refresh');
			refresh();
		}

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

		$scope.loadingCourses = function() {
			console.log('loading courses ', $scope.loadBusy);
			if ($scope.loadBusy === true) {
				return;
			}
			$scope.loadBusy = true;
			loadCourses();
		}

		function loadCourses() {
			console.log('load course ', $scope.currentPageIdx);
			$http.get(util.getBackendServiceUrl() +
					'/favorite?' + 'number=' + 3 + "&page_index=" + $scope.currentPageIdx, {
						headers: {
							'access_token': $cookies.get('access_token')
						}
					})
				.success(function(e) {
					console.log('get course ', e);
					var num = Object.getOwnPropertyNames(e).length;
					console.log('get course count:', num);
					if (num > 1) {
						for (var i = 0; i < e.length; i++) {
							$scope.courses.push(e[i]);
						}
						$scope.currentPageIdx++;
						$scope.loadBusy = false;
					} else {
						$scope.loadBusy = true;
						$scope.stopLoading = true;
					}
					updateCourseBottomStyle();
					//console.log('total course ', $scope.courses);
					console.log('total number of courses ', $scope.courses.length);
				});
		}

		$scope.removeFavorite = function(course) {
			console.log('remove favorite ', course);
			ngDialog.open({
				template: '/public/views/confirm_delete.html',
				name: '',
				showClose: false,
				closeByEscape: true,
				className: 'ngdialog-theme-default',
				controller: ['$scope', function($scope) {
					
					$scope.checkInput = function(adminPwd) {
						return true;
					};
				}]
			}).closePromise.then(function(data) {
				console.log('confirm return '+data.value);
				if (data.value !== true) {
					return;
				}
				var ret = favoriteSrv.recordShareFavorite('FAVORITE', course.id);
				ret.success(function(e) {
					console.log('remove favorite');
					var i = 0
					for (; i < $scope.courses.length; i++) {
						if (course.id === $scope.courses[i].id) {
							break;
						}
					}
					$scope.courses.splice(i, 1);
					updateCourseBottomStyle();
				});
			});

		}

		function updateCourseBottomStyle() {
			if ($scope.courses.length > 0) {
				for (var i = 0; i < $scope.courses.length - 1; i++) {
					$scope.courses[i].bottom = "";
				}
				$scope.courses[$scope.courses.length - 1].bottom = "browse-bottom";
			}
		}
	}


]);

var login = angular.module("shareFavoriteServiceModule", []);

login.service('ShareFavoriteService', function($http, $location, $httpParamSerializer, $cookies) {
	this.courseTags = new Array();
	var util = new DomainNameUtil($location);
	var that = this;

	this.recordShareFavorite = function(activity, courseId) {
		var util = new DomainNameUtil($location);
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
				course_id: courseId,
				flag: activity
			})
		};
		return $http(req);
	}



});
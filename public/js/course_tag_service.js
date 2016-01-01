var login = angular.module("courseTagServiceModule", []);

login.service('CourseTagService', function($rootScope, $q, $http, $location, $httpParamSerializer) {
	this.courseTags = new Array();
	var util = new DomainNameUtil($location);
	var that = this;
	this.getCourseTags = function() {
		var deferred = $q.defer();
		var promise = deferred.promise;
		$http.get(util.getBackendServiceUrl() + "/course_tags")
			.success(function(e) {
				console.log('get course tags:', e);
				for (var i = 0; i < e.length; i++) {
					that.courseTags[i] = {};
					that.courseTags[i].imageUrl = (e[i].imageUrl);
					that.courseTags[i].url = 'yujiaokecheng_home.html#?tagId=' + e[i].id;
					that.courseTags[i].id = e[i].id;
					that.courseTags[i].name = e[i].name;
					console.log('locaiton:', $location.path());

				}
				initTagBackground(that);
				deferred.resolve(that.courseTags);
			}).error(function(e) {
				deferred.reject(e);
			});
		return promise;
	}

	this.getCourseTag = function(id){
		for(var courseTag in this.courseTags){
			if(courseTag.id === id){
				return courseTag;
			}
		}
		return null;
	}

	function initTagBackground(that) {
		that.courseTags[0].backgroundCls = 'yellow';
		that.courseTags[1].backgroundCls = 'light-brown';
		that.courseTags[2].backgroundCls = 'green';
		that.courseTags[3].backgroundCls = 'dark-brown';
	}
});
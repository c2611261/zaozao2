var login = angular.module("courseTagServiceModule", []);

login.service('CourseTagService', function($rootScope, $q, $http, $location, $httpParamSerializer) {
	this.courseTags = new Array();
	var util = new DomainNameUtil($location);
	var that = this;

	this.getCourseTags = function() {
		var deferred = $q.defer();
		var promise = deferred.promise;
		if(this.courseTags.length > 0){
			deferred.resolve(this.courseTags);
			return promise;
		}
		$http.get(util.getBackendServiceUrl() + "/course_tags")
			.success(function(e) {
				console.log('get course tags:', e);
				for (var i = 0; i < e.length; i++) {
					that.courseTags[i] = {};
					that.courseTags[i].imageUrl = (e[i].imageUrl);
					that.courseTags[i].url = 'public/views/course_category.html#?tagId=' + e[i].id;
					that.courseTags[i].id = e[i].id.toString();
					that.courseTags[i].name = e[i].name;
					console.log('locaiton:', $location.path());
					if(i>3){
						that.courseTags[i].enabled = false;
						that.courseTags[i].opacity = {opacity:0.5};
					}else{
						that.courseTags[i].enabled = true;
						that.courseTags[i].opacity = {opacity:1};
					}
				}
				initTagBackground(that);
				deferred.resolve(that.courseTags);
			}).error(function(e) {
				deferred.reject(e);
			});
		return promise;
	}


	this.getCourseTag = function(id){
		for(var i=0; i< this.courseTags.length;i++){
			if(this.courseTags[i].id === id){
				return this.courseTags[i];
			}
		}
		return null;
	}

	this.getCourseTagId = function(name){
		for(var i=0; i< this.courseTags.length;i++){
			if(this.courseTags[i].name === name){
				return this.courseTags[i].id;
			}
		}
		return "";
	}

	function initTagBackground(that) {
		that.courseTags[0].backgroundCls = 'yellow';
		that.courseTags[1].backgroundCls = 'light-brown';
		that.courseTags[2].backgroundCls = 'green';
		that.courseTags[3].backgroundCls = 'dark-brown';
	}
});
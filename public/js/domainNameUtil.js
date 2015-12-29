var DomainNameUtil = function($location){
	this.$location = $location;
	this.backendPort = 8080;
}

DomainNameUtil.prototype.getBackendServiceUrl=function(){
	return this.$location.protocol()+"://"+this.$location.host()
		+":"+ this.backendPort+"/education/zaozao";
}

DomainNameUtil.prototype.getResourceUrl = function(url){
	return this.$location.protocol()+"://"+this.$location.host()
		+":"+ this.$location.port()+"/"+url;
}
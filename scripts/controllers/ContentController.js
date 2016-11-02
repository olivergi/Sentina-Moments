'use strict';

var app = angular.module('SentinaMoments', ['ngRoute']);
	 app.config(function($routeProvider){
		    $routeProvider
		    .when("/player", {
		        templateUrl : "../../views/player.html"
		    })
		    .when("/menu", {
		        templateUrl : "../../views/menu.html"
		    });
	});
    app.controller('ContentController', function ($scope, $log, $compile) {
    	
      
       
    });

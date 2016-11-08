'use strict';

var app = angular.module('SentinaMoments', ['ngRoute', 'ngAudio']);
	app.config(function($routeProvider){
		    $routeProvider
		    .when("/", {
		        templateUrl : "../../views/player.html"
		    })
		    .when("/menu", {
		        templateUrl : "../../views/menu.html"
		    });
	});
    app.controller('ContentController', function ($scope, $log, $compile) {
    	
      
       
    });

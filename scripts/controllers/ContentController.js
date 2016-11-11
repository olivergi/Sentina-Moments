'use strict';

var app = angular.module('SentinaMoments', ['ngRoute', 'ngAudio']);
	// Content routing for the application
	app.config(function($routeProvider){
		    $routeProvider
		    .when("/", {
		        templateUrl : "../../views/player.html"
		    })
		    .when("/menu", {
		        templateUrl : "../../views/menu.html"
		    });
	});

	app.value("songRemember",{})
	    .controller('ContentController', function($scope, ngAudio) {
	        $scope.audios = [
	        ngAudio.load("https://archive.org/download/InceptionSoundtrackHD12TimeHansZimmer/Inception%20Soundtrack%20HD%20-%20%2312%20Time%20%28Hans%20Zimmer%29.mp3"),
 	
	        ]
	    })
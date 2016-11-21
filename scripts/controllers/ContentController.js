'use strict';

var app = angular.module('SentinaMoments', ['ui.router', 'ngAudio']);
	// Content routing for the application
	app.config(function($urlRouterProvider, $stateProvider){
		    $stateProvider

		    .state("player", {
                url: "/",
                templateUrl: "../../views/player.html",
                controller: function($scope, ngAudio, songRemember) {
                    $scope.currentSong = "https://archive.org/download/InceptionSoundtrackHD12TimeHansZimmer/Inception%20Soundtrack%20HD%20-%20%2312%20Time%20%28Hans%20Zimmer%29.mp3";
                    
                    if (songRemember[$scope.currentSong]) {
                        $scope.audio = songRemember[$scope.currentSong];
                    } else {
                        $scope.audio = ngAudio.load($scope.currentSong);
                        songRemember[$scope.currentSong] = $scope.audio;

                    }
                }
            })


	        .state('menu', {
	            url: "/menu",
	            templateUrl: "../../views/menu.html",
	        })
            .state('favourites', {
	            url: "/favourites",
	            templateUrl: "../../views/favourites.html",
	        })
            


        	$urlRouterProvider.otherwise('/');
	});

	app.value("songRemember",{})
	    .controller('ContentController', function($scope, ngAudio) {
	        $scope.audios = [
	        ngAudio.load("https://archive.org/download/InceptionSoundtrackHD12TimeHansZimmer/Inception%20Soundtrack%20HD%20-%20%2312%20Time%20%28Hans%20Zimmer%29.mp3"),
 	
	        ]
	    })
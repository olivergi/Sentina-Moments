'use strict';

var app = angular.module('SentinaMoments', ['ui.router', 'ngAudio']);
// Content routing for the application
app.config(function($urlRouterProvider, $stateProvider){
	    $stateProvider

	    .state("player", {
            url: "/",
            templateUrl: "../../views/player.html",
            controller: function($scope, ngAudio, songRemember,$log, VariableFactory) {
            	var url = VariableFactory.audios[VariableFactory.currentSong];

                if (songRemember[url]) {
                	// If the current song is remembered, load the file on the player.
                    $scope.audio = songRemember[url];
                } else {
                	// Initial audio load
                    //$scope.audio = ngAudio.load(url);
                    //songRemember[url] = $scope.audio;

                }
            }
        })

        .state('menu', {
            url: "/menu",
            templateUrl: "../../views/menu.html",
        })

        .state('search', {
        	url: "/search",
            templateUrl: "../../views/search.html",
        })
        
        .state('channels', {
        	url: "/channels",
            templateUrl: "../../views/channels.html",
        })


    	$urlRouterProvider.otherwise('/');
});

// Value for remembering the audio when in other views
app.value("songRemember",{})
	// The main controller of the application
    .controller('MainController', function($scope, ngAudio, $log, $state, $http, RequestService, VariableFactory) {
	    // temporary setup for authorizing the user
	    // TODO: Authorization through login page
	    RequestService.formPost("auth/page/hashdb/login");
	    // Get the user object
	    RequestService.getUser();

	  	// Get today's playlist
		RequestService.getTodaysRecipe();

        // Have a listener when the RequestService calls for loading a playlist with a recipeID
		$scope.$on('startPlaylist', function(event) {
	        $scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong]);
	    })

	    //Listener for getting the nonces once the user object is available
		$scope.$on('getNonces', function(event) {
		  	RequestService.getNonces()
	    })

        $scope.nextTrack = function() {
        	$log.info("current audio: ",$scope.audio);    

        	if (VariableFactory.currentSong >= VariableFactory.audios.length-1){
        		// start the playlist again
        		$log.info("playlist restart");
        		VariableFactory.currentSong = 0;
        		$scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong]);
        	} else {
        		// take the next song in the audios 
		 		$scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong +1]);
		 		VariableFactory.currentSong = VariableFactory.currentSong +1;
		 		$log.info("next audio:",$scope.audio);
        	}

        	// reload the view
        	$state.reload();
	 	}

});
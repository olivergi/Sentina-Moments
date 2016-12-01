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
	    // Boolean for the next track button to fix the issue that it cannot be spam clicked
	    $scope.clickableNextTrack = true;

        // Have a listener when the RequestService calls for loading a playlist with a recipeID
		$scope.$on('startPlaylist', function(event) {

	        $scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong]);
	        $scope.todRecipe = VariableFactory.todaysRecipe;
		    $scope.recipeName = VariableFactory.currentRecipeName;
		    $scope.currentSongInfo = VariableFactory.todaysRecipe[VariableFactory.currentSong];
		      
		    if ($scope.currentSongInfo.musicPieceArtist != null) {
			  $scope.artistName = $scope.currentSongInfo.musicPieceArtist;
		      $scope.trackName = $scope.currentSongInfo.musicPieceName;
		    } else {
		      $scope.audioProgramName = $scope.currentSongInfo.audioProgramName;
		      $scope.audioProgramDescription = $scope.currentSongInfo.audioProgramDescription;
		    }
	        // assign an autoplay for audiofiles, call nextTrack() when the current track's progress is full
	        $scope.$watch(function() {
			  return $scope.audio.progress;
			}, function(newValue) {
				if (newValue >= 1 ){
					$scope.nextTrack();
				}
			});
	    }) 	

	    //Listener for getting the nonces once the user object is available
		$scope.$on('getNonces', function(event) {
		  	RequestService.getNonces()
	    })

        $scope.nextTrack = function() {
        	//$log.info("current audio: ",$scope.audio);
        	// Stop the current audio before getting the next
        	$scope.audio.restart();

        	// set the next track button as unclickable for a moment 
        	// so the nonce of the audiofile gets used correctly in the backend
        	$scope.clickableNextTrack = false;
        	
        	// check if the current song index reaches the end of the playlist
        	if (VariableFactory.currentSong >= VariableFactory.todaysRecipe.length-1){
        		// start the playlist again
        		$log.info("playlist restart");
        		VariableFactory.currentSong = 0;

        		// insert the currentsong into the playlist
        		RequestService.insertAudio(VariableFactory.currentSong);

        		$scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong]);
        	} else {
        		// choose the next song
        		
        		// Inserts the first audio file from the recipe to the playlist
        		RequestService.insertAudio(VariableFactory.currentSong+1); 
		 		
		 		$scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong+1]);
		 		VariableFactory.currentSong++;

		 		//$log.info("next audio:",$scope.audio);
		 		$scope.audio.play();	
        	}
        	// update the scope values for the new track, so the UI values update
        	$scope.currentSongInfo = VariableFactory.todaysRecipe[VariableFactory.currentSong];
         	if ($scope.currentSongInfo.musicPieceArtist != null) {
			  $scope.artistName = $scope.currentSongInfo.musicPieceArtist;
		      $scope.trackName = $scope.currentSongInfo.musicPieceName;
		    } else {
		      $scope.audioProgramName = $scope.currentSongInfo.audioProgramName;
		      $scope.audioProgramDescription = $scope.currentSongInfo.audioProgramDescription;
		    }

        	// reload the view
        	$state.reload();

        	// have a timer for the button to be clickable again
        	setTimeout(function() {
        		$scope.clickableNextTrack = true;
        	}, 1000);    
	 	}

});
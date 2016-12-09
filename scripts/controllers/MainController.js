'use strict';

var app = angular.module('SentinaMoments', ['ui.router', 'ngAudio']);
// Content routing for the application
app.config(function($urlRouterProvider, $stateProvider){
	$stateProvider

	.state("player", {
		url: "/",
		templateUrl: "../../views/player.html",
		controller: function($scope, ngAudio, songRemember,$log, VariableFactory, $state, RequestService) {
			if (VariableFactory.user.id == null){
				$state.go('login');
			}

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
		controller: function(VariableFactory, $state) {
			if (VariableFactory.user.id == null){   
				$state.go('login');
			}
		}
	})

	.state('search', {
		url: "/search",
		templateUrl: "../../views/search.html",
		controller: function(VariableFactory, $state) {
			if (VariableFactory.user.id == null){   
				$state.go('login');
			}
		}
	})

	.state('daily', {
		url: "/daily",
		templateUrl: "../../views/daily.html",
		controller: function(VariableFactory, $state) {
			if (VariableFactory.user.id == null){   
				$state.go('login');
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "../../views/login.html",
	})

	.state('channels', {
		url: "/channels",
		templateUrl: "../../views/channels.html",
		controller: function(VariableFactory, $state) {
			if (VariableFactory.user.id == null){   
				$state.go('login');
			}
		}
	})

	.state('favourites', {
		url: "/favourites",
		templateUrl: "../../views/favourites.html",
		controller: function(VariableFactory, $state) {
			if (VariableFactory.user.id == null){   
				$state.go('login');
			}
		}
	})

	$urlRouterProvider.otherwise('/');

});

// Value for remembering the audio when in other views
app.value("songRemember",{})
	// The main controller of the application
	.controller('MainController', function($scope, ngAudio, $log, $state, $http, RequestService, VariableFactory) {

	    // Boolean for the next track button to fix the issue that it cannot be spam clicked
	    $scope.clickableNextTrack = true;

        // Have a listener when the RequestService calls for loading a playlist with a recipeID
        $scope.$on('startPlaylist', function(event) {
        	if ($scope.audio != null) {
        		$scope.audio.restart();
        	}
            
        	$scope.audio = ngAudio.load(VariableFactory.audios[VariableFactory.currentSong]);
        	$scope.recipeName = VariableFactory.currentRecipeName;
        	$scope.currentSongInfo = VariableFactory.currentRecipe[VariableFactory.currentSong];

        	if ($scope.currentSongInfo.musicPieceArtist != null ) {
        		// Check for musicpieces from a recipe
        		$scope.artistName = $scope.currentSongInfo.musicPieceArtist;
        		$scope.trackName = $scope.currentSongInfo.musicPieceName;
        	} else if ($scope.currentSongInfo.audioProgramName != null) {
        		// Check for audioprogram items from a recipe
        		$scope.audioProgramName = $scope.currentSongInfo.audioProgramName;
        		$scope.audioProgramDescription = $scope.currentSongInfo.audioProgramDescription;
        	} else if ($scope.currentSongInfo.artist != null) {
        		// this check is for musicpieces through favourites and search view
        		$scope.artistName = $scope.currentSongInfo.artist;
        		$scope.trackName = $scope.currentSongInfo.name;
        	} else if ($scope.currentSongInfo.name != null) {
        		// this check is for audioprograms through favourites and search view
        		$scope.audioProgramName = $scope.currentSongInfo.name;
        		$scope.audioProgramDescription = $scope.currentSongInfo.description;
        	}
	        // assign an autoplay for audiofiles, call nextTrack() when the current track's progress is full
	        $scope.$watch(function() {
	        	return $scope.audio.progress;
	        }, function(newValue) {
	        	if (!VariableFactory.categoryMode && newValue >= 1 ){
	        		$scope.nextTrack();
	        	} else if ($scope.clickableNextTrack && newValue >= 1){
	        		$scope.nextTrack();	
	        	}
	        });
	        // continuation for the autoplay feature, for category mode
	        if (VariableFactory.categoryMode) {
	        	$scope.audio.play();
	        }
	    }) 	
        
        $scope.logout = function() {
            RequestService.request('POST', 'auth/logout', {}, {});
            localStorage.clear();
            VariableFactory.user = {};
            $log.info("USER OBJECT: ", VariableFactory.user);
            $state.go('login');
        }

	    //Listener for getting the nonces once the user object is available
	    $scope.$on('getNonces', function(event) {
	    	RequestService.getNonces()
	    })

	    $scope.nextTrack = function() {
        	// $log.info("current audio: ",$scope.audio);
        	// Stop the current audio before getting the next
        	$scope.audio.restart();

        	// set the next track button as unclickable for a moment 
        	// so the nonce of the audiofile gets used correctly in the backend
        	$scope.clickableNextTrack = false;

        	if (VariableFactory.categoryMode == true){
        		RequestService.nextMusicPieceFromCategory(VariableFactory.currentCategoryId);

        	} else {
	        	// check if the current song index reaches the end of the playlist
	        	if (VariableFactory.currentSong >= VariableFactory.currentRecipe.length-1){
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
	        	$scope.currentSongInfo = VariableFactory.currentRecipe[VariableFactory.currentSong];
	        	if ($scope.currentSongInfo.musicPieceArtist != null ) {
	        		// Check for musicpieces from a recipe
	        		$scope.artistName = $scope.currentSongInfo.musicPieceArtist;
	        		$scope.trackName = $scope.currentSongInfo.musicPieceName;
	        	} else if ($scope.currentSongInfo.audioProgramName != null) {
	        		// Check for audioprogram items from a recipe
	        		$scope.audioProgramName = $scope.currentSongInfo.audioProgramName;
	        		$scope.audioProgramDescription = $scope.currentSongInfo.audioProgramDescription;
	        	} else if ($scope.currentSongInfo.artist != null) {
	        		// this check is for musicpieces through favourites and search view
	        		$scope.artistName = $scope.currentSongInfo.artist;
	        		$scope.trackName = $scope.currentSongInfo.name;
	        	} else if ($scope.currentSongInfo.name != null) {
	        		// this check is for audioprograms through favourites and search view
	        		$scope.audioProgramName = $scope.currentSongInfo.name;
	        		$scope.audioProgramDescription = $scope.currentSongInfo.description;
	        	}
        	}
        	
        	// reload the view if in player view
        	if ($state.is("player")){
        		$state.reload();
        	}

        	// have a timer for the button to be clickable again
        	setTimeout(function() {
        		$scope.clickableNextTrack = true;
        	}, 1500);    
        }

    });
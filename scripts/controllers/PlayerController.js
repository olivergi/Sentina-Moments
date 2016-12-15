'use strict';

angular.module('SentinaMoments')
.controller('PlayerController',function($rootScope, $scope, ngAudio, $http, $state, $log, VariableFactory, RequestService){

	$scope.formatTime = function(seconds) {
		var minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		var seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	};

 	// Have a listener when the RequestService calls for loading a playlist with a recipeID
 	$scope.$on('loadPlaylist', function(event, obj) {
		// Parameter obj is an data object which contains needed info about the recipe
		RequestService.loadPlaylist(obj.data.id);
        // set a variable for the user interface to see what playlist is currently on
        VariableFactory.currentRecipeName = obj.data.name;
    });

 	$scope.$on('insertAudio', function(event) {
    	// Inserts the first audio file from the recipe to the playlist
    	RequestService.insertAudio(VariableFactory.currentSong);
    });
    
    $scope.changeCircleCss = function(circle) {
        if ($state.is('player')){
            document.getElementById("greenCircle").className = "greenCircle";
            document.getElementById("yellowCircle").className = "yellowCircle";
            document.getElementById(circle).className = circle+"Active";
        }
    }


    //This function gets the user favourites and then iterates through them checking if the 
    $scope.getUserTags = function(){
    	$scope.currentSong = VariableFactory.currentRecipe[VariableFactory.currentSong];
    	var i = 0;
    	var variableFound = false;

    	$http({
    		method: 'GET',
    		url: VariableFactory.apiurl + 'data/usertags',
    		headers: {
    			'Accept': 'application/json'
    		},
    		params: {
    			onlyTagged: true,
    			hideDeleted: true
    		}
    	}).then(function successCallback(response){
    		// Iterate through the usertags and check if the current objects ID corresponds to the one in the usertags
    		while (i <= response.data.result.length -1){

    			if(response.data.result[i].audioFileTaggedId != null && response.data.result[i].audioFileTaggedId == $scope.currentSong.musicPieceAudioFileId){
    				variableFound = true;
    				break;
    			} else if (response.data.result[i].audioFileTaggedId != null && response.data.result[i].audioFileTaggedId == $scope.currentSong.audioProgramAudioFileId){      
    				variableFound = true;
    				break;
    			} else if (response.data.result[i].audioFileTaggedId != null && response.data.result[i].audioFileTaggedId == $scope.currentSong.audioFileId){
    				variableFound = true;
    				break;
    			} else{
    				// Do nothing
    			}

    			i++;
    		}
    		// If the object is NOT found in the usertags, add to the favourites
    		if (variableFound == false) {
    			$scope.playerFav();
    		} else {
    			// TODO: User feedback 
    			$log.info($scope.currentSong, "already in favourites")
    		}
    	}, function errorCallback(response){
    		$log.error("ERROR:", response.data);
    	});
    }
    
    //This function is used in getUserTags, to send the POST for favouriting currentSong object.
    $scope.playerFav = function(){
    	$scope.currentSong = VariableFactory.currentRecipe[VariableFactory.currentSong];
    	var today = moment().utc().format();

    	if($scope.currentSong.musicPieceAudioFileId != null && $scope.currentSong.musicPieceArtist != null){
    		var tempObj = {
    			id:0,
    			userTagGroupId: null,
    			recipeTaggedId: null,
    			audioFileTaggedId: $scope.currentSong.musicPieceAudioFileId,
    			lengthAudioFile: 0,
    			audioProgramId: null,
    			musicPieceId: $scope.currentSong.id,
    			insertionTime: today
    		}
		} else if($scope.currentSong.audioProgramAudioFileId != null && $scope.currentSong.audioProgramName != null){ 
			var tempObj = {
				id:0,
				userTagGroupId: null,
				recipeTaggedId: null,
				audioFileTaggedId: $scope.currentSong.audioProgramAudioFileId,
				lengthAudioFile: 0,
				audioProgramId: $scope.currentSong.id,
				musicPieceId: null,
				insertionTime: today
			} 
		} else if($scope.currentSong.name != null || $scope.currentSong.artist != null){
			var tempObj = {
				id:0,
				userTagGroupId: null,
				recipeTaggedId: null,
				audioFileTaggedId: $scope.currentSong.audioFileId,
				lengthAudioFile: 0,
				audioProgramId: null,
				musicPieceId: null,
				insertionTime: today
			}
		}

		RequestService.request('POST',
			'data/usertags/0',
			{'Content-Type': 'application/json'},
			JSON.stringify(tempObj)); 
	}
});
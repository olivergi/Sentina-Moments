'use strict';

angular.module('SentinaMoments')
 .controller('PlayerController',function($rootScope, $scope, ngAudio, $http, $log, VariableFactory, RequestService){
 	$scope.apiurl = "http://localhost:8080/services/"

    $scope.formatTime = function(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        var seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
 	};

 	// Have a listener when the RequestService calls for loading a playlist with a recipeID
	$scope.$on('loadPlaylist', function(event, rId) {
        $scope.loadPlaylist(rId);
    })

	$scope.loadPlaylist = function(rId) {
      
      $http({
          method: 'GET',
          url: $scope.apiurl.concat('data/recipeitems'),
          headers: {
          'Accept': 'application/json'
          },
          params: {
            recipeId: rId.data
          }

      }).then(function successCallback(response) {
          $log.info("Success, recipe loaded:", response.data);
          VariableFactory.audios = [];

          for (var i = 0; i < response.data.result.length; i++) {
          	if (response.data.result[i].musicPieceAudioFileId != null){
            	var afId = response.data.result[i].musicPieceAudioFileId;
          	} else if (response.data.result[i].audioProgramId != null){
            	var afId = response.data.result[i].audioProgramAudioFileId;
          	}
            VariableFactory.audios[i] = $scope.apiurl.concat('audiofile/' + afId + '/' + VariableFactory.nonces[VariableFactory.nonceIndex].nonce + '/file.mp3');
          	RequestService.nextNonce();
          }

          $log.info("audios after recipeload: ", VariableFactory.audios);

          // Broadcast to the player that the playlist can be started
          $rootScope.$broadcast('startPlaylist');


      }, function errorCallback(response) {
          $log.error("ERROR:", response.data);
      });

  };

 })

'use strict';

angular.module('SentinaMoments')
 .controller('PlayerController',function($rootScope, $scope, ngAudio, $http, $log, VariableFactory, RequestService){
 	$scope.apiurl = "http://localhost:8080/services/";

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
        $scope.loadPlaylist(obj.data.id);
        // set a variable for the user interface to see what playlist is currently on
        VariableFactory.currentRecipeName = obj.data.name;
    })

	$scope.loadPlaylist = function(rId) {
      
      $http({
          method: 'GET',
          url: $scope.apiurl.concat('data/recipeitems'),
          headers: {
          'Accept': 'application/json'
          },
          params: {
            recipeId: rId
          }

      }).then(function successCallback(response) {
        $log.info("Success, recipe loaded:", response.data);
        $scope.todRecipe, VariableFactory.todaysRecipe = response.data.result;
        VariableFactory.audios = [];

        // Inserts the first audio file from the recipe to the playlist
        RequestService.insertAudio(VariableFactory.currentSong);

        //$log.info("audios after recipeload: ", VariableFactory.audios);

        // Broadcast to the player that the playlist can be started
        $rootScope.$broadcast('startPlaylist');


      }, function errorCallback(response) {
          $log.error("ERROR:", response.data);
      });

  };

 })

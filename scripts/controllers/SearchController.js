'use strict';

var app = angular.module('SentinaMoments');
app.controller('SearchController',function($rootScope, $scope, $http, $log, RequestService, VariableFactory, $state){
	// The results array for items that are shown on the view
	$scope.searchResults = [];
	// The index of the result page which is currently active
	$scope.currentResultPage = 0;
	// The amount of results a page can have
	$scope.resultPageSize = 4;
	// A variable for knowing which search was done, that the playlist can be correctly loaded
	$scope.listType = ""; 	

	// Function to calculate how many pages are made from the search results
	// Math.ceil rounds the result
	$scope.numberOfPages = function() {
		return Math.ceil($scope.searchResults.length/$scope.resultPageSize);                
	}
	$scope.currentPage = function() {
		return Math.ceil($scope.currentResultPage + 1);
	}

	$scope.searchRecipes = function() {

	    $http({
			method: 'GET',
			url: VariableFactory.apiurl + 'data/recipes',
			headers: {
				'Accept': 'application/json'
			},
			params: {
				start: 0,
				hideDeleted: true,
				contentQuery: $scope.searchQuery
			}

	    }).then(function successCallback(response) {
			$scope.searchResults = [];
			$scope.currentResultPage = 0;

			$log.info("Success:", response.data);

			$scope.searchResults = response.data.result;
			$scope.listType = "recipes";

	    }, function errorCallback(response) {
			$log.error("ERROR:", response.data);
	    });
	 }

	$scope.searchTracks = function() {

	    $http({
			method: 'GET',
			url: VariableFactory.apiurl + 'data/musicpieces',
			headers: {
				'Accept': 'application/json'
			},
				params: {
				start: 0,
				hideDeleted: true,
				similarityQuery: $scope.searchQuery
			}

	    }).then(function successCallback(response) {
			$scope.searchResults = [];
			$scope.currentResultPage = 0;

			$log.info("Success:", response.data);

			$scope.searchResults = response.data.result;
			$scope.listType = "musicpieces";

	    }, function errorCallback(response) {
			$log.error("ERROR:", response.data);
	    });
	} 

	$scope.searchPrograms = function() {

		$http({
			method: 'GET',
			url: VariableFactory.apiurl + 'data/audioprograms',
			headers: {
				'Accept': 'application/json'
			},
				params: {
				start: 0,
				hideDeleted: true,
				similarityQuery: $scope.searchQuery
			}

		}).then(function successCallback(response) {
			$scope.searchResults = [];
			$scope.currentResultPage = 0;

			$log.info("Success:", response.data);

			$scope.searchResults = response.data.result;
			$scope.listType = "audioprograms";

		}, function errorCallback(response) {
			$log.error("ERROR:", response.data);
		});
  }

	$scope.searchCategories = function() {

		$http({
			method: 'GET',
			url: VariableFactory.apiurl + 'data/musiccategories',
			headers: {
				'Accept': 'application/json'
			},
				params: {
				start: 0,
				hideDeleted: true,
				contentQuery: $scope.searchQuery
			}

		}).then(function successCallback(response) {
			$scope.searchResults = [];
			$scope.currentResultPage = 0;

			$log.info("Success:", response.data);

			$scope.searchResults = response.data.result;
			$scope.listType = "musiccategories";

		}, function errorCallback(response) {
			$log.error("ERROR:", response.data);
		});
	}

	$scope.loadPlaylist = function(resultObject, itemIndex) {
	    if ($scope.listType == "recipes"){
			if (VariableFactory.currentRecipeName != resultObject.name) {
				$state.go("player");
				RequestService.loadPlaylist(resultObject.id);
				VariableFactory.currentRecipeName = resultObject.name;
			} else {
				$log.info("this item is the current recipe")
				// Maybe add some kind of visual indicator that this is the current playing playlist
			}

	    } else if ($scope.listType == "audioprograms") {
	    	$state.go("player");
			VariableFactory.currentRecipeName = "Ei soittolistaa";
            VariableFactory.currentRecipe = [resultObject];
            VariableFactory.audios = [];
            VariableFactory.currentSong = 0;

            // Inserts the first audio file from the recipe to the playlist
            RequestService.insertAudio(VariableFactory.currentSong);

            // Broadcast to the player that the playlist can be started
            $rootScope.$broadcast('startPlaylist');

	    } else if ($scope.listType == "musicpieces") {
	    	$state.go("player");
			VariableFactory.currentRecipeName = "Ei soittolistaa";
            VariableFactory.currentRecipe = [resultObject];
            VariableFactory.audios = [];
            VariableFactory.currentSong = 0;

            // Inserts the first audio file from the recipe to the playlist
            RequestService.insertAudio(VariableFactory.currentSong);

            // Broadcast to the player that the playlist can be started
            $rootScope.$broadcast('startPlaylist');

	    } else if ($scope.listType == "musiccategories") {
	    	if (VariableFactory.currentRecipeName != resultObject.name) {
				$state.go("player");
				VariableFactory.categoryMode = true;
				VariableFactory.currentCategories = [];

				VariableFactory.currentRecipeName = resultObject.name;
				VariableFactory.currentCategories.push({
					id: resultObject.id,
					name: resultObject.name
	    		});
				RequestService.nextMusicPieceFromCategory(resultObject.id);
	    	} else {
	    		$log.info("this item is the current recipe")
				// Maybe add some kind of visual indicator that this is the current playing playlist
	    	}
	    	

	    }

	};

});

// Custom filter for the search results 
app.filter('startFrom', function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}		
});


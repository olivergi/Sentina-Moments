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
	// The string on the search input field, used as a parameter for the search requests
	$scope.searchQuery = "";
    // Variable for showing Favourite Icon
    $scope.showFavourite = false;

	// Function to calculate how many pages are made from the search results
	// Math.ceil rounds the result
	$scope.numberOfPages = function() {
		return Math.ceil($scope.searchResults.length/$scope.resultPageSize);                
	}
	$scope.currentPage = function() {
		return Math.ceil($scope.currentResultPage + 1);
	}

  	$scope.$watch(function() {
    	return $scope.searchQuery;
    }, function(newValue) {
    	if (newValue != null) {	
			if(newValue.length === 0){
				$scope.hideRemoveBtn = true;
	        } else {
				$scope.hideRemoveBtn = false;
	        }
		}
    });
    
    $scope.showFav = function (index) {
        document.getElementById("searchFav"+index).className = "searchFav";
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

			$scope.searchResults = response.data.result;
			$scope.listType = "audioprograms";

		}, function errorCallback(response) {
			$log.error("ERROR:", response.data);
		});
    }
    
    //Function for adding search results to favourites
      $scope.favSearch = function (obj) {
        var i = 0;
        var variableFound = false;
        var today = moment().utc().format();
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
        }).then(function successCallback(response) {
            while (i <= response.data.result.length - 1) {
                if (obj.id == response.data.result[i].recipeTaggedId) {
                    variableFound = true;
                    break;
                } else if (obj.audioFileId == response.data.result[i].audioFileTaggedId) {
                    variableFound = true;
                    break;
                } else {

                }
                i++;
            }
            if (variableFound == false) {
                if (obj.audioFileId != null) {
                    var tempObj = {
                        id: 0,
                        userTagGroupId: null,
                        recipeTaggedId: null,
                        audioFileTaggedId: obj.audioFileId,
                        lengthAudioFile: 0,
                        audioProgramId: null,
                        musicPieceId: obj.audioFileId,
                        insertionTime: today
                    }
                } else {
                    var tempObj = {
                        id: 0,
                        userTagGroupId: null,
                        recipeTaggedId: null,
                        audioFileTaggedId: obj.id,
                        lengthAudioFile: 0,
                        audioProgramId: null,
                        musicPieceId: null,
                        insertionTime: today
                    }
                }
                RequestService.request(
                        'POST',
                        'data/usertags/0', {
                            'Content-Type': 'application/json'
                        },
                        JSON.stringify(tempObj));
            } else {
                //$log.info(obj, "already in favourites")
            }
        }, function errorCallback(response) {
            $log.error("ERROR:", response.data);
        });
    }
    //Function to search through categories
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

			$scope.searchResults = response.data.result;
			$scope.listType = "musiccategories";

		}, function errorCallback(response) {
			$log.error("ERROR:", response.data);
		});
	}

    //Play the music from the search View
	$scope.loadPlaylist = function(resultObject, itemIndex) {
        // Set the category mode as false, in case the user was previously playing categories 
        VariableFactory.categoryMode = false;
	    
	    if ($scope.listType == "recipes"){
			if (VariableFactory.currentRecipeName != resultObject.name) {
				$state.go("player");
				RequestService.loadPlaylist(resultObject.id);
				VariableFactory.currentRecipeName = resultObject.name;
			} else {
				//$log.info("this item is the current recipe")
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
				VariableFactory.currentRecipeName = resultObject.name;
                VariableFactory.currentCategories = [];
				VariableFactory.currentCategories.push({
					id: resultObject.id,
					name: resultObject.name
	    		});
				RequestService.nextMusicPieceFromCategory(resultObject.id);
	    	} else {
	    		//$log.info("this item is the current recipe")
				// Maybe add some kind of visual indicator that this is the current playing playlist
	    	}
	    }
	};
});


// Custom filter for the search results 
app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
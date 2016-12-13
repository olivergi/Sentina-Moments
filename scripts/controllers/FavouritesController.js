'use strict';

angular.module('SentinaMoments')
    .controller('FavouritesController', function ($rootScope, $scope, $http, $log, $state, RequestService, VariableFactory) {
        // Variables for storing
        $scope.favourites = [];
        $scope.showDelete = false;
        $scope.showFavourite = false;
        $scope.userTags = [];
        $scope.viewState = '';

        $scope.getFavourites = function (route) {
            var getRoute = route;
            
            document.getElementById("musicpieces").className = "dailyButton";
            document.getElementById("audioprograms").className = "dailyButton";
            document.getElementById("recipes").className = "dailyButton";
            document.getElementById(route).className = "dailyButtonSelected";
            
            $http({
                method: 'GET',
                url: VariableFactory.apiurl + 'data/' + getRoute,
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    onlyTagged: true,
                    hideDeleted: true
                }

            }).then(function successCallback(response) {
                switch (getRoute) {
                    case "recipes":
                        $scope.viewState = 'recipes';
                        $scope.favourites = response.data.result;
                        break;
                    case "musicpieces":
                        $scope.viewState = 'musicpieces';
                        $scope.favourites = response.data.result;
                        break;
                    case "audioprograms":
                        $scope.viewState = 'audioprograms';
                        $scope.favourites = response.data.result;
                        break;
                }

            }, function errorCallback(response) {
                $log.error("ERROR:", response.data);
            });
        }

         $scope.deleteFav = function (obj) {
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
                $scope.userTags = response.data.result;
                var i = 0;
                while (i <= response.data.result.length - 1) {
                    // If the object is found in the usertags, delete the object
                    if (response.data.result[i].audioFileTaggedId == obj.audioFileId) {
                        $http({
                            method: 'DELETE',
                            url: VariableFactory.apiurl + '/data/usertags/' + response.data.result[i].id,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            //$log.info("Delete success: ", response.data);
                        }, function errorCallback(response) {
                            $log.error("ERROR:", response.data);
                        });
                        break;
                    } else {
                        // TODO: User feedback
                        // Usertag was not found
                    }

                    i++;
                }

            }, function errorCallback(response) {
                $log.error("ERROR:", response.data);
            });
        }
        
        // An on-click function for the bin to remove objects from the playlist
        $scope.checkView = function () {
            // if the delete functionality is active, then show prompt to confirm
            if($scope.showDelete == true) {
                swal({
                    title: "Oletko varma?",
                    text: "Valinnat poistetaan soittolistaltasi.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Kyllä",
                    cancelButtonText: "Peruuta",
                }, function() {
                    $scope.showDelete = false;
                    switch ($scope.viewState) {
                        case 'musicpieces':
                            $scope.getFavourites('musicpieces');
                            break;
                        case 'audioprograms':
                            $scope.getFavourites('audioprograms');
                            break;
                        case 'recipes':
                            $scope.getFavourites('recipes');
                            break;
                        }
                })   
            } else {
                // if the delete icons are not visible, make them visible.
                $scope.showDelete = true;
            }
        }

        $scope.favourite = function (obj) {
            var i = 0;
            while (i <= $scope.userTags.length - 1) {
                if ($scope.userTags[i].audioFileTaggedId == obj.audioFileId) {
                    RequestService.request('POST', '/data/usertags/0', {
                        'Content-Type': 'application/json'
                    }, JSON.stringify($scope.userTags[i]));
                    break;
                }
                i++;
            }
        }

        $scope.loadPlaylist = function (id, name, itemIndex) {
            VariableFactory.categoryMode = false;

            if ($scope.viewState == "recipes") {
                $state.go("player");
                if (VariableFactory.currentRecipeName != name) {
                    RequestService.loadPlaylist(id);
                    VariableFactory.currentRecipeName = name;
                } else {
                    //$log.info("this item is the current recipe")
                    // Maybe add some kind of visual indicator that this is the current playing playlist
                }
            } else if ($scope.viewState == "audioprograms") {
                // assign the audio as current audio and all of the audioprograms as the playlist
                $state.go("player");
                VariableFactory.currentRecipeName = "Suosikit - Ohjelmat";
                VariableFactory.currentRecipe = $scope.favourites;
                VariableFactory.audios = [];
                VariableFactory.currentSong = itemIndex;

                // Inserts the first audio file from the recipe to the playlist
                RequestService.insertAudio(VariableFactory.currentSong);

                // Broadcast to the player that the playlist can be started
                $rootScope.$broadcast('startPlaylist');

            } else if ($scope.viewState == "musicpieces") {
                // assign the audio as current audio and all musicpieces as the playlist
                $state.go("player");
                VariableFactory.currentRecipeName = "Suosikit - Kappaleet";
                VariableFactory.currentRecipe = $scope.favourites;
                VariableFactory.audios = [];
                VariableFactory.currentSong = itemIndex;

                // Inserts the first audio file from the recipe to the playlist
                RequestService.insertAudio(VariableFactory.currentSong);

                // Broadcast to the player that the playlist can be started
                $rootScope.$broadcast('startPlaylist');
            }

        };

        // Get and show the musicpieces when arriving to the view.
        $scope.getFavourites("musicpieces");

    });
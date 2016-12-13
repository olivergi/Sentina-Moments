'use strict';

angular.module('SentinaMoments')
    .controller('FavouritesController', function ($rootScope, $scope, $http, $log, $state, RequestService, VariableFactory) {
        // Variables for storing
        $scope.favourites = [];
        $scope.showDelete = false;
        $scope.showFavourite = false;
        $scope.userTags = [];
        $scope.viewState = '';

        $scope.getFromServer = function (route) {
            $log.info(route);
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
                $log.info("Success:", response.data);
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
                $log.info("Success:", response.data);
                $scope.userTags = response.data.result;
                var i = 0;
                while (i <= response.data.result.length - 1) {
                    if (response.data.result[i].audioFileTaggedId == obj.audioFileId) {
                        $log.info("Hello tämä löyty nyt")

                        $http({
                            method: 'DELETE',
                            url: VariableFactory.apiurl + '/data/usertags/' + response.data.result[i].id,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            $log.info("Success hello loop juttu ja delete onnistui: ", response.data);
                        }, function errorCallback(response) {
                            $log.error("ERROR:", response.data);
                        });
                        break;
                    } else {
                        $log.info("No same tagId");
                    }
                    i++;
                }

            }, function errorCallback(response) {
                $log.error("ERROR:", response.data);
            });
        }
        

        $scope.checkView = function () {
            switch ($scope.viewState) {
            case 'musicpieces':
                $scope.getFromServer('musicpieces');
                break;
            case 'audioprograms':
                $scope.getFromServer('audioprograms');
                break;
            case 'recipes':
                $scope.getFromServer('recipes');
                break;
            }
        }

        $scope.favourite = function (obj) {
            $log.info(obj);
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
                    $log.info("this item is the current recipe")
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
        $scope.getFromServer("musicpieces");

    });
'use strict';

angular.module('SentinaMoments')
    .controller('FavouritesController', function ($rootScope, $scope, $http, $log, $state, RequestService, VariableFactory) {
        $scope.apiurl = "http://localhost:8080/services/";
        //Variables for storing 
        $scope.user = {};
        $scope.nonces = [];
        $scope.favourites = [];
        $scope.showDelete = false;
        $scope.showFavourite = false;
        $scope.userTags = [];
        $scope.viewState = '';

        $scope.getFromServer = function (route) {
            $log.info(route);
            var getRoute = route;
            $http({
                method: 'GET',
                url: $scope.apiurl.concat('data/' + getRoute),
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
        
        $scope.deleteFav = function (id) {
            var getId = id;
            $http({
                method: 'GET',
                url: $scope.apiurl.concat('data/usertags'),
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
                while (i <= response.data.result.length) {
                    if (response.data.result[i].audioFileTaggedId == getId) {
                        $log.info("Hello tämä löyty nyt")

                        $http({
                            method: 'DELETE',
                            url: $scope.apiurl.concat('/data/usertags/' + response.data.result[i].id),
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
        
        $scope.checkView = function (){
            switch($scope.viewState){
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
            while (i <= $scope.userTags.length) {
                if ($scope.userTags[i].audioFileTaggedId == obj.audioFileId) {
                    $scope.post('/data/usertags/0', $scope.userTags[i]);
                    break;
                }
                i++;
            }
            /* $http({
                method: 'POST',
                url: $scope.apiurl.concat('data/usertags/' + id),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(function successCallback(response){
                $log.info("Succeess: ", response.data);
                
            }, function errorCallback(response){
                $log.error("ERROR: ", response.data);
            }); */
        }


        $scope.loadPlaylist = function(id, name) {
            if ($scope.viewState == "recipes"){
                $state.go("player");
                if (VariableFactory.currentRecipeName != name) {
                    RequestService.loadPlaylist(id);
                    VariableFactory.currentRecipeName = name;
                } else {
                    $log.info("this item is the current recipe")
                    // Maybe add some kind of visual indicator that this is the current playing playlist
                }
            } else if ($scope.viewState == "audioprograms") {
                // assign the audio as current audio
            } else if ($scope.viewState == "musicpieces") {
                // assign the audio as current audio
            }
            

        }

    });
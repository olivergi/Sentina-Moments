'use strict';

angular.module('SentinaMoments')
    .controller('FavouritesController', function ($scope, $http, $log, $state) {
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


        //Request to handle post/gets to the backend
        $scope.request = function (method, route, headersObj, body) {
            let headers = new Headers();
            if (typeof headersObj === 'object') {
                Object.keys(headersObj).forEach(function (key) {
                    let value = headersObj[key];
                    headers.append(key, value);
                });
            }
            headers.append('Accept', 'application/json');
            return fetch('/services/' + route, {
                method,
                body,
                headers,
                credentials: 'same-origin'
            }).then(resp => {
                if (!resp.ok) {
                    if (resp.status >= 500 || resp.status < 400) {
                        throw new Error('Internal error: ' + resp.status);
                    }
                    return resp.json().then(json => {
                        console.error(json);
                        let err = new Error('Request failed');
                        throw err;
                    });
                }
                $log.info(route + ":", resp);
                $scope.getUser();
                return resp.json();
            });
        }


        // First, get the user object
        $scope.getUser = function () {

            $http({
                method: 'GET',
                url: $scope.apiurl,
                headers: {
                    'Accept': 'application/json'
                }

            }).then(function successCallback(response) {
                $log.info("Success:", response.data.user);
                $scope.user = response.data.user;
                $scope.getFromServer('musicpieces');

            }, function errorCallback(response) {
                $log.error("ERROR:", response.data);
            });
        }

        /*$scope.$watch(function () {
            return $scope.showDelete;
        }, function (newValue) {
            $log.info(newValue)
            if (newValue == false) {
            }
        });*/

        // then get the nonces
        $scope.getNonces = function () {

            $http({
                method: 'GET',
                url: $scope.apiurl.concat('data/audiofilenonces'),
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    onlyTagged
                }

            }).then(function successCallback(response) {
                $log.info("Success:", response.data);
                $scope.nonces = response.data.result;
                $log.info("nonces: ", $scope.nonces);

            }, function errorCallback(response) {
                $log.error("ERROR:", response.data);
            });
        }

        // getting the actual audio file
        $scope.audioTest = function () {
            // Hard coded audio file ID, found it in
            // https://sentina.savelsirkku.fi/services/data/musicpieces
            $scope.afId = 21983;
            $scope.nonce = $scope.nonces[0].nonce;

            $http({
                method: 'GET',
                url: $scope.apiurl.concat('audiofile/' + $scope.afId + '/' + $scope.nonce + '/file.mp3'),
                headers: {
                    'Accept': 'application/json'
                }

            }).then(function successCallback(response) {
                $log.info("Success:", response);
                // Then do something with the audio file

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
        $scope.post = function (route, data) {
            $scope.request('POST', route, {
                'Content-Type': 'application/json'
            }, JSON.stringify(data));
        }



        //Log in function
        $scope.formPost = function (route) {
            var _username = 'Metropolia1';
            var _password = 'metr0609!';

            var cred = new FormData();

            cred.append('username', _username);
            cred.append('password', _password);
            return $scope.request('POST', route, {}, cred);
        }



        // temporary setup for authorizing the user
        // TODO: Authorization through login page
        $scope.formPost("auth/page/hashdb/login");


    });
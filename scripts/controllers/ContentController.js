'use strict';

var app = angular.module('SentinaMoments', ['ui.router', 'ngAudio']);
	// Content routing for the application
	app.config(function($urlRouterProvider, $stateProvider){
        
		    $stateProvider

		    .state("player", {
                url: "/",
                templateUrl: "../../views/player.html",
                controller: function($scope, ngAudio, songRemember) {

                    $scope.currentSong = "https://archive.org/download/InceptionSoundtrackHD12TimeHansZimmer/Inception%20Soundtrack%20HD%20-%20%2312%20Time%20%28Hans%20Zimmer%29.mp3";
                    
                    if (songRemember[$scope.currentSong]) {
                        $scope.audio = songRemember[$scope.currentSong];
                    } else {
                        $scope.audio = ngAudio.load($scope.currentSong);
                        songRemember[$scope.currentSong] = $scope.audio;

                    }
                }
            })


	        .state('menu', {
	            url: "/menu",
	            templateUrl: "../../views/menu.html",
	        })
            
            .state('daily', {
                url: "/daily",
                templateUrl: "../../views/daily.html",
            })


        	$urlRouterProvider.otherwise('/');
	});

	app.value("songRemember",{})
	    .controller('ContentController', function($scope, ngAudio, $log, $http, $state) {
	        $scope.audios = [
	        ngAudio.load("https://archive.org/download/InceptionSoundtrackHD12TimeHansZimmer/Inception%20Soundtrack%20HD%20-%20%2312%20Time%20%28Hans%20Zimmer%29.mp3"),
	        ]
            
            $scope.apiurl = 'http://localhost:8080/services/'
            

            $scope.auth = function() { 
                //post to /auth/page/hashdb/login
                $http({
                    method: 'POST',
                    url: $scope.apiurl.concat('auth/page/hashdb/login'),
                       body: cred,
                       headers: {
                           'Content-Type': 'application/json'
                       },
                       withCredentials: true,
                       credentials: 'same-origin'
                    }).then(function successCallback(response) {

                        $log.info("Success:", response.data);

                    }, function errorCallback(response) {
                        $log.error("ERROR:", response.data);
                    });
           }

          $scope.getFromServer = function() {
              $http({
               method: 'GET',
               url: $scope.apiurl.concat('data/recipes'),
               headers: {
               'Accept': 'application/json'
                  }
           }).then(function successCallback(response) {

               $log.info("Get from server:", response);

           }, function errorCallback(response) {
               $log.error("ERROR:", response.data);
           });
          }
          
          //Request
          function request(method, route, headersObj, body) {
          let headers = new Headers();
          if (typeof headersObj === 'object') {
            Object.keys(headersObj).forEach(function (key) {
              let value = headersObj[key];
              headers.append(key, value);
            });
          }
          headers.append('Accept', 'application/json');
          return fetch('/services' + route, {
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
             $log.info("Log In Success:", resp.data);
            return resp.json();
          });
          }
          
        //Log in function
        function formPost(route) {
            var _username = 'Metropolia1';
            var _password = 'metr0609!'; 
            
            var cred = new FormData();

            cred.append('username', _username);
            cred.append('password', _password);
          return request('POST', route, {}, cred);
        }
          
        //functions called by the Controller on load
          formPost('/auth/page/hashdb/login');
          //$scope.auth();
          $scope.getFromServer();
        
        
        document.querySelector('nav').addEventListener('click', function (evt) {
            if (evt.detail === 3) {
                $log.info("Triple Clicked!!");
                $state.go('menu');
            }
        });
        
        
	    })
    
    
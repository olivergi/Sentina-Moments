'use strict';

var app = angular.module('SentinaMoments')
 app.controller('SearchController',function($scope, $http, $log,$window){
 	$scope.apiurl = "http://localhost:8080/services/"
 	$scope.searchResults = [];
 	$scope.currentResultPage = 0;
 	$scope.resultPageSize = 4; 	

 	// Function to calculate how many pages are made from the search results
 	// Math.ceil rounds the result
 	$scope.numberOfPages = function() {
        return Math.ceil($scope.searchResults.length/$scope.resultPageSize);                
	}
	$scope.currentPage = function() {
		return Math.ceil($scope.currentResultPage + 1);
	}

	$scope.getFromServer = function() {

	   	$http({
	        method: 'GET',
	        url: $scope.apiurl.concat('data/recipes'),
	        headers: {
	        'Accept': 'application/json'
	   		},
	   		params: {
	   			contentQuery: $scope.searchQuery
	   		}

	    }).then(function successCallback(response) {
	    	$scope.searchResults = [];
	    	$scope.currentResultPage = 0;

	        $log.info("Success:", response.data);

	        for (var i = 0; i < response.data.result.length; i++) {
	        	$scope.searchResults[i] = response.data.result[i];
	        }


	    }, function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
   }

   $scope.getNonce = function() {

	   	$http({
	        method: 'GET',
	        url: $scope.apiurl.concat('data/audiofilenonces'),
	        headers: {
	        'Accept': 'application/json'
	   		},
	   		params: {
	   			 sessionToken: ""
	   		}

	    }).then(function successCallback(response) {
	        $log.info("Success:", response.data);


	    }, function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
   }

	//Request to handle post/gets to the backend
   $scope.request = function(method, route, headersObj, body) {
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
         $log.info(document.cookie);
        return resp.json();
      });
  };
      
    //Log in function
    $scope.formPost = function(route) {
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

 // Custom filter for the search results 
 app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
 });

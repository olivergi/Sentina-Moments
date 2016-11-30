'use strict';

var app = angular.module('SentinaMoments')
 app.controller('SearchController',function($scope, $http, $log, VariableFactory){
 	$scope.apiurl = "http://localhost:8080/services/"
  $scope.user = {};
  $scope.nonces = [];
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

	$scope.searchRecipes = function() {

   	$http({
        method: 'GET',
        url: $scope.apiurl.concat('data/recipes'),
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

    }, function errorCallback(response) {
        $log.error("ERROR:", response.data);
    });
  }

  $scope.searchTracks = function() {

    $http({
        method: 'GET',
        url: $scope.apiurl.concat('data/musicpieces'),
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

    }, function errorCallback(response) {
        $log.error("ERROR:", response.data);
    });
  } 

  $scope.searchPrograms = function() {

    $http({
        method: 'GET',
        url: $scope.apiurl.concat('data/audioprograms'),
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

    }, function errorCallback(response) {
        $log.error("ERROR:", response.data);
    });
  }

  $scope.searchCategories = function() {

    $http({
        method: 'GET',
        url: $scope.apiurl.concat('data/musiccategories'),
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

    }, function errorCallback(response) {
        $log.error("ERROR:", response.data);
    });
  }

  $scope.audioTest = function() {
    $scope.afId = 21983;
    $scope.nonce = VariableFactory.nonces[0].nonce;

    $http({
          method: 'GET',
          url: $scope.apiurl.concat('audiofile/' + $scope.afId + '/' + $scope.nonce + '/file.mp3'),
          headers: {
          'Accept': 'application/json'
        }

      }).then(function successCallback(response) {
          $log.info("Success:", response);

          $scope.audios = [];
          $scope.audios[0] = $scope.apiurl.concat('audiofile/' + $scope.afId + '/' + $scope.nonce + '/file.mp3');
          $log.info($scope.audios);

      }, function errorCallback(response) {
          $log.error("ERROR:", response.data);
      });

  };

});

// Custom filter for the search results 
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

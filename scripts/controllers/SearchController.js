'use strict';

var app = angular.module('SentinaMoments');
 app.controller('SearchController',function($scope, $http, $log, VariableFactory){
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

    }, function errorCallback(response) {
        $log.error("ERROR:", response.data);
    });
  }
});

// Custom filter for the search results 
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

'use strict';

angular.module('SentinaMoments')
 .controller('SearchController',function($scope, $http, $log){
 	$scope.apiurl = "http://localhost:8080/services/"
 	$scope.searchResults = [];
 	$scope.currentResultPage = 0;
 	$scope.resultPageSize = 5; 	

 	// Function to calculate how many pages are made from the search results
 	$scope.numberOfPages = function() {
        return Math.ceil($scope.searchResults.length/$scope.resultPageSize);                
}

	$scope.getFromServer = function() {
		var query;
		if ($scope.searchQuery != null){
			query = $scope.searchQuery;
		} else {
			query = {}
		}
	   	$http({
	        method: 'GET',
	        url: $scope.apiurl.concat('data/recipes'),
	        headers: {
	        'Accept': 'application/json'
	   		},
	   		params: {
	   			similarityQuery: query
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
         $log.info(route + ":", resp.data);
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


   // temporary populating function for the results
   $scope.pop = function() {
   	$log.info("populating")
   		for (var i = 0; i < 50; i++) {
			$scope.searchResults[i] = {
				recipeName: "recipe name",
				recipeDesc: "recipe description containing information about the playlist"
			} 			
   		}
   };

   $scope.pop();
   $scope.formPost("auth/page/hashdb/login");
   $log.info($scope.searchResults);
 });

 // Custom filter for the search results 
 app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
 });

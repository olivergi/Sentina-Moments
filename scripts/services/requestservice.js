var app = angular.module('SentinaMoments');
app.service("RequestService", function($log, $http, VariableFactory, $rootScope) {
	// Service which returns functions to be used in other classes 

	return {
	//Request for login
	request: function(method, route, headersObj, body) {
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
	      return resp.json();
	    });
	},
    
	//Log in function
	formPost: function(route) {
	    var _username = 'Metropolia1';
	    var _password = 'metr0609!'; 
	      
	    var cred = new FormData();

	    cred.append('username', _username);
	    cred.append('password', _password);
	    return this.request('POST', route, {}, cred);
	},
    
    //Login form function    
    loginFormPost: function(route, username, password) {
	    var _username = username;
	    var _password = password; 
	      
	    var cred = new FormData();

	    cred.append('username', _username);
	    cred.append('password', _password);
	    return this.request('POST', route, {}, cred);
	},

	getNonces: function() {

	   	$http({
	        method: 'GET',
	        url: VariableFactory.apiurl + 'data/audiofilenonces',
	        headers: {
	        'Accept': 'application/json'
	   		},
	   		params: {
	   			 sessionToken: VariableFactory.user.lastSessionToken
	   		}

	    }).then(function successCallback(response) {
	        $log.info("Nonces:", response.data.result);
	        VariableFactory.nonces = response.data.result;

	    }, function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
	},

	nextNonce: function() {
		if(VariableFactory.nonceIndex < 9){
      		VariableFactory.nonceIndex++;
      	} else {
      		$rootScope.$broadcast('getNonces');
      		VariableFactory.nonceIndex = 0;
      	}

	},

	getUser: function() {
	    $http({
	          method: 'GET',
	          url: VariableFactory.apiurl,
	          headers: {
	          'Accept': 'application/json'
	        }

	      }).then(function successCallback(response) {
	          $log.info("Success, user object:", response.data.user);
	          // set the user object
	          VariableFactory.user = response.data.user;

	          $rootScope.$broadcast('getNonces');
            $rootScope.$broadcast('getTodaysRecipe');

	      }, function errorCallback(response) {
	          $log.error("ERROR:", response.data);
	      });
  	},

 	// use 'Moment' library to get today's date and then call
 	// the getRecipeTimings function to get today's recipe
 	getTodaysRecipe: function() {
	  var today = moment().format('YYYY-MM-DD');
	  return this.getRecipeTimings(JSON.stringify([today]));
	},

	getRecipeTimings: function(dayList) {
		$log.info("getting today's recipe")

		$http({
          method: 'GET',
          url: VariableFactory.apiurl + 'data/recipetimings',
          headers: {
          'Accept': 'application/json'
          },
          params: {
            dayList: dayList
          }

      }).then(function successCallback(response) {
          $log.info("Success, today's recipe: ", response.data.result);

            setTimeout(function(){
                $rootScope.$broadcast('loadPlaylist', {
                data: response.data.result[0].id
                });
            }, 1000)

      }, function errorCallback(response) {
          $log.error("ERROR:", response.data);
      });
	},

	};

});
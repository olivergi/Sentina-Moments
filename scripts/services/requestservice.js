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

    //Login form function    
    loginFormPost: function(route, username, password) {
    	var _username = username;
    	var _password = password; 

    	var cred = new FormData();

    	cred.append('username', _username);
    	cred.append('password', _password);
        
        $log.info("CREDS: ", username, password );
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
      		// Have a timeout to get new nonces, otherwise the current nonce won't get used 
      		setTimeout(function() {
      			$rootScope.$broadcast('getNonces');
      		},500)
      		VariableFactory.nonceIndex = 0;
      	}
      },

      insertAudio: function(songIndex) {
      	var i = songIndex;
      	var playlist = VariableFactory.currentRecipe;

      	// assign the file ID's
      	if (playlist[i].musicPieceAudioFileId != null){
      		var afId = playlist[i].musicPieceAudioFileId;
      	} else {
      		var afId = playlist[i].audioProgramAudioFileId;
      	}
      	// Assign the audio playlist's file URL with the ID and nonce
      	VariableFactory.audios[i] = VariableFactory.apiurl + 'audiofile/' + afId + '/' + VariableFactory.nonces[VariableFactory.nonceIndex].nonce + '/file.mp3';
      	// call nextNonce() to check the state of available nonces
      	return this.nextNonce();

      },

      loadPlaylist: function(rId) {

      	$http({
      		method: 'GET',
      		url: VariableFactory.apiurl + 'data/recipeitems',
      		headers: {
      			'Accept': 'application/json'
      		},
      		params: {
      			recipeId: rId
      		}

      	}).then(function successCallback(response) {
      		$log.info("Success, recipe loaded:", response.data);
      		VariableFactory.currentRecipe = response.data.result;
      		VariableFactory.audios = [];
      		VariableFactory.currentSong = 0;

 		// Inserts the first audio file from the recipe to the playlist
 		$rootScope.$broadcast('insertAudio');

        // Broadcast to the player that the playlist can be started
        $rootScope.$broadcast('startPlaylist');


    }, function errorCallback(response) {
    	$log.error("ERROR:", response.data);
    });

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

	      }, function errorCallback(response) {
	      	$log.error("ERROR:", response.data);
	      });

	  	// Get today's playlist
	  	return this.getTodaysRecipe();
	  },

 	// use 'Moment' library to get today's date and then call
 	// the getRecipeTimings function to get today's recipe
 	getTodaysRecipe: function() {
 		var today = moment().format('YYYY-MM-DD');
 		return this.getRecipeTimings(JSON.stringify([today]));
 	},

 	getRecipeTimings: function(dayList) {
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
 			VariableFactory.todaysRecipe = response.data.result;

 			setTimeout(function(){
 				$rootScope.$broadcast('loadPlaylist', {
 					data: {
 						id: response.data.result[0].id,
 						name: response.data.result[0].name
 					}
 				});
 			}, 1000)

 		}, function errorCallback(response) {
 			$log.error("ERROR:", response.data);
 		});
 	},

 };

});
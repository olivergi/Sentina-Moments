'use strict';

app.controller('ChannelController', function ($scope, $http, $log, $rootScope, $sce, ngAudio){
 
 	$scope.title = "Valitse kanavat, joista pidät:";
 	$scope.apiurl = "http://localhost:8080/services/";
 	$scope.user = {};
	$scope.nonces = [];	
	$scope.nonceIterator = -1;	
 	$scope.channelButtons = [];
 	$scope.selectedChannels = [];
 	$scope.playlist = [];
 	$scope.playlistAudioFiles = [];

    $scope.toggleChannelButton = function () {
        this.chButton.state = !this.chButton.state;
    };
    
    function getChannelsFromServer() {
	  	$http({
	    	method: 'GET',
	        url: $scope.apiurl.concat('data/musiccategories'),
	        headers: {
	        'Accept': 'application/json'
	   		},
	   		params: {
	   			start: 0
	   		}

	    }).then(function successCallback(response) {

	        $log.info("Success:", response.data);
	        createButtons(response.data.result);

	    }, function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
   	}
    
    function createButtons(respData) {
    	$scope.count = Object.keys(respData).length;
		for (var i=0; i < $scope.count; i++) {
     	  	var name = respData[i].name;
     	  	var id = respData[i].id;
     	  	$scope.channelButtons.push({
      			label: name,
      			state: false,
      			longTitle: checkNameLength(name),
      			id: id
    		});
    	}
	};
	
	function checkNameLength(name) {
		if (name.length > 14) {
			return true;
		}
		else {
		 	return false;
		}
	};
	
	$scope.getSelectedChannels = function() {
		$scope.selectedChannels = [];
		$scope.playlist = [];
		$scope.playlistAudioFiles = [];
		$scope.nonceIterator = 0;
		for (var i=0; i < $scope.count; i++) {
     	  	if($scope.channelButtons[i].state == true) {
     	  		$scope.selectedChannels.push({
      				id: $scope.channelButtons[i].id
    			});
     	  	}	
    	}
    	console.log($scope.selectedChannels);
    	checkSelectedChannelsLength();
	};
	
	function checkSelectedChannelsLength () {
		if($scope.selectedChannels.length > 0) {
			console.log("Creating playlist");
			createPlaylist();
		}
		else {
			console.log("No channels selected");
			//Show message?
		}
	};
	
	function createPlaylist() {
		for (var i = 0; i < $scope.selectedChannels.length; i++) {
			console.log("Selected channels left: "+$scope.selectedChannels.length);
      		getNextMusicPieceFromCategory($scope.selectedChannels[i].id);
    	}
	}
   
   function getNextMusicPieceFromCategory(categoryId) {
	   	$http({
	        method: 'GET',
	        url: $scope.apiurl.concat('music-category-channel/'+categoryId),
	        headers: {
	        	'Accept': 'application/json'
	   		}
	    }).then(function successCallback(response) {
	        $log.info("Success:", response.data);
	        console.log("Audiofile ID: "+response.data.audioFileId);
	        $scope.playlist.push({	
				id: response.data.audioFileId
			});
			$rootScope.$broadcast('audioIdFound');
	    }, 	function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
   	}
   	
	$scope.$on('audioIdFound', function(event, path) {
		console.log("Audio ID saved");
		if($scope.playlist.length == $scope.selectedChannels.length) {
			getAudioFiles();
		}
	});
	
	function getAudioFiles() {
		
		for (var i = 0; i < $scope.playlist.length; i++) {
			console.log("Getting audio file, id "+$scope.playlist[i].id);
      		getAudioFileFromServer($scope.playlist[i].id);
    	}
    	
    	/*
    	var i = -1;
    	while ($scope.playlistAudioFiles.length <= $scope.playlist.length) {
    		i++;
    		console.log("Getting audio file, id "+$scope.playlist[i].id);
      		getAudioFileFromServer($scope.playlist[i].id);
    	}*/
	}
   
	function getAudioFileFromServer(audioId) {
		console.log(audioId);
		console.log($scope.nonceIterator);
		console.log($scope.nonceIterator++);
	 	$scope.nonce = $scope.nonces[$scope.nonceIterator].nonce; //VAIN KYMMENEN
	   	$http({
	        method: 'GET',
	        url: $scope.apiurl.concat('audiofile/'+audioId+'/'+$scope.nonce+'/file.mp3'),
	        headers: {
	        'Accept': 'application/json'
	   		}
	    }).then(function successCallback(response) {
	        $log.info("Success (audioId "+audioId+")");
	        $scope.playlistAudioFiles.push({	
				audioFile: response
			});
			$rootScope.$broadcast('audioFileFound');   
	    }, function errorCallback(response) {
	        $log.error("ERROR:", response.data);
	    });
   	}
   	
   	$scope.$on('audioFileFound', function(event, path) {
		console.log("Audio file saved");
		$scope.getNonces(); //runs 10000 times
		if ($scope.playlistAudioFiles.length == $scope.playlist.length) {
			console.log($scope.playlistAudioFiles.length);
		}
	});
   
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
  
  $scope.formPost = function(route) {
        var _username = 'Metropolia1';
        var _password = 'metr0609!'; 
        
        var cred = new FormData();

        cred.append('username', _username);
        cred.append('password', _password);
		return $scope.request('POST', route, {}, cred);
    }
    
	$scope.getUser = function() {
    	$http({
          	method: 'GET',
          	url: $scope.apiurl,
          	headers: {
          	'Accept': 'application/json'
        }}).then(function successCallback(response) {
        	$log.info("Success:", response.data.user);
			$scope.user = response.data.user;
			$scope.getNonces();
      	}, function errorCallback(response) {
          	$log.error("ERROR:", response.data);
		});	
   }
   
   $scope.getNonces = function() {
   		$http({
        	method: 'GET',
        	url: $scope.apiurl.concat('data/audiofilenonces'),
        	headers: {
        		'Accept': 'application/json'
   			},
   			params: {
   			 	sessionToken: $scope.user.lastSessionToken
   			}

    	}).then(function successCallback(response) {
        	$log.info("Success:", response.data);
        	$scope.nonces = response.data.result;
        	$log.info("nonces: ", $scope.nonces);
        	return response.data.result;
    	}, function errorCallback(response) {
        	$log.error("ERROR:", response.data);
        	return "Error";
    	});
  	}
    
   $scope.formPost("auth/page/hashdb/login");
   $scope.getUser();
   
   getChannelsFromServer();
 });


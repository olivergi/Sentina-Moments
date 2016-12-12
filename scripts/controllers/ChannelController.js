'use strict';

app.controller('ChannelController', function ($scope, $http, $log, $rootScope, VariableFactory, RequestService){
 
 	$scope.title = "Valitse kanavat, joista pidät:";
	$scope.nonceIterator = -1;	
 	$scope.channelButtons = [];
 	$scope.selectedChannels = [];
 	$scope.playlist = [];
 	$scope.playlistAudioFiles = [];
    $scope.buttonSelected = 0;

    $scope.toggleChannelButton = function () {
        this.chButton.state = !this.chButton.state;
        if (this.chButton.state == true){
            $scope.buttonSelected++;
        } else {
            $scope.buttonSelected--;
        }
    };
    
    function getChannelsFromServer() {
	  	$http({
	    	method: 'GET',
	        url: VariableFactory.apiurl + 'data/musiccategories',
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
    	checkSelectedChannelsLength();
	};
	
	function checkSelectedChannelsLength () {
		if($scope.selectedChannels.length > 0) {
			createPlaylist();
		}
		else {
			//Show message?
		}
	};
	
	function createPlaylist() {
		for (var i = 0; i < $scope.selectedChannels.length; i++) {
      		getNextMusicPieceFromCategory($scope.selectedChannels[i].id);
    	}
	}
   
   function getNextMusicPieceFromCategory(categoryId) {
	   	$http({
	        method: 'GET',
	        url: VariableFactory.apiurl + 'music-category-channel/' + categoryId,
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
  			getAudioFileFromServer($scope.playlist[i].id);
    	}
	}
   
	function getAudioFileFromServer(audioId) {
		var nonces = VariableFactory.nonces;
		if($scope.nonceIterator > 9) {
			$scope.nonceIterator > 0;
		}
		else {
			$scope.nonceIterator++;
		}
	 	var nonce = nonces[$scope.nonceIterator].nonce; //VAIN KYMMENEN
	   	$http({
	        method: 'GET',
	        url: VariableFactory.apiurl + 'audiofile/' + audioId + '/' + nonce +' /file.mp3',
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
		if($scope.nonceIterator > 3) {
			RequestService.getNonces();
		}
		if ($scope.playlistAudioFiles.length == $scope.playlist.length) {
			console.log($scope.playlistAudioFiles.length);
		}
	});
     
   	getChannelsFromServer();
 });


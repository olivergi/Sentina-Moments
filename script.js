var app = angular.module('SentinaMoments', []);

/*
app.factory('ChannelPlaylistService', function($http, $q) {
	return {
        getAudioFileFromServer: function(audioId) {
			console.log(audioId);
	 		$scope.nonce = $scope.nonces[0].nonce;
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
       {
    }
});

app.factory('nonceService', function() {
	var nonces = "test";
  	return {
      	nonce : nonces
  	}
});*/



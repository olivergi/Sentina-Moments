'use strict';

app.controller('ChannelController', function ($scope, $http, $log, $rootScope, VariableFactory, RequestService, $state){
 
 	$scope.title = "Valitse kanavat, joista pidät:";
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
    // Populate the ng-repeat array to show the fetched music channels
    function createButtons(respData) {
    	$scope.categoryCount = respData.length;
		for (var i=0; i < $scope.categoryCount; i++) {
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
	
	// Checks the length of the music category that the name is shown correctly 
	function checkNameLength(name) {
		if (name.length > 14) {
			return true;
		}
		else {
		 	return false;
		}
	};
	
	// Get the buttons that are selected 
	$scope.getSelectedChannels = function() {
		$scope.selectedChannels = [];

		VariableFactory.currentCategories = [];

		for (var i=0; i < $scope.categoryCount; i++) {
     	  	if($scope.channelButtons[i].state == true) {
     	  		$scope.selectedChannels.push({
      				id: $scope.channelButtons[i].id
    			});

    			VariableFactory.currentCategories.push({
    				id: $scope.channelButtons[i].id,
    				name: $scope.channelButtons[i].label
    			});
     	  	}	
		}

		// If there are selected channels, create a playlist of those channels
		if($scope.selectedChannels.length > 0) {
			createPlaylist();
		} else {
			// If no categories are selected, show a message?
			// Or maybe have the button as disabled until there is atleast 1 selection
		}

	};
	
	function createPlaylist() {
		$state.go("player");
		VariableFactory.categoryMode = true;

		VariableFactory.currentRecipeName = VariableFactory.currentCategories[0].name;
		RequestService.nextMusicPieceFromCategory(VariableFactory.currentCategories[0].id);

	}
     
    // Get the music categories on load of the state
   	getChannelsFromServer();
 });


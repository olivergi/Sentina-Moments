'use strict';

app.controller('DailyController', function ($rootScope, $scope, $http, $log, $state, RequestService, VariableFactory) {
    $scope.dailyPlaylist = [];
    $scope.dailyItems = [];
    $scope.viewState = "";

    $scope.filterItems = function(filter) {
        // filters the content on the results depending on the type
        $scope.dailyItems = [];
        
        if ($state.is('daily')){
            document.getElementById("Music").className = "dailyButton";
            document.getElementById("News").className = "dailyButton";
            document.getElementById("Spiritual").className = "dailyButton";
            document.getElementById("Story").className = "dailyButton";
            document.getElementById("Game").className = "dailyButton";
            document.getElementById("Exercise").className = "dailyButton";
            document.getElementById("Radio").className = "dailyButton";
            document.getElementById("Kaikki").className = "dailyButton";
            
            document.getElementById(filter).className = "dailyButtonSelected";

            for (var i = 0; i < $scope.dailyPlaylist.length; i++){
                if(filter == 'Kaikki') {
                    // If filter 'Kaikki' is selected, push all items to the playlist
                    $scope.dailyItems.push($scope.dailyPlaylist[i])
                } else {
                    // Otherwise check the types and display the correct objects
                    if($scope.dailyPlaylist[i].type == filter) {
                        $scope.dailyItems.push($scope.dailyPlaylist[i]);
                    } 
                }
                
            }
            $scope.viewState = filter;
        }
            
    }

    $scope.getDailyItems = function() {
        if (VariableFactory.todaysRecipe[0] != null) {
            var rId = VariableFactory.todaysRecipe[0].id;
        } 

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
            $log.info("Success, daily items fetched:", response.data);
            $scope.dailyPlaylist = response.data.result;

            $scope.filterItems("Music");

        }, function errorCallback(response) {
            $log.error("ERROR:", response.data);
        });
    }

    $scope.loadPlaylist = function(resultObject, itemIndex) {

        $state.go("player");

        switch($scope.viewState) {
            case "Music":
                var fileType = 'Musiikki';
                break;
            case "News":
                var fileType = 'Uutiset';
                break;
            case "Spiritual":
                var fileType = 'Hengelliset';
                break;
            case "Story":
                var fileType = 'Tarinat';
                break;
            case "Game":
                var fileType = 'Pelit';
                break;
            case "Exercise":
                var fileType = 'Jumpat';
                break;
            case "Radio":
                var fileType = 'Radio';
                break;
            case "Kaikki":
                var fileType = 'Kaikki';
                break;

        }
        if (fileType != 'Kaikki'){
            VariableFactory.currentRecipeName = "Päivän resepti - " + fileType; 
        } else {
            VariableFactory.currentRecipeName = VariableFactory.todaysRecipe[0].name;
        }
        VariableFactory.currentRecipe = $scope.dailyItems;
        VariableFactory.audios = [];
        VariableFactory.currentSong = itemIndex;

        // Inserts the first audio file from the recipe to the playlist
        RequestService.insertAudio(VariableFactory.currentSong);

        // Broadcast to the player that the playlist can be started
        $rootScope.$broadcast('startPlaylist');

    };  

    $scope.getDailyItems(); 

});
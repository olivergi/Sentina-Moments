'use strict';

app.controller('DailyController', function ($rootScope, $scope, $http, $log, $state, RequestService, VariableFactory) {
    $scope.dailyPlaylist = [];
    $scope.dailyItems = [];
    $scope.viewState = "";

    $scope.filterItems = function(filter) {
        // filters the content on the results depending on the type
        $scope.dailyItems = [];
        
        document.getElementById("Music").className = "dailyButton";
        document.getElementById("News").className = "dailyButton";
        document.getElementById("Spiritual").className = "dailyButton";
        document.getElementById("Story").className = "dailyButton";
        document.getElementById("Game").className = "dailyButton";
        document.getElementById("Exercise").className = "dailyButton";
        document.getElementById("Radio").className = "dailyButton";
        
        document.getElementById(filter).className = "dailyButtonSelected";

        for (var i = 0; i < $scope.dailyPlaylist.length; i++){
            if($scope.dailyPlaylist[i].type == filter) {
                $scope.dailyItems.push($scope.dailyPlaylist[i]);
            } 
        }
        $scope.viewState = filter;
            
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

    $scope.getDailyItems(); 

});
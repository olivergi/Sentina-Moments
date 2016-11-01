'use strict';

angular.module('SentinaMoments')
    .controller('ContentController', function ($scope, $log) {
    	$scope.currentView = "player";
      
        $scope.changeView = function(v) {
        	$log.info("hello " + v);
        	switch(v){
        		case "player":
        			$log.info("player");
        			// change to player changeView
        			break;
        		case "menu":
        			// change to menu view
        			$log.info("menu");
        			break;

        	}
        };

    });

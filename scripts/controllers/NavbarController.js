'use strict';

angular.module('SentinaMoments').controller('NavbarController',function($scope, $log, $state){
	
	$scope.clicks = 0;
	$scope.firstClickDate = 0;
	$scope.showMenu = false;

	// prevents the passage to the menu view by accident
	$scope.tripleclick = function() {
		if (!$state.is("login")){
			if (new Date() - $scope.firstClickDate < 1000){
				$scope.clicks++;
			} else {
				$scope.clicks = 1;	
			}

			// If the navbar is pressed three times within 0.5 second intervals
			if($scope.clicks == 3){
				$scope.toggleAdvancedMode();
				$scope.clicks = 1;
			}
			$scope.firstClickDate = new Date();
		}
		
	}
	
	$scope.toggleAdvancedMode = function() {
		$scope.showMenu = $scope.showMenu ? false : true;
	}
});
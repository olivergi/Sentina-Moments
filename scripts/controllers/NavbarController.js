'use strict';

angular.module('SentinaMoments').controller('NavbarController',function($scope, $log, $state){
	
	$scope.clicks = 0;
	$scope.firstClickDate = 0;
	$scope.showMenu = false;

	// prevents the passage to the menu view by accident
	$scope.tripleclick = function() {
		if (!$state.is("login")){
			if (new Date() - $scope.firstClickDate < 500){
				$scope.clicks++;
			} else {
				$scope.clicks = 1;	
			}

			// If the navbar is pressed three times within 0.5 second intervals
			if($scope.clicks == 3){
				toggleAdvancedMode();
				$scope.clicks = 1;
			}
			$scope.firstClickDate = new Date();
		}
		
	}
	
	function toggleAdvancedMode() {
		$scope.showMenu = $scope.showMenu ? false : true;
	}
});
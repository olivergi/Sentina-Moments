'use strict';

angular.module('SentinaMoments').controller('NavbarController',function($scope, $log){
	
	$scope.clicks = 0;
	$scope.firstClickDate = 0;
	$scope.showMenu = false;

	$scope.tripleclick = function() {
		if(new Date() - $scope.firstClickDate < 500){
			$scope.clicks++;
		}
		else{
			$scope.clicks = 1;	
		}
		if($scope.clicks == 3){
			toggleAdvancedMode();
			$scope.clicks = 1;
		}
		$scope.firstClickDate = new Date();
	}
	
	function toggleAdvancedMode() {
		$scope.showMenu = $scope.showMenu ? false : true;
	}
});

'use strict';

angular.module('SentinaMoments')
 .controller('PlayerController',function($scope,ngAudio){
 	$scope.audio = ngAudio.load("http://static1.grsites.com/archive/sounds/birds/birds007.wav");
 })
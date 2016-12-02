'use strict';

var app = angular.module('SentinaMoments')
 app.controller('LoginController',function($scope, $http, $log, VariableFactory, RequestService, $state){
     
     $scope.submit = function() {
         var _username = $('#username').val();
         var _password = $('#password').val();
         
         RequestService.loginFormPost("auth/page/hashdb/login", _username, _password);
         RequestService.getUser();
         
         setTimeout(function(){
            if (VariableFactory.user.id != null){   
                $state.go('player');
            }
         }, 1000)
     }
 });
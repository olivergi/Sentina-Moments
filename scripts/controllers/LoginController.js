'use strict';

var app = angular.module('SentinaMoments')
 app.controller('LoginController',function($scope, $http, $log, VariableFactory, RequestService, $state){
     
     $scope.sessionCheck = function() {
         $log.info("SessionCheck Called");
      if (localStorage.username != null) {
         $log.info("Session Check True");
         var sessionuser = localStorage.username;
         var sessionpass = localStorage.password;
         
         RequestService.loginFormPost("auth/page/hashdb/login", sessionuser, sessionpass);
         RequestService.getUser();
         
         setTimeout(function(){
            if (VariableFactory.user.id != null){   
                $state.go('player');
            }
         }, 1000)
         
        }   
     }
     
     $scope.submit = function() {
         var _username = $('#username').val();
         var _password = $('#password').val();
         
         if (typeof(Storage) !== "undefined") {
                localStorage.setItem("username", _username);
                localStorage.setItem("password", _password);
             $log.info("Session Set");
        } else {
            // Sorry! No Web Storage support..
            $log.info("Sorry");
        }
         
         RequestService.loginFormPost("auth/page/hashdb/login", _username, _password);
         RequestService.getUser();
         
         setTimeout(function(){
            if (VariableFactory.user.id != null){   
                $state.go('player');
            }
         }, 1000)
     }
     
     $scope.sessionCheck();
 });
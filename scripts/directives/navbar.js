angular.module('SentinaMoments')
    .directive('navbar', function ($log) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'views/navbar.html'
        };
    });

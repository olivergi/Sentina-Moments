angular.module('SentinaMoments')
    .directive('menu', function ($log) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'views/menu.html'
        };
    });

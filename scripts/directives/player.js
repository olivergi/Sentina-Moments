angular.module('SentinaMoments')
    .directive('player', function ($log) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'views/player.html'
        };
    });

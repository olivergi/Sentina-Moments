angular.module('SentinaMoments')
    .directive('channels', function ($log) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'views/channels.html'
        };
    });

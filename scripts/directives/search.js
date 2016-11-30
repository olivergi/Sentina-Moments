angular.module('SentinaMoments')
    .directive('search', function ($log) {
        return {
            replace: true,
            restrict: 'E',
            templateUrl: 'views/search.html'
        };
    });

/**
 * Created by misto on 24/11/14.
 */
myModule = angular.module('apiMonitor.controllers', ["ngRoute", "config"]);


myModule.factory('addToken', function () {
    return {
        request: function (config) {
            if (window.localStorage.hasOwnProperty('token')) {
                config.headers['Authorization'] = "Bearer " + window.localStorage.getItem('token');
            }

            return config;
        }
    };

})

myModule.factory('401TokenHttpInterceptor', function ($q, $injector) {

    return {
        'responseError': function (response) {
            if (response.status == 401) {
                //try to make same petition with token
                var deferred = $q.defer();
                var $http = $injector.get('$http');

                var successCallback = function (response) {
                    deferred.resolve(response);
                };

                var errorCallback = function (response) {
                    deferred.reject(response);
                };

                var accessToken = $injector.get('getAccessToken');

                accessToken.post()
                    .success(function (data) {
                        window.localStorage.setItem('token', data.access_token);
                        response.config.headers['Authorization'] = "Bearer " + data.access_token
                        $http(response.config).then(successCallback, errorCallback);
                    })
                    .error(function (data, status) {
                        console.log('error getting token')

                    })

                return deferred.promise;
            }
            return $q.reject(response);
        }
    }
});

myModule.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('401TokenHttpInterceptor');
    $httpProvider.interceptors.push('addToken');
}]);


myModule.controller('baseController', function ($scope, apiMonitor, $http) {

    urls = ['/v4/search?type=speciality', '/v4/me'];
    $scope.urls = urls;
    urls.forEach(function (url) {
        apiMonitor.callUrl(url)
            .success(function (response, status) {
                if (response.records) {
                    item = {'url': url, 'response': response.records.length > 0 ? true : false};
                } else {
                    item = {"url": url, 'response': status == 200}
                }

                $scope.urls = $scope.urls.concat(item);
            })

            .error(function () {
                item = {'url': url, 'response': 'Error'};
                $scope.urls = $scope.urls.concat(item);

            });

    });

})
;

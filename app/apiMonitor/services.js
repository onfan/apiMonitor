myModule = angular.module('apiMonitor.services', []);


myModule.factory('apiMonitor', function($http) {
        var apiServices = {};
        var baseUrl = 'https://www.onfan.com/api';
        apiServices.callUrl = function(url) {
            return $http({
                method: 'GET',
                url: baseUrl + url
            });
        }

        return apiServices;
    });


myModule.factory('getAccessToken', function ($http, config) {
    return {
        post: function () {
            return $http.post(config.oauthUrl, {
                "grant_type": config.grant_type,
                "username": config.username,
                "password": config.password,
                "client_id": config.client_id,
                "client_secret": config.client_secret
            });
        }
    }
});
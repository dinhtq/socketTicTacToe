// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('chat').factory('UserScores', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/userScores/:userId', {
        userId: '@_userId'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
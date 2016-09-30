angular.module('users').controller('usersController', ['$scope', '$http', 'Authentication', 'Socket',
	function($scope, $http, Authentication, Socket) {

	$scope.playersConnected = [];

	Socket.on('signInMessage', function(message) {
		console.log('socket on signInMessage');
		console.dir(message);
		$scope.playersConnected = message;

	});

}]);
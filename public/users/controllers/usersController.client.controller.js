angular.module('users').controller('usersController', ['$scope', '$http', 'Authentication', 'Socket',
	function($scope, $http, Authentication, Socket) {

	$scope.playersConnected = [];

	$scope.topScores = [
		{ user: 'jason', score: 46 },
		{ user: 'jenny', score: 78 },
		{ user: 'jack', score: 50 }
	];

	Socket.on('signInMessage', function(message) {
		console.log('socket on signInMessage');
		console.dir(message);
		$scope.playersConnected = message;

	});

}]);
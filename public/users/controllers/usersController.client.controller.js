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

	// update topScores 
	function updateTopScores(users) {
		// only get users with score prop
		$scope.topScores = users.filter(function(user){
			return user.score !== undefined && user.score !== null;
		});
	};

	// initial ajax call to get list of users
	$http({
		method: 'GET',
		url: '/api/users',

	})
	.then(function successCallback(response){
		updateTopScores(response.data);
	}, function errorCallback(response){
		console.log(response);
	});

	if(Authentication.user) {
		// polling recursion
		(function poll() {
			setTimeout(function(){
				//console.log('polling...');
				$http({
					method: 'GET',
					url: '/api/users'
				})
				.then(function successCallback(response){
					//console.log('success poll');
					updateTopScores(response.data);
					poll();
				}, function errorCallback(response){
					//console.log('error polling');
					//console.log(response);
				});
			}, 30000);
		})();
	}


}]);
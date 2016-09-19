angular.module('chat').controller('signInForm', ['$scope',
	function($scope){

		$scope.username = '';
		$scope.password = '';
		$scope.submit = function() {
			console.log('submit()');
		};
		
}]);
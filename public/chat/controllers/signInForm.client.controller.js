angular.module('chat').controller('signInForm', ['$scope', '$http', 'Authentication', '$window',
	function($scope, $http, Authentication, $window){

		$scope.username = '';
		$scope.password = '';

		$scope.isValid = true;

		$scope.submit = function() {
			$scope.isValid = true;
			validate();
			if ($scope.isValid) {
				sendForm();
			}
		};

		function validate() {
			if ($scope.username.length === 0 || $scope.password.length === 0) {
				$scope.isValid = false;
			} 
		};

		function sendForm() {

			var objData = {
				username: $scope.username,
				password: $scope.password
			};


			// Simple GET request example:
			$http({
			  method: 'POST',
			  url: '/signin',
			  data: objData
			}).then(function successCallback(response) {
			    // do nothing ... server is redirecting
			    console.log('success!');
			    Authentication.user = response.user;
			    $window.location.href = '/';
			  }, function errorCallback(response) {
			  	console.dir(response);
			  	$scope.isValid = false;
			  });
		};

		// binding enter key
		document.getElementById("signInForm")
		    .addEventListener("keyup", function(event) {
		    event.preventDefault();
		    if (event.keyCode == 13) {
		      $scope.submit();
		    }
		});

}]);
// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'idle' module
angular.module('idle', ['ngIdle']);

angular.module('idle')
.controller('EventsCtrl', function($scope, Idle, modals, $window, $location, Authentication) {
    $scope.events = [];

    var idleTime = 10;
    var idleTimeoutTime = 10;
    var keepAliveIntervalTime = 30;

    var idleUiWarning = false;  // does not show session timeout warning


    $scope.$on('IdleStart', function() {
        // the user appears to have gone idle
        console.log('user appears to have gone idle');
        $scope.alert();
    });

    $scope.$on('IdleWarn', function(e, countdown) {
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()

        idleUiWarning = true;

    });

    $scope.$on('IdleTimeout', function() {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
        console.log('User timedout');

        if ($location.path() === "") {
        	console.log('already signed out');
        } else {
        	console.log('signing out');
        	idleUiWarning = false;
        	$window.location.href = '/signout';
        };
        
    });

    $scope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
    });

    $scope.$on('Keepalive', function() {
        // do something to keep the user's session alive
        console.log('user is doing something');
        
    });

    $scope.alert = function() {
    	console.log('alert()');

    };

    $scope.stillHere = function(){
    	console.log('stillHere()');
    };;

})
.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(10); // in seconds
    IdleProvider.timeout(10); // in seconds
    KeepaliveProvider.interval(30); // in seconds
})
.run(function(Idle, $location, Authentication){
    // start watching when the app runs. also starts the Keepalive service by default.
    if (Authentication.user) {
    	console.log('signed in');
    	//Idle.watch();
    }; 
    

});
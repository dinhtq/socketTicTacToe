angular.module('chat').service('Socket', ['Authentication', '$location', '$timeout',
  function(Authentication, $location, $timeout){

    //check whether the user us authenticated
    if (Authentication.user) {
      console.log('in Socket client service');
      //console.log("socket client user  authenticated");
      //log(Authentication.user);
      //create the client object
      //set the service socket property
      this.socket = io();
    }else{
      //console.log("socket client user not authenticated");
      $location.path('/');
    }

    this.on = function(eventName, callback){
      if (this.socket) {
        this.socket.on(eventName, function(data){
          //console.log("socket service this.on");
          $timeout(function(){
            callback(data);
          });
        });
      }
    };

    this.emit = function(eventName, data){
      if (this.socket) {
        //console.log("socket service this.emit");
        this.socket.emit(eventName, data);
      }
    };

    this.removeListener = function(eventName){
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };



  }]);

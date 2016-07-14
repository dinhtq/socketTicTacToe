angular.module('chat').controller('ChatController', ['$scope', 'Socket',
  function($scope, Socket){

    $scope.messages = [];

    //chatMessage event listener that adds retrieved messages to messages[]
    Socket.on('chatMessage', function(message){
      console.log('chat controller Socket.on');
      $scope.messages.push(message);
    });

    //send new messages by emitting the chatMessage event to the socket server
    $scope.sendMessage = function(){
      var message = {
        text: this.messageText
      };

      Socket.emit('chatMessage', message);

      this.messageText = '';
    };

    //remove chatMessage event listener from the socket client
    //the $destroy event will be emitted when the controller instance us deconstructed
    $scope.$on('$destroy', function(){
      Socket.removeListener('chatMessage');
    });



  }]);

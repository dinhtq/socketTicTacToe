angular.module('chat').controller('ChatController', ['$scope', 'Socket',
  function($scope, Socket){

    $scope.messages = [];
    $scope.chatText = "";
    $scope.chatPlaceholder = "chat away...";


    $scope.clickedChatText = function(){
      console.log($scope.chatText);
      // don't send empty chat text
      if($scope.chatText.length > 0){
        console.log('hi');
        // create message
        var message = {
          text: $scope.chatText
        };
        //send message to server
        Socket.emit('chatMessage', message);
        //clear input
        $scope.chatText = "";
        //set input focus
        angular.element('#inputChat').focus();
      }

    };



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

    //chatMessage event listener that adds retrieved messages to messages[]
    Socket.on('chatMessage', function(message){
      console.log('chat controller Socket.on');
      
      // scroll chat container view up
      
      $scope.messages.push(message);
    });

  }]);

















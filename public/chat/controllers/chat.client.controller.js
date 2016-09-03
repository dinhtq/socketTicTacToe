angular.module('chat').controller('ChatController', ['$scope', 'Socket',
  function($scope, Socket){

    $scope.messages = [];
    $scope.chatText = "";
    $scope.chatPlaceholder = "chat away...";

    var eleMiddleChatContainer; 

    $scope.clickedChatText = function(){
      console.log($scope.chatText);
      // don't send empty chat text
      if($scope.chatText.length > 0){

        // create message
        var message = {
          text: $scope.chatText
        };
        //send message to server
        Socket.emit('chatMessage', message);
        //clear input
        $scope.chatText = "";
        //set input focus
        document.getElementById('#inputChat').focus();


      }

    };



    //send new messages by emitting the chatMessage event to the socket server
    $scope.sendMessage = function(){
      console.log('sendMessage');
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
            
      $scope.messages.push(message);

      eleMiddleChatContainer = document.getElementById('middleChatContainer');

    });

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
       console.log('Event captured in the controller, when finished rendering');
       eleMiddleChatContainer.scrollTop = eleMiddleChatContainer.scrollHeight;
 
    });

    // binding enter key
    document.getElementById("inputChat")
        .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          $scope.clickedChatText();
        }
    });

  }]);

















angular.module('chat').controller('ClickController', ['$scope', 'Socket',
  function($scope, Socket){

    $scope.counter = 0;

    Socket.on('btnClicked', function(counter){
      console.log("socket.on");
      $scope.counter = counter;
    });


    $scope.sendMessage = function(){

      var counter = $scope.counter + 1;

      Socket.emit('btnClicked', counter);

    };

    $scope.$on('$destroy', function(){
      Socket.removeListener('btnClicked');
    });



  }]);

angular.module('chat').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/chat', {
      templateUrl: 'chat/views/chat.client.view.html'
    }).
    when('/click', {
      templateUrl: 'chat/views/click.client.view.html'
    }).
    when('/', {
      templateUrl: 'chat/views/tictactoe.client.view.html'
    });
  }]);

var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');

module.exports = function(server, io, mongoStore){

  //intercept the handshake

  io.use(function(socket, next){
    //parse handshake cookie and retrieve Express sessionId
    cookieParser(config.sessionSecret)(socket.request, {},
    function(err){
      var sessionId = socket.request.signedCookies['connect.sid'];
      //retrieve session information from MongoDB storage
      mongoStore.get(sessionId, function(err, session){
        socket.request.session = session;
        //populate session's user object according to the session information
        passport.initialize()(socket.request, {}, function(){
          passport.session()(socket.request, {}, function(){
            //if user is authenticated
            if (socket.request.user) {
              next(null, true);
            }
            //else, inform socketio that socket connection cannot be opened
            else{
              console.log('user is not authenticated');
              next(new Error('User is not authenticated'), false);
            }
          })
        });
      });
    });
  });


  var clientsConnected = [];

  var RoomData = {
    "1": {
      "Players": []
    },
    "2": {
      "Players": []
    },
    "3": {
      "Players": []
    }
  };

  //configure socket server to include server handlers
  io.on('connection', function(socket){

    console.log(socket.request.user.username + ' connected');

    clientsConnected.push(socket.request.user.username);
    console.log(clientsConnected);

    //console.log('user connected' + JSON.stringify(socket.request));
    require('../app/controllers/chat.server.controller')(io, socket);
    require('../app/controllers/tictactoe.server.controller')(io, socket, clientsConnected, RoomData);

  });










};

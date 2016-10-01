module.exports = function(io, socket, clientsConnected, RoomData){

  //inform all sockets about the newly connected user
  io.emit('signInMessage', clientsConnected);


  socket.on('join', function(roomToJoin){
    console.log(socket.request.user.username + ' wants to join ' + roomToJoin.room);
    //update RoomData
    RoomData[roomToJoin.room].Players.push(socket.request.user.username);

    //join room
    socket.join(roomToJoin.room);

    //broadcast to everyone in the room that player has joined
    var strRoomJoined = roomToJoin.room.toString();
    var joinMessage = {
      player: socket.request.user.username,
      roomJoined: strRoomJoined,
      roomData: RoomData
    };

    //let other clients in the room know
    io.in(roomToJoin.room).emit('joinMessage', joinMessage);

    //let all clients know
    io.emit('joinMessageGlobal', joinMessage);

    console.log(socket.request.user.username + ' joined room ' + roomToJoin.room);
    console.log(RoomData);

  });


  //play again message
  socket.on('playAgain', function(playAgainMessage){
    console.log("on playAgain");
    io.in(playAgainMessage.room).emit('playAgain', playAgainMessage);
  });

  //tictactoe event handler
  socket.on('tictactoe', function(messagePlayer){
    io.in(messagePlayer.room).emit('tictactoe', messagePlayer);
  });

  socket.on('leaveMessage', function(leaveMessage){
    console.log('socket on leaveMessage');

    socket.leave(leaveMessage.room);

    //let clients know that player left
    var leftRoomMessage = {
      player: socket.request.user.username,
      room: leaveMessage.room
    };
    //inform the room that client left
    io.in(leaveMessage.room).emit('leftRoomMessage', leftRoomMessage);

    // remove client from RoomData
    var indexPlayerInRoomData = RoomData[leaveMessage.room].Players.indexOf(socket.request.user.username);
    // console.log('indexPlayerInRoomData: ' + indexPlayerInRoomData);
    RoomData[leaveMessage.room].Players.splice(indexPlayerInRoomData, 1);

    //inform everyone that someone left
    var leftRoomMessage = {
      roomData: RoomData,
      roomLeft: leaveMessage.room
    };
    io.emit('leftRoomMessageGlobal', leftRoomMessage);

    console.log(socket.request.user.username + ' left room ' + leaveMessage.room);
    console.log(RoomData);
  });



  //event handler - inform all sockets about disconnected player
  socket.on('disconnectMessage', function(disconnectMessage){
    console.log('socket on disconnectMessage');
    console.log(socket.request.user.username + ' disconnected');
    //remove user from clientsConnected
    var indexUser = clientsConnected.indexOf(disconnectMessage.username);
    clientsConnected.splice(indexUser, 1);
    console.log(clientsConnected);

    //remove user from RoomData
    console.log(RoomData);
    console.log('disconnectMessage = ');
    console.log(disconnectMessage);
    var indexFound = RoomData[disconnectMessage.room].Players.indexOf(disconnectMessage.username);
    console.log('indexFound: ' + indexFound);
    RoomData[disconnectMessage.room].Players.splice(indexFound, 1);
    console.log(RoomData);

    io.emit('signInMessage', clientsConnected);
    
  });

  socket.on('disconnect', function(){
    console.log('socket on disconnect');
    console.log(socket.request.user.username + ' disconnected');
    //remove user from clientsConnected
    var indexUser = clientsConnected.indexOf(socket.request.user.username);
    clientsConnected.splice(indexUser, 1);

    console.log(RoomData);
    //remove user from RoomData
    for (var room in RoomData) {
      for (var userIndex in RoomData[room].Players) {
        if (RoomData[room].Players[userIndex] === socket.request.user.username) {
          RoomData[room].Players.splice(userIndex, 1);
        }
      }
    }

    console.log(RoomData);
    io.emit('signInMessage', clientsConnected);

  });


};

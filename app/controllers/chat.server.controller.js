module.exports = function(io, socket) {


  //inform all the socket clients about the newly connected user

  io.emit('chatMessage', {
    type: 'status',
    text: 'connected',
    created: Date.now(),
    username: socket.request.user.username
  });


  // chatMessage event handler that will take care of messages sent from the
  // socket client
  socket.on('chatMessage', function(message){
    message.type = 'message';
    message.created = Date.now();
    message.username = socket.request.user.username;

    console.log("in socket.on and message is: " + message.text);
    //send modified message object to all connected socket clients
    io.emit('chatMessage', message);
  });


  //btnClicked event handler
  socket.on('btnClicked', function(counter){
    io.emit('btnClicked', counter);
  });







  socket.on('disconnect', function(){
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username
    });
  });
  


};

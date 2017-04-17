'use strict';

var socketIO = require('socket.io');

module.exports = function(server){
  var io = socketIO(server);

  io.on('connection', function(socket){
    // Socket joinRoom with roomId from data https://socket.io/docs/rooms-and-namespaces/
    socket.on('joinRoom', function(data){
      console.log("Chat Room - Joined room: " + JSON.stringify(data));
      socket.room = data.room; // dynamic variable will be used by other actions
      socket.join(data.room);
    });


    socket.on('chatMessage', function(data){
      console.log("Chat Room - Received a message: " + JSON.stringify(data));
      io.to(socket.room).emit('chatMessage', data);
    });

    socket.on('disconnect', function(){
      console.log("Chat Room - Leaving the room ");
      socket.leave(socket.room);
    });
  })
}

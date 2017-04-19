'use strict';

var ot = require('ot'); // operational-transformation
var socketIO = require('socket.io');
var roomList = {};

module.exports = function(server){
  var io = socketIO(server);

  io.on('connection', function(socket){
    // Socket joinRoom with roomId from data https://socket.io/docs/rooms-and-namespaces/
    socket.on('joinRoom', function(data){
      console.log("Chat Room - Joined room: " + JSON.stringify(data));

      // Setup ot EditorSocketIOServer
      if(!roomList[data.room]){
        var str = 'Welcome to CodePad! Share your code below';

        // Whenever there is change in code editor
        roomList[data.room] = new ot.EditorSocketIOServer(str,[], data.room, function(socket, cb){
          console.log("Change happening in " + JSON.stringify(data.room));
          var self = this;
          Task.findByIdAndUpdate(data.room, {content: self.document}, function(err){
            if(err) return cb(false);
            cb(true);
          });
        });
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);

      socket.room = data.room; // dynamic variable will be used by other actions
      socket.join(data.room);
    });

    // Chat box
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

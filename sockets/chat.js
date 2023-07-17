module.exports = (io, socket, onlineUsers, channels) => {
    socket.on('new user', (username) => {
      // socket.channels = channels
      //Save the username as key to access the user's socket id
      onlineUsers[username] = socket.id;
      //Save the username to socket as well. This is important for later.
      socket["username"] = username;
      console.log(socket.rooms)
      console.log(`✋ ${username} has joined the chat! ✋`);
      io.emit("new user", username);
    });
  
    socket.on('new message', (data) => {
      channels[data.channel].push({ sender: data.sender, message: data.message });
      io.to(data.channel).emit('new message', data);
    });
  
    socket.on('get online users', () => {
      // Send over the onlineUsers
      socket.emit('get online users', onlineUsers);
    });
  
    socket.on('get all channels', () => {
      // Send the list of all channels and messages
      socket.emit('get all channels', channels)
    })
    
    socket.on('new channel', (newChannel) => {
      channels[newChannel] = [];
      socket.join(newChannel);
      io.emit('new channel', newChannel);
      socket.emit('user changed channel', {
        channel: newChannel,
        messages: channels[newChannel]
      });
    });
  
    socket.on('disconnect', (username) => {
      // This deletes the user by using the username we saved to the socket
      delete onlineUsers[socket.username];
      io.emit('user has left', onlineUsers);
    });
  
    socket.on('user changed channel', (newChannel) => {
      socket.join(newChannel);
      socket.emit('user changed channel', {
        channel : newChannel,
        messages : channels[newChannel]
      });
    });
  }
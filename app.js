//app.js
const express = require('express');
const app = express();
const server = require('http').Server(app);

// Socket.io
const io = require('socket.io')(server);
// We'll store our online users here
let onlineUsers = {};
// And store channels here
let channels = {"General": []};

io.on("connection", (socket) => {
  // This file will be read on new socket connections
  require('./sockets/chat.js')(io, socket, onlineUsers, channels);

  // Emit the list of channels and messages to newly connected user
  socket.emit('get all channels', channels);
  console.log("New user connected!");
});

// Express View Engine for Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Establish your public folder
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('index.handlebars');
});

server.listen('3000', () => {
  console.log('Server listening on Port 3000');
});
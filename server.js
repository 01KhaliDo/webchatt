const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static('public'));

const users = {};   // socket.id => username
const sockets = {}; // username => socket.id

io.on('connection', (socket) => {
  console.log('En användare anslöt:', socket.id);

  // När en användare skickar sitt användarnamn
  socket.on('set username', (username) => {
    users[socket.id] = username;
    sockets[username] = socket.id;
    console.log(`Användare satte namn: ${username}`);

    // Uppdatera alla användare
    io.emit('user list', Object.values(users));
  });

  // Hantera privata meddelanden
  socket.on('private message', ({ to, message }) => {
    const fromUsername = users[socket.id];
    const toSocketId = sockets[to];
    if (fromUsername && toSocketId) {
      io.to(toSocketId).emit('private message', {
        from: fromUsername,
        message
      });
    }
  });

  // 👇 Hantera "skriver..." händelser
  socket.on('typing', ({ to }) => {
    const fromUsername = users[socket.id];
    const toSocketId = sockets[to];
    if (fromUsername && toSocketId) {
      io.to(toSocketId).emit('typing', { from: fromUsername });
    }
  });

  socket.on('stop typing', ({ to }) => {
    const fromUsername = users[socket.id];
    const toSocketId = sockets[to];
    if (fromUsername && toSocketId) {
      io.to(toSocketId).emit('stop typing', { from: fromUsername });
    }
  });

  // När en användare kopplar från
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log('En användare kopplade från:', username);
    delete sockets[username];
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

http.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});

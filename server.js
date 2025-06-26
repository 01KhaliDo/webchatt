<<<<<<< HEAD
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static('public'));

const users = {}; // socket.id => username
const sockets = {}; // username => socket.id

io.on('connection', (socket) => {
  console.log('En användare anslöt:', socket.id);

  // Ta emot användarnamn från klienten
  socket.on('set username', (username) => {
    users[socket.id] = username;
    sockets[username] = socket.id;
    console.log(`Användare satte namn: ${username}`);

    // Skicka till klienten listan på alla användare
    io.emit('user list', Object.values(users));
  });

  // Ta emot privat meddelande
  socket.on('private message', ({ to, message }) => {
    const targetSocketId = sockets[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('private message', {
        from: users[socket.id],
        message,
      });
    }
  });

  // När någon disconnectar
  socket.on('disconnect', () => {
    console.log('En användare kopplade från:', socket.id);
    const username = users[socket.id];
    delete sockets[username];
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

http.listen(port, () => {
  console.log(`Servern kör på http://192.168.1.237:${port}`);
});
=======
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static('public'));

const users = {}; // socket.id => username
const sockets = {}; // username => socket.id

io.on('connection', (socket) => {
  console.log('En användare anslöt:', socket.id);

  // Ta emot användarnamn från klienten
  socket.on('set username', (username) => {
    users[socket.id] = username;
    sockets[username] = socket.id;
    console.log(`Användare satte namn: ${username}`);

    // Skicka till klienten listan på alla användare
    io.emit('user list', Object.values(users));
  });

  // Ta emot privat meddelande
  socket.on('private message', ({ to, message }) => {
    const fromUsername = users[socket.id];
    if (!fromUsername) {
      console.warn(`Meddelande från socket utan användarnamn: ${socket.id}`);
      return; // Skicka inte vidare om användarnamn saknas
    }

    const targetSocketId = sockets[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('private message', {
        from: fromUsername,
        message,
      });
    }
  });

  // När någon disconnectar
  socket.on('disconnect', () => {
    console.log('En användare kopplade från:', socket.id);
    const username = users[socket.id];
    delete sockets[username];
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

http.listen(port, () => {
  console.log(`Servern kör på http://192.168.1.237:${port}`);
});
>>>>>>> 7a336d9 (Din beskrivning här)

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('join room', ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit('chat message', { username: 'System', message: `${username} joined the room.` });
    });

    socket.on('chat message', ({ username, room, message }) => {
        io.to(room).emit('chat message', { username, message });
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
